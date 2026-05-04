import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import type { IGeneratedDatabaseSchemaField } from "types";
import type { SchemaTableNode } from "./schema-flow-layout";

export const TableFlowNode = memo(function TableFlowNode(
  props: NodeProps<SchemaTableNode>,
) {
  const t = props.data.table;
  const fields = t.fields ?? [];

  return (
    <div className="min-w-[232px] max-w-[260px] rounded-lg border border-matrix-border/70 bg-[rgba(2,12,4,0.94)] font-mono shadow-matrix backdrop-blur-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border !border-matrix-glow/50 !bg-black"
      />
      <div className="border-b border-matrix-border/50 bg-emerald-950/35 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-matrix-glow">
        {t.name}
      </div>
      <ul className="max-h-[220px] overflow-y-auto px-2 py-1 text-[10px] leading-tight">
        {fields.map((f: IGeneratedDatabaseSchemaField) => (
          <li
            key={f.name}
            className="flex items-baseline justify-between gap-2 border-b border-white/[0.06] py-1 last:border-0"
          >
            <span className="min-w-0 flex-1 truncate text-emerald-100/95">
              {f.name}
              {f.primary ? (
                <span className="ml-1 text-amber-300/90">·pk</span>
              ) : null}
            </span>
            <span className="shrink-0 text-emerald-500/75">{f.type}</span>
          </li>
        ))}
      </ul>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border !border-matrix-glow/50 !bg-black"
      />
    </div>
  );
});
