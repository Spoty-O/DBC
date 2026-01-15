import type { ShaderMaterial, ShaderMaterialParameters, Texture } from "three";

interface IUniforms {
  uniforms: {
    iTime: { value: number };
    iResolution: {
      value: [number, number, number];
    };
    iChannel0: { value: Texture };
    uCellSize: { value: number };
  };
}

export type TMatrixProps = {
  cellSize: number;
  strength: number;
  speedMul: number;
  seed: number;
  z?: number;
};

export type TShaderMaterial = ShaderMaterial & IUniforms;
export type TShaderParams = ShaderMaterialParameters & IUniforms;
