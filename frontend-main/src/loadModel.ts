import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Flower } from "./types/FlowerType";
import { flowerTransform } from "./flowerTransform";
import { randomizeAnimationStartFrame } from "./animation/randomizeAnimationStartFrame";

export const loadModel = (
  filePath: string,
  loader: GLTFLoader,
  scene: THREE.Scene,
  mixers: THREE.AnimationMixer[],
  flowers: Flower[]
) => {
  loader.load(filePath, (gltf) => {
    flowers.forEach((flower) => {
      // 読み込み後にモデルのデータを格納
      const model = gltf.scene.clone();
      scene.add(model);

      //flowerにmodelを追加
      flower.model = model;

      // モデルのトランスフォーム
      flowerTransform(flower);

      // アニメーションクリップを取得
      const originalClip = gltf.animations[0]; // 適切なアニメーションクリップを選択

      // クローンしたシーンごとにアニメーションを設定
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const mixer = new THREE.AnimationMixer(child);
          const modifiedClip = randomizeAnimationStartFrame(originalClip);
          const action = mixer.clipAction(modifiedClip);
          action.play();
          // ミキサーを保存
          mixers.push(mixer);
        }
      });
    });
  });
};
