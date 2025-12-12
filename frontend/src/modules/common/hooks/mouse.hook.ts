import { useEffect, useRef } from "react";
import type { IMousePosition } from "../types";

export const useMousePosition = () => {
  const mousePos = useRef<IMousePosition>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      mousePos.current = { x: ev.clientX, y: ev.clientY };
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);
  return mousePos;
};
