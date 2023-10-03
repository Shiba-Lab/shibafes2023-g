import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { createRenderer } from "./createRenderer";
import { Flower } from "./types/FlowerType";
import { animate } from "./animation/animate";
import { loadModel } from "./loadModel";

const init = () => {
  // サイズを指定
  const width = 960;
  const height = 540;

  //GLTFのファイルパスを格納
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./DamagedHelmet/glTF/flower.gltf"; //1個目の花のモデル

  // レンダラーを作成
  const renderer = createRenderer(width, height);

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成(並行投影)
  const camera = new THREE.OrthographicCamera(-width / 100, width / 100, height / 100, -height / 100, 0.1, 1000);
  camera.position.set(0, 15, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 平行光源を作成
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // 環境光を追加
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // GLTF形式のローダーの作成
  const loader = new GLTFLoader();
  //アニメーションミキサーの作成
  const mixers: THREE.AnimationMixer[] = [];

  //flower(テスト用)
  const flower: Flower[] = [
    {
      coordinate: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(0, 0, 0),
      scale: 1,
    },
    {
      coordinate: new THREE.Vector3(1, 0, 1),
      rotation: new THREE.Euler(0, Math.PI, 0),
      scale: 2,
    },
  ];

  //モデルのロード
  loadModel(flowerModelsFilePath[0], loader, scene, mixers, flower);

  animate(0, mixers, scene, camera, renderer);
};

// ページの読み込みを待つ
window.addEventListener("DOMContentLoaded", init);
