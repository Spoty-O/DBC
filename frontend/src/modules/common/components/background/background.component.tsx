import { useEffect, useRef } from "react";
import * as THREE from "three";
import { getCamera, getMaterial, getRenderer, loadTexture } from "../../utils";
import { useMousePosition } from "../../hooks";

function BackgroundComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // "/matrix_glyph_atlas.png"
    // "/glyph_atlas.png"
    const texture = loadTexture("/glyph_atlas.png");

    const { clientWidth, clientHeight } = canvas;

    const scene = new THREE.Scene();

    const camera = getCamera();

    const renderer = getRenderer(canvas);
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = false;
    const material = getMaterial({
      uniforms: {
        iTime: { value: 0.0 },
        iResolution: {
          value: new THREE.Vector3(clientWidth, clientHeight, 1),
        },
        iMouse: {
          value: new THREE.Vector2(
            mousePosition.current.x,
            mousePosition.current.y,
          ),
        },
        iChannel0: { value: texture },
      },
    });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);

    scene.add(mesh);

    renderer.setClearColor(0x000000, 0);

    const animate = (time: number) => {
      const t = time / 1000;
      material.uniforms.iTime.value = t;
      material.uniforms.iMouse.value.set(
        mousePosition.current.x,
        mousePosition.current.y,
      );
      renderer.render(scene, camera);
    };
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      material.uniforms.iResolution.value.set(clientWidth, clientHeight, 1);
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [mousePosition]);

  return (
    <canvas
      ref={canvasRef}
      id="background"
      className="fixed top-0 left-0 -z-1 block h-full w-full"
    />
  );
};

export default BackgroundComponent;
