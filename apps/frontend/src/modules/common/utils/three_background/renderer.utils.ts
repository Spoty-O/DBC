import * as THREEGL from "three";

export const getRenderer = (canvas: HTMLCanvasElement) => {
  const params: THREEGL.WebGLRendererParameters = {
    antialias: true,
    canvas: canvas,
    alpha: true,
    powerPreference: "high-performance",
  };
  return new THREEGL.WebGLRenderer(params);
};
