import * as THREE from 'three';
import { scene } from './scene.js';
import { galaxyMaterial } from './material.js';
import params from './params.js';

let mesh = null;
let geo  = null;

/**
 * (Re)génère la galaxie en spirale avec les paramètres courants.
 * Libère la géométrie précédente avant de recréer.
 */
export function generateGalaxy() {
  // Nettoyage de l'ancienne géométrie
  if (mesh) {
    geo.dispose();
    scene.remove(mesh);
  }

  geo = new THREE.BufferGeometry();

  const positions = new Float32Array(params.count * 3);
  const colors    = new Float32Array(params.count * 3);
  const sizes     = new Float32Array(params.count);

  const colorIn   = new THREE.Color(params.insideColor);
  const colorOut  = new THREE.Color(params.outsideColor);
  const colorCore = new THREE.Color('#ffffff');

  // Dispersion aléatoire concentrée (power → plus le chiffre est haut, plus c'est serré)
  const rand = (spread) =>
    Math.pow(Math.random(), params.randomPower) * spread * (Math.random() < 0.5 ? 1 : -1);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;

    // Rayon biaisé vers le centre (densité réaliste)
    const r         = Math.pow(Math.random(), 0.65) * params.radius;
    const branchAng = (i % params.branches) / params.branches * Math.PI * 2;

    // Spirale logarithmique : les bras s'enroulent fort au cœur et s'évasent vers l'extérieur,
    // exactement comme une vraie galaxie spirale (voie lactée, M31, etc.)
    const spiralAng = params.spin * Math.log(1 + r) * 2.5;

    const totalAng = branchAng + spiralAng;

    // Dispersion perpendiculaire : faible près du cœur, plus large en périphérie
    // La composante verticale est très réduite pour garder un disque plat
    const spread = params.randomness * r;
    positions[i3    ] = Math.cos(totalAng) * r + rand(spread);
    positions[i3 + 1] = rand(spread * 0.18);
    positions[i3 + 2] = Math.sin(totalAng) * r + rand(spread);

    // Couleur : dégradé centre → bord, cœur flashé en blanc
    const t     = r / params.radius;
    const color = colorIn.clone().lerp(colorOut, t);
    if (r < params.radius * 0.08) {
      color.lerp(colorCore, (1 - t / 0.08) * 0.6);
    }
    colors[i3    ] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    // Taille : étoiles plus grandes au cœur
    sizes[i] = r < params.radius * 0.12
      ? Math.random() * 0.08 + 0.10   // cœur brillant
      : Math.random() * 0.04 + 0.02;  // particules ordinaires
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aColor',   new THREE.BufferAttribute(colors,    3));
  geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));

  mesh = new THREE.Points(geo, galaxyMaterial);
  scene.add(mesh);

  return mesh;   // exposé pour la boucle d'animation
}

/**
 * Retourne le mesh courant (null si pas encore généré).
 */
export function getGalaxyMesh() {
  return mesh;
}
