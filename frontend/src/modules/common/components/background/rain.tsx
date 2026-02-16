import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtlas } from "@common/utils";
import fragment from "../../../../assets/shaders/test.glsl";
import vertex from "../../../../assets/shaders/matrix.vertex.glsl";
import type {
  TMatrixProps,
  TShaderMaterial,
  TShaderParams,
} from "@common/types/background.types";

function MatrixRain({ cellSize, strength, speedMul, seed }: TMatrixProps) {
  const texture = useAtlas();
  const myMesh = useRef<THREE.Mesh<THREE.PlaneGeometry, TShaderMaterial>>(null);
  const { viewport, size } = useThree();

  const materialParams = useMemo<TShaderParams>(() => {
    return {
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: [1, 1, 1],
        },
        iChannel0: { value: texture },
        uCellSize: { value: cellSize },
        uLayerStrength: { value: strength },
        uSpeedMul: { value: speedMul },
        uSeedOffset: { value: seed },
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
    };
  }, [cellSize, strength, speedMul, seed, texture]);

  useEffect(() => {
    materialParams.uniforms.iResolution.value = [size.width, size.height, 1];
  }, [materialParams, size.width, size.height]);

  useFrame(({ clock }) => {
    const mesh = myMesh.current;
    if (!mesh) return;
    mesh.material.uniforms.iTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={myMesh}
      position={[0, 0, 0]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial {...materialParams} />
    </mesh>
  );
}

export default MatrixRain;
