import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { animate } from "./animation/animate";
import { grayScaleAnimate } from "./animation/grayScaleAnimate";
import { loadModel } from "./loadModel";
import { createRenderer } from "./createRenderer";
import { Flower } from "./types/FlowerType";

const init = () => {
  //白黒にするかどうかの変数
  const renderColor = true; //0ならグレースケール、1ならカラー

  // サイズを指定
  const width = 960;
  const height = 540;

  //GLTFのファイルパスを格納
  const flowerModelsFilePath: string[] = [];
  flowerModelsFilePath[0] = "./flowerGltf/flowerCosmos.gltf"; //1個目の花のモデル

  //通常のレンダリング用(カラー)
  const renderer = createRenderer(width, height); // レンダラーを作成
  const scene = new THREE.Scene(); // シーンを作成
  const camera = new THREE.OrthographicCamera(-width / 100, width / 100, height / 100, -height / 100, 0.1, 1000); // カメラを作成(並行投影)
  camera.position.set(0, 15, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

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
      coordinate: new THREE.Vector3(2, 0, 2),
      rotation: new THREE.Euler(0, Math.PI, 0),
      scale: 2,
    },
  ];

  //モデルのロード
  loadModel(flowerModelsFilePath[0], loader, scene, mixers, flower);

  //アニメーション
  if (renderColor) {
    animate(0, flower, mixers, scene, camera, renderer);
  } else {
    grayScaleAnimate(0, flower, mixers, composer);
  }
};

// ページの読み込みを待つ
window.addEventListener("DOMContentLoaded", init);
