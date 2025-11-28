import * as THREE from "three";

export const getCamera = () => {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return camera;
};
