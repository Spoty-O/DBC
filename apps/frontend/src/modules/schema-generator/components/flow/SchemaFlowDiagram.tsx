import { useEffect, useMemo, useRef } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import type { GeneratedSchema } from "types";
import { applyDagreLayout, buildFlowFromModel, type SchemaTableNode } from "./schema-flow-layout";
import { TableFlowNode } from "./TableFlowNode";

import "@xyflow/react/dist/style.css";

const nodeTypes = {
  tableNode: TableFlowNode,
} satisfies NodeTypes;

const edgeStroke = "rgba(57, 255, 20, 0.42)";
const edgeLabelFill = "rgba(204, 251, 229, 0.92)";

type SchemaFlowDiagramProps = {
  model: GeneratedSchema;
};

/** Interactive ER-style graph from LLM `model` (auto-layout via Dagre). */
export function SchemaFlowDiagram({ model }: SchemaFlowDiagramProps) {
  const rf = useRef<ReactFlowInstance<SchemaTableNode, Edge> | null>(null);
  const modelKey = useMemo(() => JSON.stringify(model), [model]);

  const [nodes, setNodes, onNodesChange] = useNodesState<SchemaTableNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    const raw = buildFlowFromModel(model);
    const laid = applyDagreLayout(raw.nodes, raw.edges);
    setNodes(laid.nodes);
    setEdges(laid.edges);
    const id = requestAnimationFrame(() => {
      rf.current?.fitView({ padding: 0.15, maxZoom: 1.2 });
    });
    return () => cancelAnimationFrame(id);
  }, [modelKey, model, setNodes, setEdges]);

  return (
    <div className="schema-flow-pane h-[min(58vh,600px)] w-full min-h-[320px] rounded-lg border border-matrix-border/50 bg-black/40 shadow-inner">
      <ReactFlow<SchemaTableNode, Edge>
        onInit={(instance) => {
          rf.current = instance;
          instance.fitView({ padding: 0.15, maxZoom: 1.2 });
        }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.15, maxZoom: 1.2 }}
        minZoom={0.15}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { stroke: edgeStroke, strokeWidth: 1.5 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 18,
            height: 18,
            color: edgeStroke,
          },
          labelStyle: {
            fill: edgeLabelFill,
            fontSize: 9,
            fontFamily: "JetBrains Mono, ui-monospace, monospace",
            fontWeight: 500,
          },
          labelBgPadding: [4, 2] as [number, number],
          labelBgBorderRadius: 4,
          labelBgStyle: {
            fill: "rgba(0,0,0,0.78)",
            stroke: "rgba(57,255,20,0.25)",
          },
        }}
        className="schema-flow"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="rgba(57, 255, 20, 0.12)"
        />
        <Controls
          className="!m-2 !overflow-hidden !rounded-md !border !border-matrix-border/50 !bg-black/70 !shadow-matrix"
          showInteractive={false}
        />
        <MiniMap
          className="!m-2 !rounded-md !border !border-matrix-border/40 !bg-black/60"
          nodeStrokeWidth={2}
          nodeColor={() => "rgba(22, 101, 52, 0.85)"}
          maskColor="rgba(0,0,0,0.72)"
        />
      </ReactFlow>
    </div>
  );
}
