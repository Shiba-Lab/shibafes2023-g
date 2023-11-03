import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export const loadTree = (
  filePath: string,
  loader: GLTFLoader,
  scene: THREE.Scene,
  mixers: THREE.AnimationMixer[],
) => {
  let mixer: THREE.AnimationMixer;

  loader.load(filePath, (gltf) => {
    const model = gltf.scene;
    model.position.set(0, -20, 5);
    model.scale.set(0.7, 0.7, 0.7);
    model.rotation.set(-Math.PI / 2, Math.PI / 2, 0);
    scene.add(model);

    const material = new THREE.MeshLambertMaterial({
      color: 0x8b4513, // 茶色のカラーコード
      flatShading: true,
    });

    model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    // アニメーションが含まれている場合、それを再生する
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();

      action.clampWhenFinished = true; // アニメーションが終了したらその場で止める
      action.loop = THREE.LoopOnce; // アニメーションを一度だけ再生する

      // アニメーションが終了したら呼ばれるイベント
      action.getClip().duration; // アニメーションの長さを取得
      mixer.addEventListener("finished", (e) => {
        if (e.action === action) {
          setTimeout(() => {
            // 一定時間経過後に再生を再開する
            action.reset(); // アニメーションの状態をリセット
            action.play(); // アニメーションを再生
          }, 1000000); // 100秒後にまた再生(実質終わるまで表示させ続ける)
        }
      });

      mixers.push(mixer);
    }
  });
};
