import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { Flower } from "./types/FlowerType";
import { rand } from "./util";

export const createText = (
  scene: THREE.Scene,
  flowers: Flower[],
  text: string,
) => {
  const textMeshs: THREE.Mesh[] = new Array(flowers.length);
  const textLoader = new FontLoader();
  textLoader.load("./fonts/helv.json", (font) => {
    flowers.forEach((flower) => {
      const textGeo: TextGeometry = new TextGeometry(text, {
        size: 0.5,
        height: 1,
        curveSegments: 3,
        font: font, // FontLoaderからロードされたフォントを使用
      });

      // バウンディングボックスを計算します。
      textGeo.computeBoundingBox();

      if (textGeo.boundingBox !== null) {
        const boundingBox = textGeo.boundingBox;
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        textGeo.translate(-center.x, -center.y, -center.z);
      } else {
        console.error("The boundingBox is null.");
      }

      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const textMesh = new THREE.Mesh(textGeo, textMaterial);

      if (flower) {
        textMesh.position.copy(flower.coordinate);
        textMesh.position.y += 0.5;
        textMesh.scale.set(flower.scale, flower.scale, flower.scale);

        textMesh.rotation.x = -Math.PI / 2;
        textMesh.rotation.z = rand(0, 2 * Math.PI);
      } else {
        console.log("モデルのデータが格納されていないため変形できませんでした");
      }

      scene.add(textMesh);

      textMeshs.push(textMesh);
    });
  });
  return textMeshs;
};
