import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { Flower } from "../types/FlowerType";

export const grayScaleAnimate = (
  time: number,
  flower: Flower[],
  mixers: THREE.AnimationMixer[],
  composer: EffectComposer
) => {
  requestAnimationFrame((t) => grayScaleAnimate(t, flower, mixers, composer));

  // アニメーションミキサーを更新
  if (mixers) {
    // 進行速度を調整するための値を指定
    mixers.forEach((mixer) => {
      mixer.update(0.01); // フレームごとの更新
    });
  }

  composer.render();
};
