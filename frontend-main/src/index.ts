import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { flowerCluster } from "./flowerCluster";

const init = () => {
  // サイズを指定
  const width = 960;
  const height = 540;

  // レンダラーを作成
  const canvasElement = document.querySelector("#myCanvas") as HTMLCanvasElement;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    //透過を許可
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0); //背景透過

  // シーンを作成
  const scene = new THREE.Scene();

  // カメラを作成(並行投影)
  const camera = new THREE.OrthographicCamera(-width / 100, width / 100, height / 100, -height / 100, 0.1, 1000);
  // カメラの初期座標を設定
  camera.position.set(0, 15, 0);
  //カメラの画角を設定(原点へ向くようにする)
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // 平行光源を作成
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // 環境光を追加
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  //モデルの座標、大きさ、回転の情報の生成(テスト用)
  const flowerClusterTransform = new flowerCluster(new THREE.Vector3(0, 0, 0), 1, 2, 1, 5);
  const flowerClusterCoordinate: THREE.Vector3[] = flowerClusterTransform.getCoordinates();
  const flowerClusterRotation: THREE.Euler[] = flowerClusterTransform.getEuler();
  const flowerClusterSize: number[] = flowerClusterTransform.getSize();

  //GLTFのファイルパスを格納
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./DamagedHelmet/glTF/flower.gltf"; //1個目の花のモデル

  // GLTF形式のモデルデータを読み込む
  const loader = new GLTFLoader();
  //アニメーションミキサーの作成
  let mixer: THREE.AnimationMixer;
  // GLTFファイルを読み込みシーンに追加する
  loader.load(flowerModelsFilePath[0], (gltf) => {
    // 読み込み後にモデルのデータを格納
    const model = gltf.scene;
    scene.add(model);

    //モデルの座標や大きさ、回転を変化(クラスの動作確認用、後で消す)
    model.position.copy(flowerClusterCoordinate[0]);
    model.rotation.copy(flowerClusterRotation[0]);
    model.scale.set(flowerClusterSize[0], flowerClusterSize[0], flowerClusterSize[0]);

    //ミキサーにクリップを追加
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  });

  const animate = () => {
    requestAnimationFrame(animate);
    // アニメーションミキサーを更新
    if (mixer) {
      // 進行速度を調整するための値を指定
      mixer.update(0.01);
    }
    //レンダリング
    renderer.render(scene, camera);
  };
  animate();
};

// ページの読み込みを待つ
window.addEventListener("DOMContentLoaded", init);
