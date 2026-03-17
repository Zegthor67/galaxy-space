import * as THREE from 'three';
import { starTex } from './texture.js';

/**
 * ShaderMaterial pour les particules.
 * Avantage sur PointsMaterial : supporte une taille par vertex (attribut aSize).
 */
export const galaxyMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTexture:    { value: starTex },
    uPixelRatio: { value: Math.min(devicePixelRatio, 2) },
  },

  vertexShader: /* glsl */`
    attribute float aSize;
    attribute vec3  aColor;
    varying   vec3  vColor;
    uniform   float uPixelRatio;

    void main() {
      vColor = aColor;
      vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

      // Atténuation perspective identique à PointsMaterial sizeAttenuation:true
      gl_PointSize = aSize * uPixelRatio * (250.0 / -mvPos.z);
      gl_Position  = projectionMatrix * mvPos;
    }
  `,

  fragmentShader: /* glsl */`
    uniform sampler2D uTexture;
    varying vec3 vColor;

    void main() {
      vec4 tex = texture2D(uTexture, gl_PointCoord);
      if (tex.a < 0.004) discard;
      gl_FragColor = vec4(vColor * tex.rgb, tex.a * 0.92);
    }
  `,

  transparent: true,
  depthWrite:  false,
  blending:    THREE.AdditiveBlending,
});
