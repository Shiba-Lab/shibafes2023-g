import { Flower } from "./types/FlowerType";

export const flowerTransform = (flower: Flower) => {
  if (flower.model) {
    flower.model.position.copy(flower.coordinate);
    flower.model.rotation.copy(flower.rotation);
    flower.model.scale.set(
      flower.scale - flower.deltaSize,
      flower.scale - flower.deltaSize,
      flower.scale - flower.deltaSize,
    );
  } else {
    console.log("モデルのデータが格納されていないため変形できませんでした");
  }
};
