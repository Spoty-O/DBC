import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import atlas from "@assets/matrix_atlas.png";

export function useAtlas() {
  const texture = useTexture(atlas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// export function getMaterial(params: THREE.ShaderMaterialParameters) {
//   return new THREE.ShaderMaterial({
//     ...params,
//     vertexShader: vertex,
//     fragmentShader: fragment,
//     transparent: true,
//     depthWrite: false,
//   });
// }
