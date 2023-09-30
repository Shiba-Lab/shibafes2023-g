/*
花の束をクラスターとした時、そのクラスター内部における花の座標や回転、大きさについて配列として値を返すクラスです。
現在はほぼランダムな値のみを返しますが、QRコードによって得られた情報により色々と変化させるように改造する予定です。
*/

import * as THREE from "three";

export class flowerCluster {
  constructor(
    private flowerOrigin: THREE.Vector3,
    private flowerNumber: number,
    private flowerClusterMaxRadius: number,
    private flowerSizeOfMin: number,
    private flowerSizeOfMax: number
  ) {}

  //花の座標を取得する(ランダム)
  getCoordinates(): THREE.Vector3[] {
    const coordinates: THREE.Vector3[] = [];
    for (let i = 0; i < this.flowerNumber; i++) {
      let x = 0;
      let y = 0;
      let z = 0;

      const radius = Math.random() * this.flowerClusterMaxRadius;
      const radial = Math.random() * (2 * Math.PI);

      x = radius * Math.cos(radial);
      y = Math.random() * 20 - 10; //y軸方向のずれのランダム性の設定
      z = radius * Math.sin(radial);

      const flowerVectorFromOrigin = new THREE.Vector3(x, y, z); //方向ベクトルを配列化
      const flowerVector: THREE.Vector3 = this.flowerOrigin.clone().add(flowerVectorFromOrigin); //クラスターの初期座標と合体させグローバル座標にする
      coordinates.push(flowerVector);
    }
    return coordinates;
  }

  //花のサイズを取得する(ランダム)
  getSize(): number[] {
    const size: number[] = [];

    for (let i = 0; i < this.flowerNumber; i++) {
      const randomSize = Math.random() * (this.flowerSizeOfMax - this.flowerSizeOfMin) + this.flowerSizeOfMin;
      size.push(randomSize);
    }

    return size;
  }

  //花の回転を取得する(今はy軸回転だけ)
  //オイラー角
  getEuler(): THREE.Euler[] {
    const euler: THREE.Euler[] = [];
    for (let i = 0; i < this.flowerNumber; i++) {
      const x: number = 0;
      const y: number = Math.random() * 2 * Math.PI;
      const z: number = 0;

      euler.push(new THREE.Euler(x, y, z));
    }
    return euler;
  }
}
