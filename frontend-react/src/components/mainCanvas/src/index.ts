import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { animate } from "./animation/animate";
import { animateTree } from "./animation/animateTree";
import { grayScaleAnimate } from "./animation/grayScaleAnimate";
import { createFlower } from "./createFlower";
import { createText } from "./createText";
import { loadModel } from "./loadModel";
import { loadTree } from "./loadTree";
import { Flower } from "./types/FlowerType";

const initialize = (renderer: THREE.WebGLRenderer) => {
  /*入力される変数管理*/
  //白黒にするかどうかの変数
  const renderColor = true; //0ならグレースケール、1ならカラー
  //スマホ画面かそれ以外か
  const wrapperScreen = true;
  //花のインプット関係
  const inputFlowerNum = 10;
  const inputFlowerMin = 0.3;
  const inputFlowerMax = 1;
  //テキスト
  const text: string = "Adobe";
  const fontnum = 1; //フォントを何使うか

  //スマホ画面用の設定
  const sumaho = new THREE.BoxGeometry(0.45, 2, 1); //スマホの画面の大きさと位置(プロジェクター用)
  const sumaho2 = new THREE.Vector3(0, 0, 4); //位置
  const screenRatio = 0.2; //拡大

  //カメラの回転量
  const cameraRotation = 0;

  //
  //
  //
  //時間
  const clock = new THREE.Clock();
  const flowerDelta: number = 3000; //花が咲くまでの時間(木が生える時間)

  // 画面サイズを指定
  const width = window.innerWidth;
  const height = window.innerHeight;
  const magnification = 120; //全体の大きさを変更

  //GLTFのファイルパスを格納
  const fileindex: number = 0;
  const treeFilePath = "./treeGltf/treeMesh.gltf";
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./flowerGltf/flowerCosmos.gltf"; //1個目の花のモデル
  flowerModelsFilePath[1] = "./flowerGltf/cherryBlossom.gltf"; //現在使用不可
  flowerModelsFilePath[2] = "./flowerGltf/icho.gltf"; //銀杏
  flowerModelsFilePath[3] = "./flowerGltf/flower.gltf"; //最初の

  //フォントパス
  const fontPath: string[] = [];
  fontPath[0] = "./fonts/helv.json";
  fontPath[1] = "./fonts/gentilis_regular.typeface.json";

  //レンダリング用
  const scene = new THREE.Scene(); // シーンを作成
  let camera: THREE.OrthographicCamera;
  if (wrapperScreen) {
    camera = new THREE.OrthographicCamera(
      -width / magnification,
      width / magnification,
      height / magnification,
      -height / magnification,
      0.1,
      1000,
    );

    camera.position.set(0, 15, 0);
    camera.rotation.x = -Math.PI / 2;

    //スマホおく位置の表示
    const geometry = sumaho;
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const mask = new THREE.Mesh(geometry, material);
    mask.position.set(0, 10, 5); //前面に配置
    scene.add(mask);

    //マスク
    /*
    const maskWidth = pixelWidth; //ピクセル
    const maskHeight = pixelHeight; //ピクセル
    const boxWidth = maskWidth / (magnification * 2);
    const boxHeight = maskHeight / (magnification * 2);
    //ジオメトリ
    const geometry = new THREE.BoxGeometry(boxWidth, 1, boxHeight);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const mask = new THREE.Mesh(geometry, material);
    mask.position.set(0, 10, 0); //前面に配置
    mask.rotation.y = cameraRotation; //回転
    scene.add(mask);
    */
  } else {
    // OrthographicCameraを作成
    camera = new THREE.OrthographicCamera(
      -width / magnification, // left
      width / magnification, // right
      height / magnification, // top
      -height / magnification, // bottom
      0.1, // near
      1000, // far
    );

    renderer.setSize(width, height); //レンダラーのサイズ変更

    camera.position.set(0, 15, 0);
    camera.rotation.x = -Math.PI / 2;
    camera.rotation.z = cameraRotation; //画面の回転

    camera.left *= screenRatio;
    camera.right *= screenRatio;
    camera.top *= screenRatio;
    camera.bottom *= screenRatio;

    camera.position.copy(sumaho2);

    console.log();

    // 必ずカメラのプロジェクションマトリクスを更新する
    camera.updateProjectionMatrix();
  }

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
    inputFlowerNum, //数
    -2.2, //原点x
    -1, //原点y
    2.5, //半径
    inputFlowerMin, //大きさみん
    inputFlowerMax, //大きさまっくす
    0.6, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower2: Flower[] = createFlower(
    inputFlowerNum, //数
    2, //原点x
    -0.5, //原点y
    1.8, //半径
    inputFlowerMin, //大きさみん
    inputFlowerMax, //大きさまっくす
    0.5, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower3: Flower[] = createFlower(
    inputFlowerNum - 3, //数
    1.7, //原点x
    -3.5, //原点y
    1.2, //半径
    inputFlowerMin, //大きさみん
    inputFlowerMax, //大きさまっくす
    0.3, //大きさ
    flowerDelta + 4000,
    new THREE.Color("rgb(255, 200, 100)"),
    new THREE.Color("rgb(100, 200, 255)"),
  );

  const flower4: Flower[] = createFlower(
    inputFlowerNum - 4, //数
    -1.7, //原点x
    -4.5, //原点y
    1.3, //半径
    inputFlowerMin, //大きさみん
    inputFlowerMax, //大きさまっくす
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

  const texts = createText(scene, flower, text, fontPath[fontnum]);
  const texts2 = createText(scene, flower2, text, fontPath[fontnum]);
  const texts3 = createText(scene, flower3, text, fontPath[fontnum]);
  const texts4 = createText(scene, flower4, text, fontPath[fontnum]);

  //背景
  const backWidth = (camera.right - camera.left) * width;
  const backHeight = (camera.top - camera.bottom) * height;
  const geometryBack = new THREE.BoxGeometry(backWidth, 1, backHeight);
  const materialBack = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const backg = new THREE.Mesh(geometryBack, materialBack);
  backg.position.set(0, -100, 0); //背面に配置
  scene.add(backg);

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
    animate(0, clock, flower, mixers, scene, camera, renderer, texts);
    animate(0, clock, flower2, mixers, scene, camera, renderer, texts2);
    animate(0, clock, flower3, mixers, scene, camera, renderer, texts3);
    animate(0, clock, flower4, mixers, scene, camera, renderer, texts4);
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

export const init = (renderer: THREE.WebGLRenderer) => {
  setTimeout(() => {
    initialize(renderer);
  }, 2000);
};
