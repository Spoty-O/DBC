import { Suspense } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import MatrixRain from "./rain.component";
import NativePostFX from "./nativePostFx.component";
import { matrixParams } from "../../consts/background.consts";

/** WebGL matrix rain + three.js postprocessing (restored). Skips WebGL in Vitest. */
function BackgroundComponent() {
  if (import.meta.env.MODE === "test") {
    return (
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-black"
        aria-hidden
      />
    );
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 block h-full w-full">
      <Canvas
        gl={{ antialias: false, alpha: true }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.0;
        }}
      >
        <NativePostFX />
        <OrthographicCamera makeDefault args={[-1, 1, 1, -1, 0, 1]} />
        <Suspense fallback={null}>
          {matrixParams.map((props, index) => (
            <MatrixRain key={index} {...props} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}

export default BackgroundComponent;
