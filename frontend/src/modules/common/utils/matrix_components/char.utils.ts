import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { Font } from "three/addons/loaders/FontLoader.js";
import {
  cDarkGreen,
  cGreen,
  cNeon,
  matrixChars,
  meshMaterial,
} from "../../consts";

export class TextGeometryService {
  private font: Font;
  private geometries: TextGeometry[];

  constructor(font: Font) {
    this.font = font;
    this.geometries = this.generate();
  }

  private generate() {
    const charList = matrixChars.split("");
    const geometries = charList.map((char) => {
      return new TextGeometry(char, {
        font: this.font,
        size: 3,
        depth: 0.5,
        curveSegments: 4,
      });
    });
    return geometries;
  }

  public get() {
    return this.geometries[
      Math.floor(Math.random() * this.geometries.length)
    ].clone();
  }
}

export class CharMesh {
  public mesh: THREE.Mesh<TextGeometry, THREE.MeshStandardMaterial>;
  private textGeometryService: TextGeometryService;
  private duration: number;
  private startTime?: number;
  private curve: number;

  constructor(textGeometryService: TextGeometryService, duration: number) {
    this.textGeometryService = textGeometryService;
    this.duration = duration;
    this.curve = 1;
    const material = meshMaterial.clone();
    const geometry = this.textGeometryService.get();
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.rotateX(90);
  }

  private changeColor() {
    const bright = this.curve;
    const { material } = this.mesh;

    let color = cDarkGreen.clone().lerp(cGreen, bright);
    if (bright > 0.8) {
      const neonFactor = (bright - 0.8) / 0.1;
      color = color.lerp(cNeon, neonFactor);
    }
    material.color.copy(color);
    material.emissive.copy(color);
    material.emissiveIntensity = 0.3 + bright * 2.5;
  }

  private changeSymbol() {
    const { mesh } = this;

    if (Math.random() < 0.01) {
      mesh.geometry.dispose();
      mesh.geometry = this.textGeometryService.get();
    }
  }

  public clear() {
    this.mesh.geometry.dispose();
    const { material } = this.mesh;
    material.dispose();
  }

  public isHidden() {
    return this.curve <= 0;
  }

  public animate(time: number) {
    const t = time / 1000;
    if (!this.startTime) {
      this.startTime = t;
    }
    const elapsed = t - this.startTime;
    const progress = Math.min(Math.max(elapsed / this.duration, 0), 1);
    this.curve = 1 - progress;
    this.changeColor();
    this.changeSymbol();
  }
}
