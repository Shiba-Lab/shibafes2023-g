import * as THREE from "three";
import { Flower } from "../types/FlowerType";

export const animate = (
  time: number,
  clock: THREE.Clock,
  flowers: Flower[],
  mixers: THREE.AnimationMixer[],
  scene: THREE.Scene,
  camera: THREE.OrthographicCamera,
  renderer: THREE.WebGLRenderer,
  texts: THREE.Mesh[],
) => {
  requestAnimationFrame((t) =>
    animate(t, clock, flowers, mixers, scene, camera, renderer, texts),
  );

  /*大きくなったり小さくなったりさせる
  const elapsedTime = clock.getElapsedTime();
  const scaleFactor = Math.sin(elapsedTime) * 0.5 + 1.5; // 1.0 から 2.0 の間でスケール
  */

  const textScale: number[] = new Array(flowers.length);
  let i = 0;

  flowers.forEach((flower) => {
    //花が咲くまでの時間で大きくする。
    let scaleFactor: number;

    const elapsedTime = clock.getElapsedTime();
    if (
      elapsedTime >= flower.deltaTime / 1000 &&
      elapsedTime <= flower.deltaTime / 1000 + 4
    ) {
      scaleFactor = (elapsedTime - flower.deltaTime / 1000) / 4;
      scaleFactor *= flower.scale * flower.deltaSize;
    } else if (elapsedTime >= 0 && elapsedTime < flower.deltaTime / 1000) {
      scaleFactor = 0;
    } else {
      scaleFactor = flower.scale * flower.deltaSize;
    }

    if (flower.model) {
      flower.model.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    if (
      elapsedTime <= flower.deltaTime / 1000 + 8 &&
      elapsedTime >= flower.deltaTime / 1000 + 4
    ) {
      textScale[i] = (elapsedTime - (flower.deltaTime / 1000 + 4)) / 4;
      textScale[i] *= flower.scale * flower.deltaSize;
    } else if (elapsedTime >= 0 && elapsedTime < flower.deltaTime / 1000 + 4) {
      textScale[i] = 0;
    } else {
      textScale[i] = flower.scale * flower.deltaSize;
    }

    textScale[i] *= 1.5;

    i += 1;
  });

  console.log(textScale);

  i = 0;

  texts.forEach((text) => {
    text.scale.set(textScale[i], textScale[i], textScale[i]);
    i += 1;
  });

  // アニメーションミキサーを更新
  if (mixers) {
    // 進行速度を調整するための値を指定
    mixers.forEach((mixer) => {
      mixer.update(0.01); // フレームごとの更新
    });
  }

  // レンダリング
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
};
