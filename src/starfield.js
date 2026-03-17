import * as THREE from 'three';
import { scene } from './scene.js';
import { galaxyMaterial } from './material.js';
import { starTex } from './texture.js';

/**
 * Ajoute un fond d'étoiles statiques réparties en sphère autour de la scène.
 */
export function addStarField() {
  const COUNT = 6000;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(COUNT * 3);
  const col   = new Float32Array(COUNT * 3);
  const sizes = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    // Distribution uniforme sur une sphère (méthode trigonométrique)
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 30 + Math.random() * 60;

    pos[i * 3    ] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    // Légère teinte bleue aléatoire pour varier les étoiles
    const brightness = 0.55 + Math.random() * 0.45;
    col[i * 3    ] = brightness;
    col[i * 3 + 1] = brightness;
    col[i * 3 + 2] = brightness + Math.random() * 0.2;

    sizes[i] = Math.random() * 0.015 + 0.006;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(pos,   3));
  geo.setAttribute('aColor',   new THREE.BufferAttribute(col,   3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

  // Clone du material pour les étoiles (uniforms indépendants)
  const mat = galaxyMaterial.clone();
  mat.uniforms.uTexture    = { value: starTex };
  mat.uniforms.uPixelRatio = { value: Math.min(devicePixelRatio, 2) };

  scene.add(new THREE.Points(geo, mat));
}
