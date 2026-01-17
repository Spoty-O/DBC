import * as THREE from "three";
import { useTexture } from "@react-three/drei";
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
