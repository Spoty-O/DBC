import * as THREE from "three";
import fragment from "../../../../assets/shaders/test.glsl";
import vertex from "../../../../assets/shaders/matrix.vertex.glsl";

const loader = new THREE.TextureLoader();

export function loadTexture(path: string) {
  console.log("start work");
  const texture = loader.load(path);
  texture.format = THREE.RGBAFormat;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function getMaterial(params: THREE.ShaderMaterialParameters) {
  return new THREE.ShaderMaterial({
    ...params,
    vertexShader: vertex,
    fragmentShader: fragment,
  });
}
