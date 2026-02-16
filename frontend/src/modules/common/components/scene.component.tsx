import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import NativePostFX from "./background/nativePostFx";
import { Loader, OrthographicCamera } from "@react-three/drei";
import MatrixRain from "./background/rain";
import { matrixParams } from "@common/consts";

function SceneComponent() {
  return (
    <div className="fixed top-0 left-0 z-0 block h-full w-full">
      <Canvas
        gl={{ antialias: false, alpha: true }}
        dpr={1}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <NativePostFX />
        <OrthographicCamera makeDefault position={[0, 0, 1]} />
        {matrixParams.map((props, index) => (
          <MatrixRain key={index} {...props} />
        ))}
      </Canvas>
      <Loader />
    </div>
  );
}

export default SceneComponent;
