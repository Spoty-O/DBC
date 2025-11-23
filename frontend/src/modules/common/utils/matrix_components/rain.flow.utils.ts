import * as THREE from "three";
import { Font } from "three/addons/loaders/FontLoader.js";

export class RainFlow {
  flow: THREE.Object3D;
  font: Font;
  intervalId: number;

  constructor(speed: number, font: Font) {
    this.flow = new THREE.Group();
    this.font = font;
    this.intervalId = setInterval(this.addChar, speed);
  }

  private addChar() {
    
  }

  public clear() {
    this.flow.children.forEach((char) => {
      char.clear()
    })
  }

  public animate() {}
}
