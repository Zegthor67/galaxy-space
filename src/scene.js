import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ── Scène
export const scene = new THREE.Scene();

// ── Caméra
export const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.01, 500);
camera.position.set(0, 5, 9);

// ── Renderer
export const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// ── Contrôles orbite (clic + glisser, molette)
export const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.06;
orbitControls.minDistance   = 0.5;
orbitControls.maxDistance   = 60;
orbitControls.target.set(0, 0, 0);
