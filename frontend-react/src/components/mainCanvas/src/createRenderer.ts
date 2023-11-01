import * as THREE from "three";

export const createRenderer = (width: number, height: number) => {
  const canvasElement = document.querySelector("#myCanvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); //背景透過

  return renderer;
};
