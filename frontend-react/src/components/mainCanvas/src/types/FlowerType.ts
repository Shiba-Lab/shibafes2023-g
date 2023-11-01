import * as THREE from "three";

export type Flower = {
  name?: string;
  model?: THREE.Object3D;
  coordinate: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
};
