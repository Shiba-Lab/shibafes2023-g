import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Flower } from "./types/FlowerType";
import { flowerTransform } from "./flowerTransform";
import { randomizeAnimationStartFrame } from "./animation/randomizeAnimationStartFrame";
import { attachMaterial } from "./material/attachMaterial";
import { createMaterial } from "./material/createMaterial";

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

      // flowerにmodelを追加
      flower.model = model;
      // モデルのトランスフォーム
      flowerTransform(flower);

      // マテリアル
      const material: THREE.Material = createMaterial(
        new THREE.Color("rgb(255, 200, 100)"),
        new THREE.Color("rgb(100, 200, 255)")
      );
      attachMaterial(flower.model, material);

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

      // シーンにモデルを追加
      scene.add(model);
    });
  });
};
