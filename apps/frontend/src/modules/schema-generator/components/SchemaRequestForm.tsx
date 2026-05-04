import { useForm } from "react-hook-form";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { OutputTypeSelect } from "./OutputTypeSelect";
import {
  generateFormSchema,
  type GenerateFormValues,
} from "../validation/generate-form.schema";

type SchemaRequestFormProps = {
  onSubmit: (values: GenerateFormValues) => Promise<void>;
  isSubmitting: boolean;
  onClearAll?: () => void;
};

export function SchemaRequestForm({
  onSubmit,
  isSubmitting,
  onClearAll,
}: SchemaRequestFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<GenerateFormValues>({
    defaultValues: {
      text: "",
      resultType: "sql",
    },
  });

  const submit = handleSubmit(async (raw) => {
    const parsed = generateFormSchema.safeParse(raw);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      if (fieldErrors.text?.[0]) {
        setError("text", { type: "manual", message: fieldErrors.text[0] });
      }
      if (fieldErrors.resultType?.[0]) {
        setError("resultType", {
          type: "manual",
          message: fieldErrors.resultType[0],
        });
      }
      return;
    }
    await onSubmit(parsed.data);
  });

  const clear = () => {
    reset({ text: "", resultType: "sql" });
    onClearAll?.();
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col gap-6 rounded-xl border border-matrix-border bg-matrix-panel p-5 shadow-matrix backdrop-blur-panel sm:p-6"
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="business-rules" className="text-emerald-100/90">
          Business rules
        </Label>
        <Textarea
          id="business-rules"
          placeholder="Describe entities, fields, constraints, and relationships in plain language…"
          rows={12}
          disabled={isSubmitting}
          {...register("text")}
        />
        {errors.text?.message ? (
          <p className="text-sm text-red-400/90" role="alert">
            {errors.text.message}
          </p>
        ) : null}
      </div>

      <OutputTypeSelect
        id="result-type"
        label="Output format"
        disabled={isSubmitting}
        error={errors.resultType?.message}
        {...register("resultType")}
      />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
          {isSubmitting ? "Generating…" : "Generate"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={clear}
          disabled={isSubmitting}
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
