import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { init } from "./src";
import styles from "./src/style/fullbutton.module.css";

export const ThreeJSComponent = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const canvas = ref.current as HTMLDivElement;
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      stencil: true,
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); //背景透過
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);
    init(renderer);
  }, []);

  return (
    <div>
      <div ref={ref} />
      <div className={styles.fullscreencontainer}>
        <button id="fullscreen-btn" className={styles.fullscreenBtn}>
          FullScreen
        </button>
      </div>
    </div>
  );
};
