import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { AfterimagePass } from "three/addons/postprocessing/AfterimagePass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";

/** Post stack: render → afterimage → bloom → film (restored from prior implementation). */
function NativePostFX() {
  const { gl, scene, camera, size } = useThree();

  const composer = useMemo(() => new EffectComposer(gl), [gl]);

  const bloom = useMemo(
    () => new UnrealBloomPass(new THREE.Vector2(1, 1), 1, 0.75, 0),
    [],
  );
  const after = useMemo(() => new AfterimagePass(0.9), []);
  const film = useMemo(() => new FilmPass(0.1, false), []);

  useEffect(() => {
    gl.autoClear = false;
  }, [gl]);

  useEffect(() => {
    composer.setSize(size.width, size.height);

    composer.addPass(new RenderPass(scene, camera));

    composer.addPass(after);
    composer.addPass(bloom);
    composer.addPass(film);

    return () => {
      composer.passes.length = 0;
      composer.dispose();
    };
  }, [composer, scene, camera, size.width, size.height, bloom, after, film]);

  useEffect(() => {
    bloom.setSize(size.width, size.height);
  }, [size.width, size.height, bloom]);

  useFrame(() => {
    gl.clear(true, true, true);
    composer.render();
  }, 1);

  return null;
}

export default NativePostFX;
