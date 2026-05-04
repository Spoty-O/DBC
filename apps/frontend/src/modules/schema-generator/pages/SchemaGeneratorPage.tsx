import { useCallback, useState } from "react";
import type { GenerateResponse } from "types";
import { cn } from "../../../lib/utils";
import BackgroundComponent from "../../common/components/background/background.component";
import { getGenerateErrorMessage, postGenerate } from "../api/generate";
import { ResultPreview } from "../components/ResultPreview";
import { SchemaRequestForm } from "../components/SchemaRequestForm";
import type { GenerateFormValues } from "../validation/generate-form.schema";

export function SchemaGeneratorPage({ className }: { className?: string }) {
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (values: GenerateFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const data = await postGenerate({
        text: values.text,
        resultType: values.resultType,
      });
      setResult(data);
    } catch (e) {
      setResult(null);
      setError(getGenerateErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return (
    <div className={cn("relative min-h-svh text-emerald-50", className)}>
      <BackgroundComponent />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 sm:px-6 lg:px-8">
        <header className="space-y-2 rounded-xl border border-matrix-border/40 bg-matrix-panel/50 px-5 py-6 shadow-matrix backdrop-blur-panel sm:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-emerald-500/80">
            Schema control
          </p>
          <h1 className="font-mono text-2xl font-semibold tracking-tight text-matrix-glow sm:text-3xl">
            Database schema generator
          </h1>
          <p className="max-w-2xl font-sans text-sm leading-relaxed text-emerald-100/75 sm:text-base">
            Submit business rules as natural language. The service returns
            TypeORM entities, a Prisma schema, or SQL DDL plus a concise
            technical summary.
          </p>
        </header>

        <div className="flex flex-col gap-8 lg:gap-10">
          <SchemaRequestForm
            onSubmit={handleSubmit}
            isSubmitting={loading}
            onClearAll={clearOutput}
          />
          <ResultPreview result={result} error={error} />
        </div>
      </div>
    </div>
  );
}
