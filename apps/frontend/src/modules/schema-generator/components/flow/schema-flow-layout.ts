import dagre from "@dagrejs/dagre";
import type { Edge, Node } from "@xyflow/react";
import type { GeneratedSchema, IGeneratedDatabaseSchemaTable } from "types";

export type SchemaTableNode = Node<
  { table: IGeneratedDatabaseSchemaTable },
  "tableNode"
>;

const NODE_WIDTH = 260;
const HEADER = 34;
const ROW = 20;
const PADDING = 10;

function tableHeight(fieldCount: number): number {
  return HEADER + Math.max(1, fieldCount) * ROW + PADDING;
}

/** Build React Flow nodes/edges from LLM `model` (validated `GeneratedSchema`). */
export function buildFlowFromModel(model: GeneratedSchema): {
  nodes: SchemaTableNode[];
  edges: Edge[];
} {
  const tables = model.tables ?? [];
  const nodes: SchemaTableNode[] = tables.map((t) => {
    const fc = t.fields?.length ?? 0;
    const h = tableHeight(fc);
    return {
      id: t.name,
      type: "tableNode",
      position: { x: 0, y: 0 },
      data: { table: t },
      width: NODE_WIDTH,
      height: h,
    } as SchemaTableNode;
  });

  /** Dagre graphlib is not a multigraph — collapse parallel FKs between same tables. */
  const pairLabels = new Map<string, string[]>();

  for (const t of tables) {
    for (const f of t.fields ?? []) {
      const ref = f.references;
      if (!ref) continue;
      if (ref.table === t.name) continue;
      if (!tables.some((x) => x.name === ref.table)) continue;
      const key = `${t.name}\t${ref.table}`;
      const line = `${f.name} → ${ref.table}.${ref.field}`;
      const prev = pairLabels.get(key) ?? [];
      if (!prev.includes(line)) prev.push(line);
      pairLabels.set(key, prev);
    }
  }

  const edges: Edge[] = [];
  for (const [key, labels] of pairLabels) {
    const [source, target] = key.split("\t");
    edges.push({
      id: `e-${source}-${target}`,
      source,
      target,
      label: labels.join(" · "),
      animated: true,
    });
  }

  return { nodes, edges };
}

export function applyDagreLayout(
  nodes: SchemaTableNode[],
  edges: Edge[],
): { nodes: SchemaTableNode[]; edges: Edge[] } {
  if (nodes.length === 0) return { nodes, edges };

  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: "LR",
    nodesep: 56,
    ranksep: 96,
    marginx: 28,
    marginy: 28,
  });

  for (const n of nodes) {
    const w = typeof n.width === "number" ? n.width : NODE_WIDTH;
    const h = typeof n.height === "number" ? n.height : tableHeight(1);
    g.setNode(n.id, { width: w, height: h });
  }
  for (const e of edges) {
    g.setEdge(e.source, e.target);
  }
  dagre.layout(g);

  const nextNodes: SchemaTableNode[] = nodes.map((node) => {
    const pos = g.node(node.id);
    const w = typeof node.width === "number" ? node.width : NODE_WIDTH;
    const h = typeof node.height === "number" ? node.height : tableHeight(1);
    return {
      ...node,
      position: {
        x: pos.x - w / 2,
        y: pos.y - h / 2,
      },
    } as SchemaTableNode;
  });

  return { nodes: nextNodes, edges };
}
