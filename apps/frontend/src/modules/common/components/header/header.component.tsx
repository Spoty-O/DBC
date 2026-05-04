import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { text } from "../../consts";
import { cn } from "../../../../lib/utils";
import type { IBasicProps } from "../../types/props.types";

interface IProps extends IBasicProps {}

const HeaderComponent = ({ className }: IProps) => {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-matrix-border/35 bg-black/50 shadow-matrix backdrop-blur-panel",
        "supports-[backdrop-filter]:bg-[rgba(2,12,4,0.55)]",
        className,
      )}
    >
      <div className="mx-auto flex h-11 max-w-5xl items-center justify-center px-4 sm:h-12 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleClick}
          className="font-mono text-[11px] font-medium uppercase tracking-[0.4em] text-emerald-500/90 transition-colors hover:text-matrix-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-matrix-glow/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:text-xs"
        >
          {text.header}
        </button>
      </div>
    </header>
  );
};

export default HeaderComponent;
