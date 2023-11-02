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
    model.position.set(0, -20, 1);
    model.scale.set(0.5, 0.5, 0.5);
    model.rotation.set(-Math.PI / 2, Math.PI / 2, 0);
    scene.add(model);

    // アニメーションが含まれている場合、それを再生する
    if (gltf.animations && gltf.animations.length) {
      mixer = new THREE.AnimationMixer(model);
      const action = mixer.clipAction(gltf.animations[0]);
      action.play();
      mixers.push(mixer);
    }
  });
};
