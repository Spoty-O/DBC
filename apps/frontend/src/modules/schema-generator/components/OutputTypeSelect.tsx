import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "../../../lib/utils";
import { Label } from "../../../components/ui/label";
import type { SchemaResultType } from "types";

const OPTIONS: { value: SchemaResultType; label: string }[] = [
  { value: "typeorm", label: "TypeORM entities" },
  { value: "prisma", label: "Prisma schema" },
  { value: "sql", label: "SQL DDL" },
];

export type OutputTypeSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id?: string;
  label?: string;
  error?: string;
};

export const OutputTypeSelect = forwardRef<HTMLSelectElement, OutputTypeSelectProps>(
  ({ className, id, label = "Output format", error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {label ? (
          <Label htmlFor={id} className="text-emerald-100/90">
            {label}
          </Label>
        ) : null}
        <select
          id={id}
          ref={ref}
          className={cn(
            "h-10 w-full max-w-xs rounded-md border border-matrix-border bg-black/45 px-3 font-mono text-sm text-matrix-glow shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matrix-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500/60 ring-1 ring-red-500/30",
            className,
          )}
          {...props}
        >
          {OPTIONS.map((o) => (
            <option
              key={o.value}
              value={o.value}
              className="bg-neutral-950 text-emerald-100"
            >
              {o.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-sm text-red-400/90" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
OutputTypeSelect.displayName = "OutputTypeSelect";
