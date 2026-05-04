import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useAtlas } from "../../utils/three_background/matrix.utils";
import fragment from "@assets/shaders/matrix.fragment.glsl";
import vertex from "@assets/shaders/matrix.vertex.glsl";
import type {
  TMatrixProps,
  TShaderMaterial,
  TShaderParams,
} from "../../types/background.types";

function MatrixRain({
  cellSize,
  strength,
  speedMul,
  seed,
  z = 0,
}: TMatrixProps) {
  const texture = useAtlas();
  const myMesh = useRef<THREE.Mesh<THREE.PlaneGeometry, TShaderMaterial>>(null);
  const { size, viewport, gl } = useThree();

  const materialParams = useRef<TShaderParams>({
    uniforms: {
      iTime: { value: 0 },
      iResolution: {
        value: [size.width, size.height, 1],
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
  });

  useEffect(() => {
    const dpr = gl.getPixelRatio();
    materialParams.current.uniforms.iResolution.value = [
      size.width * dpr,
      size.height * dpr,
      1,
    ];
  }, [size.width, size.height, gl]);

  useFrame(({ clock }) => {
    const mesh = myMesh.current;
    if (!mesh) return;
    const mat = mesh.material as TShaderMaterial;
    mat.uniforms.iTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={myMesh}
      position={[0, 0, z]}
      scale={[viewport.width, viewport.height, 1]}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial {...materialParams.current} />
    </mesh>
  );
}

export default MatrixRain;
