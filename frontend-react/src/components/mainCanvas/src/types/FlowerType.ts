import * as THREE from "three";

export type Flower = {
  name?: string; //名前
  model?: THREE.Object3D; //モデル
  color1?: THREE.Color; //色1
  color2?: THREE.Color; //色2
  deltaSize: number; //大きさ全体の大きさの基準
  deltaTime: number; //アニメーションが始まるまでの時間
  coordinate: THREE.Vector3; //座標
  rotation: THREE.Euler; //角度
  scale: number; //大きさ
};
