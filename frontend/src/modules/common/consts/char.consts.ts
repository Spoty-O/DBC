import * as THREE from "three";
export const cDarkGreen = new THREE.Color(0x002a16);
export const cGreen = new THREE.Color(0x00ff41);
export const cNeon = new THREE.Color(0x6affc9);

export const meshMaterial = new THREE.MeshStandardMaterial({
  color: cDarkGreen.clone(),
  emissive: cDarkGreen.clone(),
  emissiveIntensity: 0,
  roughness: 0.6,
  metalness: 0.1,
});
