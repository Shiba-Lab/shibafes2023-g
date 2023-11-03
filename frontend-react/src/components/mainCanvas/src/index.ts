import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { animate } from "./animation/animate";
import { animateTree } from "./animation/animateTree";
import { grayScaleAnimate } from "./animation/grayScaleAnimate";
import { createFlower } from "./createFlower";
import { loadModel } from "./loadModel";
import { loadTree } from "./loadTree";
import { Flower } from "./types/FlowerType";

export const init = (renderer: THREE.WebGLRenderer) => {
  //白黒にするかどうかの変数
  const renderColor = true; //0ならグレースケール、1ならカラー

  //時間
  const clock = new THREE.Clock();
  const flowerDelta: number = 3000; //花が咲くまでの時間(木が生える時間)

  // サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;
  const magnification = 140; //全体の大きさを変更

  //GLTFのファイルパスを格納
  const fileindex: number = 0;
  const treeFilePath = "./treeGltf/treeMesh.gltf";
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./flowerGltf/flowerCosmos.gltf"; //1個目の花のモデル
  flowerModelsFilePath[1] = "./flowerGltf/cherryBlossom.gltf"; //現在使用不可
  flowerModelsFilePath[2] = "./flowerGltf/icho.gltf"; //銀杏
  flowerModelsFilePath[3] = "./flowerGltf/flower.gltf"; //最初の

  //通常のレンダリング用(カラー)
  const scene = new THREE.Scene(); // シーンを作成
  const camera = new THREE.OrthographicCamera(
    -width / magnification,
    width / magnification,
    height / magnification,
    -height / magnification,
    0.1,
    1000,
  ); // カメラを作成(並行投影)
  camera.position.set(0, 15, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  //フルスクリーン
  const fullscreenButton = document.getElementById("fullscreen-btn");
  const goFullScreen = () => {
    const canvas = renderer.domElement;

    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    }
  };
  if (fullscreenButton !== null) {
    fullscreenButton.addEventListener("click", function () {
      goFullScreen();
    });
  }

  //グレースケール用のレンダリング用のシェーダ、およびシェーダーパスの作成
  const grayscaleShader = {
    uniforms: {
      tDiffuse: { type: "t", value: null },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
            vec4 texColor = texture2D(tDiffuse, vUv);
            float grayValue = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
            gl_FragColor = vec4(vec3(grayValue), texColor.a);
        }
    `,
  };
  const composer = new EffectComposer(renderer); //コンポーザーの作成
  const renderPass = new RenderPass(scene, camera); //シーンとカメラを色付きでレンダリングする
  composer.addPass(renderPass); //レンダリングパスに追加
  const grayscalePass = new ShaderPass(grayscaleShader); //グレースケールシェーダーを追加
  composer.addPass(grayscalePass); //グレースケールシェーダーをパスに変換する
  grayscalePass.renderToScreen = true; // レンダリングの最後のパスとして設定する

  // 平行光源を作成
  const directionalLight = new THREE.DirectionalLight(0xffffff);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);
  // 環境光を追加
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  // GLTF形式のローダーの作成
  const loader = new GLTFLoader();
  const treeLoader = new GLTFLoader();
  //アニメーションミキサーの作成
  const mixers: THREE.AnimationMixer[] = [];
  const treeMixer: THREE.AnimationMixer[] = [];

  //フラワーの作成
  const flower: Flower[] = createFlower(
    10, //数
    -2.2, //原点x
    -1, //原点y
    2.5, //半径
    0.3, //大きさみん
    1, //大きさまっくす
    0.6, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower2: Flower[] = createFlower(
    10, //数
    2, //原点x
    -0.5, //原点y
    1.8, //半径
    0.3, //大きさみん
    1, //大きさまっくす
    0.5, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower3: Flower[] = createFlower(
    7, //数
    1.7, //原点x
    -3.5, //原点y
    1.2, //半径
    0.3, //大きさみん
    1, //大きさまっくす
    0.3, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower4: Flower[] = createFlower(
    6, //数
    -1.7, //原点x
    -4.5, //原点y
    1.3, //半径
    0.3, //大きさみん
    1, //大きさまっくす
    0.3, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  //モデルのロード
  loadModel(flowerModelsFilePath[fileindex], loader, scene, mixers, flower);
  loadModel(flowerModelsFilePath[fileindex], loader, scene, mixers, flower2);
  loadModel(flowerModelsFilePath[fileindex], loader, scene, mixers, flower3);
  loadModel(flowerModelsFilePath[fileindex], loader, scene, mixers, flower4);
  loadTree(treeFilePath, treeLoader, scene, treeMixer);

  //マスク(黒い板を配置しているだけ)
  /*
  const maskWidth = 200; //ピクセル
  const maskHeight = 300; //ピクセル
  const sceneWidth = camera.right - camera.left;
  const sceneHeight = camera.top - camera.bottom;
  const boxWidth = sceneWidth * (maskWidth / width);
  const boxHeight = sceneHeight * (maskHeight / height);

  const geometry = new THREE.BoxGeometry(boxWidth, 1, boxHeight);
  const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const mask = new THREE.Mesh(geometry, material);
  mask.position.set(0, 10, 0); //前面に配置
  mask.rotation.y = Math.PI / 4; //回転
  scene.add(mask);
  */

  //背景
  const sceneWidth = camera.right - camera.left;
  const sceneHeight = camera.top - camera.bottom;
  const boxWidth = sceneWidth * width;
  const boxHeight = sceneHeight * height;

  const geometry = new THREE.BoxGeometry(boxWidth, 1, boxHeight);
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mask = new THREE.Mesh(geometry, material);
  mask.position.set(0, -100, 0); //背面に配置
  scene.add(mask);

  //画面全体の大きさの変更(調整用)
  const scaleFactor = 3;
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.scale.multiplyScalar(scaleFactor);
    }
  });

  //アニメーション
  animateTree(0, treeMixer, scene, camera, renderer);
  if (renderColor) {
    animate(0, clock, flower, mixers, scene, camera, renderer);
    animate(0, clock, flower2, mixers, scene, camera, renderer);
    animate(0, clock, flower3, mixers, scene, camera, renderer);
    animate(0, clock, flower4, mixers, scene, camera, renderer);
  } else {
    grayScaleAnimate(0, flower, mixers, composer);
  }

  // リサイズイベント
  const onWindowResize = () => {
    // ウィンドウサイズに合わせてカメラとレンダラーを更新
    // オーソグラフィックカメラのスケールを更新
    const aspect = window.innerWidth / window.innerHeight;
    const frustumHeight = camera.top - camera.bottom;
    camera.left = (frustumHeight * aspect) / -2;
    camera.right = (frustumHeight * aspect) / 2;
    camera.top = frustumHeight / 2;
    camera.bottom = frustumHeight / -2;

    // プロジェクションマトリックスを更新
    camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // リサイズイベントリスナーの設定
  window.addEventListener("resize", onWindowResize, false);
};
