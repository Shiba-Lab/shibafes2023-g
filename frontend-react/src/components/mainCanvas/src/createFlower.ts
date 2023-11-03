import * as THREE from "three";
import { Flower } from "./types/FlowerType";
import { rand } from "./util";

export const createFlower = (
  flowerNum: number,
  originx: number,
  originy: number,
  radius: number,
  maxSize: number,
  minSize: number,
  deltaSize: number,
  deltaTime: number,
  color1: THREE.Color,
  color2: THREE.Color,
) => {
  const flowers: Flower[] = new Array(flowerNum);

  for (let i = 0; i < flowerNum; i++) {
    const r = rand(0, radius);
    const rad = rand(0, 2 * Math.PI);

    const x = r * Math.cos(rad) + originx;
    const y = rand(-10, 0);
    const z = r * Math.sin(rad) + originy;

    deltaTime += rand(0, 3000);

    const flower: Flower = {
      coordinate: new THREE.Vector3(x, y, z),
      rotation: new THREE.Euler(
        rand(0, Math.PI / 6),
        rand(0, 2 * Math.PI),
        rand(0, -Math.PI / 6),
      ),
      scale: rand(minSize, maxSize),
      deltaSize: deltaSize,
      deltaTime: deltaTime,
      color1: color1,
      color2: color2,
    };

    flowers.push(flower);
  }

  return flowers;
};
