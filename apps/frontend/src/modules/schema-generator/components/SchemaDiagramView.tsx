import { lazy, Suspense, useMemo } from "react";
import type { GeneratedSchema } from "types";
import { cn } from "../../../lib/utils";

const SchemaFlowDiagram = lazy(() =>
  import("./flow/SchemaFlowDiagram").then((m) => ({
    default: m.SchemaFlowDiagram,
  })),
);

type SchemaDiagramViewProps = {
  model: GeneratedSchema;
  className?: string;
};

/** LLM `model` + interactive flow graph (lazy-loaded). */
export function SchemaDiagramView({ model, className }: SchemaDiagramViewProps) {
  const tables = model.tables ?? [];
  const flowKey = useMemo(
    () => (model.tables ?? []).map((t) => t.name).join("|") || "empty",
    [model.tables],
  );

  if (tables.length === 0) {
    return (
      <p className="font-mono text-sm text-emerald-600/90">
        No tables in the structured model.
      </p>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      <p className="font-sans text-sm text-emerald-100/75">
        {tables.length} table{tables.length === 1 ? "" : "s"} — drag to pan, scroll
        to zoom. Edges show foreign keys (merged when multiple columns reference the
        same table).
      </p>
      <Suspense
        fallback={
          <div className="flex h-[min(58vh,600px)] min-h-[320px] items-center justify-center rounded-lg border border-matrix-border/40 bg-black/30 font-mono text-sm text-emerald-500/80">
            Loading diagram…
          </div>
        }
      >
        <SchemaFlowDiagram key={flowKey} model={model} />
      </Suspense>
    </div>
  );
}
