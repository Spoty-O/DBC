import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./background.style.scss";
import { getCamera, getRenderer, material } from "../../utils";

const BackgroundComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { clientWidth, clientHeight } = canvas;

    const scene = new THREE.Scene();

    const camera = getCamera();

    const renderer = getRenderer(canvas);
    renderer.setSize(clientWidth, clientHeight, false);
    material.uniforms.uResolution.value.set(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = false;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    scene.add(mesh);

    renderer.setClearColor(0x000000, 0);

    const animate = (time: number) => {
      const t = time / 1000;
      material.uniforms.uTime.value = t;
      renderer.render(scene, camera);
    };
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      material.uniforms.uResolution.value.set(clientWidth, clientHeight);
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="background" />;
};

export default BackgroundComponent;
