import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { cn } from "../../../lib/utils";

type CopyButtonProps = {
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  disabled?: boolean;
};

export function CopyButton({
  text,
  label = "Copy",
  copiedLabel = "Copied",
  className,
  disabled,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    if (!text || disabled) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("font-mono text-xs", className)}
      onClick={handle}
      disabled={disabled || !text}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
