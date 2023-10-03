export const animate = (
  time: number,
  mixers: THREE.AnimationMixer[],
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer
) => {
  requestAnimationFrame((t) => animate(t, mixers, scene, camera, renderer));

  // アニメーションミキサーを更新
  if (mixers) {
    // 進行速度を調整するための値を指定
    mixers.forEach((mixer) => {
      mixer.update(0.01); // フレームごとの更新
    });
  }

  // レンダリング
  renderer.render(scene, camera);
};
