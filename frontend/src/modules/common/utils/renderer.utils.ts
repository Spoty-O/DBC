import * as THREEGL from "three";
import * as THREEGP from "three/webgpu";

export const getRenderer = (canvas: HTMLCanvasElement) => {
  const params = {
    antialias: true,
    canvas: canvas,
  };
  if (!navigator.gpu) {
    console.log("WebGPU not supported");
    return new THREEGL.WebGLRenderer(params);
  }
  return new THREEGP.WebGPURenderer(params);
};
