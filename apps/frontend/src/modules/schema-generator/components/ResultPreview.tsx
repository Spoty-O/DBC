import { useEffect, useState } from "react";
import type { GenerateResponse } from "types";
import { Button } from "../../../components/ui/button";
import { CopyButton } from "./CopyButton";
import { SchemaDiagramView } from "./SchemaDiagramView";
import { cn } from "../../../lib/utils";

type ResultPreviewProps = {
  result: GenerateResponse | null;
  error: string | null;
  className?: string;
};

type ResultTab = "output" | "diagram";

export function ResultPreview({ result, error, className }: ResultPreviewProps) {
  const [tab, setTab] = useState<ResultTab>("output");

  useEffect(() => {
    if (result) setTab("output");
  }, [result]);

  if (error) {
    return (
      <section
        className={cn(
          "rounded-xl border border-red-500/35 bg-red-950/30 p-5 shadow-matrix backdrop-blur-panel",
          className,
        )}
        aria-live="polite"
      >
        <h2 className="mb-2 font-mono text-sm font-semibold uppercase tracking-widest text-red-300/90">
          Error
        </h2>
        <p className="whitespace-pre-wrap font-mono text-sm text-red-100/90">
          {error}
        </p>
      </section>
    );
  }

  if (!result) {
    return (
      <section
        className={cn(
          "rounded-xl border border-matrix-border/25 border-dashed bg-matrix-panel/40 p-6 text-center shadow-matrix backdrop-blur-panel",
          className,
        )}
      >
        <p className="font-mono text-sm text-emerald-600/90">
          Generated schema and description will appear here.
        </p>
      </section>
    );
  }

  const combined = `${result.schema}\n\n---\n\n${result.description}`;

  return (
    <section
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-matrix-border bg-matrix-panel p-5 shadow-matrix backdrop-blur-panel sm:p-6",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Result view"
          className="flex w-full max-w-md gap-1 rounded-lg border border-matrix-border/40 bg-black/30 p-1 sm:w-auto"
        >
          <Button
            type="button"
            role="tab"
            aria-selected={tab === "output"}
            variant={tab === "output" ? "default" : "ghost"}
            size="sm"
            className="flex-1 font-mono text-xs sm:flex-none"
            onClick={() => setTab("output")}
          >
            Code & summary
          </Button>
          <Button
            type="button"
            role="tab"
            aria-selected={tab === "diagram"}
            variant={tab === "diagram" ? "default" : "ghost"}
            size="sm"
            className="flex-1 font-mono text-xs sm:flex-none"
            onClick={() => setTab("diagram")}
          >
            Diagram
          </Button>
        </div>

        {tab === "output" ? (
          <div className="flex flex-wrap gap-2">
            <CopyButton text={result.schema} label="Copy schema" />
            <CopyButton text={result.description} label="Copy description" />
            <CopyButton text={combined} label="Copy all" />
          </div>
        ) : (
          <CopyButton
            text={JSON.stringify(result.model, null, 2)}
            label="Copy model JSON"
          />
        )}
      </div>

      {tab === "output" ? (
        <>
          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-500/90">
              Schema
            </h3>
            <pre className="max-h-[min(55vh,520px)] overflow-auto rounded-lg border border-matrix-border/40 bg-black/55 p-4 font-mono text-xs leading-relaxed text-emerald-100/95 shadow-inner sm:text-sm">
              {result.schema}
            </pre>
          </div>

          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-emerald-500/90">
              Description
            </h3>
            <p className="rounded-lg border border-matrix-border/40 bg-black/40 p-4 font-sans text-sm leading-relaxed text-emerald-100/90">
              {result.description}
            </p>
          </div>
        </>
      ) : (
        <SchemaDiagramView model={result.model} />
      )}
    </section>
  );
}
