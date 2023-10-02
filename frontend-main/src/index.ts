import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { randomizeAnimationStartFrame } from "./gltfAnimation";
//import { generateNumber } from "./util";
import { flowerCluster } from "./flowerCluster";

const init = () => {
  //花の個数などを設定
  const flowerNumber = 5;

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
  const flowerClusterTransform = new flowerCluster(new THREE.Vector3(0, 0, 0), flowerNumber, 10, 1, 5);
  const flowerClusterCoordinate: THREE.Vector3[] = flowerClusterTransform.getCoordinates();
  const flowerClusterRotation: THREE.Euler[] = flowerClusterTransform.getEuler();
  const flowerClusterScale: number[] = flowerClusterTransform.getScale();

  //GLTFのファイルパスを格納
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./DamagedHelmet/glTF/flower.gltf"; //1個目の花のモデル

  // GLTF形式のモデルデータを読み込む
  const loader = new GLTFLoader();
  //アニメーションミキサーの作成
  const mixers: THREE.AnimationMixer[] = [];

  // GLTFファイルを読み込み処理を行う
  loader.load(flowerModelsFilePath[0], (gltf) => {
    for (let i = 0; i < flowerNumber; i++) {
      // 読み込み後にモデルのデータを格納
      const model = gltf.scene.clone();
      scene.add(model);

      //モデルの座標や大きさ、回転を変化
      model.position.copy(flowerClusterCoordinate[i]);
      model.rotation.copy(flowerClusterRotation[i]);
      model.scale.set(flowerClusterScale[i], flowerClusterScale[i], flowerClusterScale[i]);

      // 各アニメーションの開始フレームをずらす値
      //const animationStartFrameOffset = generateNumber.getRandomInt(0, 60) / 60;

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

      /*
      gltf.animations.forEach((clip) => {

        // アニメーションクリップの開始フレームをずらす
        clip.tracks.forEach((track) => {
          if (track.times) {
            for (let j = 0; j < track.times.length; j++) {
              track.times[j] += animationStartFrameOffset;
            }
          }
        });

        // アニメーションアクションを作成
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(clip);

        // アクションを再生
        action.play();

        // ミキサーを保存
        mixers.push(mixer);
      });
      */
    }
  });

  const animate = () => {
    requestAnimationFrame(animate);
    // アニメーションミキサーを更新
    if (mixers) {
      // 進行速度を調整するための値を指定
      mixers.forEach((mixer) => {
        mixer.update(0.01); // フレームごとの更新
      });
    }
    //レンダリング
    renderer.render(scene, camera);
  };
  animate();
};

// ページの読み込みを待つ
window.addEventListener("DOMContentLoaded", init);
