import * as THREE from "three";

//法線により色を変化させるシェーダー

export const createMaterial = (color1: THREE.Color, color2: THREE.Color) => {
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
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec3 vNormal;

        void main() {
            vec3 gradient = mix(uColor1, uColor2, (vNormal.y * 0.5 + 0.5));
            gl_FragColor = vec4(gradient, 1.0);
        }
    `;

  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uColor1: { value: color1 },
      uColor2: { value: color2 },
    },
  });
};
