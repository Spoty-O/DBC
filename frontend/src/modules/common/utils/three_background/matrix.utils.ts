import * as THREE from "three";
import fragment from "../../../../assets/shaders/fragment.glsl";
import vertex from "../../../../assets/shaders/vertex.glsl";

export const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: { value: 0 },
    uResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    uMouse: { value: new THREE.Vector2(0, 0) },
  },
});
