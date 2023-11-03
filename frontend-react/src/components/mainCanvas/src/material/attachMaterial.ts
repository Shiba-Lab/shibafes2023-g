import * as THREE from "three";

export const attachMaterial = (
  model: THREE.Object3D,
  material: THREE.Material,
) => {
  // モデル内のすべてのメッシュを走査して、新しいマテリアルを適用
  model.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.geometry instanceof THREE.BufferGeometry &&
      child.geometry.morphAttributes.position //モーフの情報があるかを確認
    ) {
      child.material = material.clone();
    } else {
      //console.error("モーフの情報が存在しません");
    }
  });
};
