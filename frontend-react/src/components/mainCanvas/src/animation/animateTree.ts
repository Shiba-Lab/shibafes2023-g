import * as THREE from "three";

export const animateTree = (
  time: number,
  mixers: THREE.AnimationMixer[],
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
) => {
  requestAnimationFrame((t) => animateTree(t, mixers, scene, camera, renderer));

  mixers.forEach((mixer) => {
    mixer.update(0.01); // フレームごとの更新
  });

  renderer.render(scene, camera);
};
