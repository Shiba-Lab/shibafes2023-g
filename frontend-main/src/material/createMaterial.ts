import * as THREE from "three";

//法線により色を変化させるシェーダー
export const createMaterial = () => {
  const vertexShader = `
  #include <morphtarget_pars_vertex>
  varying vec3 vNormal;

  void main() {
    #include <begin_vertex>
    #include <morphtarget_vertex>
    #include <project_vertex>
    vNormal = normalize(normalMatrix * normal);
  }
`;

  const fragmentShader = `
  varying vec3 vNormal;

  void main() {
    vec3 color = vec3(0.5 * vNormal.x + 0.5, 0.5 * vNormal.y + 0.5, 0.5 * vNormal.z + 0.5);
    gl_FragColor = vec4(color, 1.0);
  }
`;

  const material = new THREE.ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  return material;
};
