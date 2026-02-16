import * as THREE from "three";
import { useProgress, useTexture } from "@react-three/drei";
import atlas from "@assets/matrix_atlas.png";
import { useEffect } from "react";

export function useAtlas() {
  const texture = useTexture(atlas);
  useEffect(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  }, [texture]);
  return texture;
}

export function useSceneProgress() {
  const { active, total, progress } = useProgress();
  console.log(total, progress)
  return !active && total > 0;
}
