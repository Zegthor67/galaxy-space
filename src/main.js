import * as THREE from 'three';
import { scene, camera, renderer, orbitControls } from './scene.js';
import { galaxyMaterial } from './material.js';
import { generateGalaxy, getGalaxyMesh } from './galaxy.js';
import { addStarField } from './starfield.js';
import { initUI } from './ui.js';

// ── Initialisation
generateGalaxy();
addStarField();
initUI();

// ── Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  galaxyMaterial.uniforms.uPixelRatio.value = Math.min(devicePixelRatio, 2);
});

// ── Boucle de rendu
const clock = new THREE.Clock();

(function animate() {
  requestAnimationFrame(animate);

  const t    = clock.getElapsedTime();
  const mesh = getGalaxyMesh();

  if (mesh) {
    mesh.rotation.y = t * 0.04;                    // rotation lente
    mesh.rotation.x = Math.sin(t * 0.08) * 0.04;  // légère oscillation
  }

  orbitControls.update();
  renderer.render(scene, camera);
})();
