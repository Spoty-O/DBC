import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { FontLoader, Font } from "three/addons/loaders/FontLoader.js";
import "./background.style.scss";
import { CharMesh, getRenderer, TextGeometryService } from "../../utils";

const getLight = () => {
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.AmbientLight(color, intensity);
  return light;
};

const getCamera = (sceneWidth: number, sceneHeight: number) => {
  const fov = 40;
  const aspect = sceneWidth / sceneHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 1);
  return camera;
};

const BackgroundComponent = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [font, setFont] = useState<Font | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!font) {
      const loader = new FontLoader();
      loader.load("fonts/Matrix_Code_NFI_Regular.json", (data) => {
        setFont(data);
      });
      return;
    }

    const { clientWidth, clientHeight } = canvas;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = getCamera(clientWidth, clientHeight);

    const renderer = getRenderer(canvas);
    renderer.setSize(clientWidth, clientHeight, false);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.xr.enabled = false;

    const light = getLight();
    scene.add(light);

    const textGeometryService = new TextGeometryService(font);

    const objects: CharMesh[] = [];

    const char1 = new CharMesh(textGeometryService, 4);
    // const char2 = new CharMesh(font);

    scene.add(char1.mesh);
    // scene.add(char2);

    objects.push(char1);

    const animate = (time: number) => {
      objects.forEach((char) => {
        char.animate(time);
        // if (char.isHidden()) {
        //   char.clear()
        //   objects.shift()
        // }
      });
      renderer.render(scene, camera);
    };
    // renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);

    const handleResize = () => {
      const { clientWidth, clientHeight } = canvas;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      objects.forEach((char) => {
        char.clear();
      });
      renderer.dispose();
    };
  }, [font]);

  return <canvas ref={canvasRef} id="background" />;
};

export default BackgroundComponent;
