import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { FlowerData, init } from "./src";
import styles from "./src/style/fullbutton.module.css";

// number 型の waitUntil を含む type
type Props = {
  waitUntil: number;
  flowerData: FlowerData;
}

export const ThreeJSComponent: React.FC<Props> = (props: Props) => {
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
    init(renderer, props.waitUntil, props.flowerData);
  }, []);

  return (
    <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
      <div ref={ref} />
      <div className={styles.fullscreencontainer}>
        <button id="fullscreen-btn" className={styles.fullscreenBtn}>
          FullScreen
        </button>
      </div>
    </div>
  );
};
