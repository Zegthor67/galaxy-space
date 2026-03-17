import params from './params.js';
import { generateGalaxy } from './galaxy.js';

// Délai en ms avant de régénérer après le dernier glissement
const DEBOUNCE_MS = 120;
let debounceTimer = null;

/**
 * Déclenche generateGalaxy() après un court délai d'inactivité.
 * Évite de recalculer 80k particules à chaque pixel de déplacement du slider.
 */
function scheduleRegen() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(generateGalaxy, DEBOUNCE_MS);
}

/**
 * Connecte un slider : met à jour params + affichage + planifie la régénération.
 */
function wire(sliderId, valId, key, fmt) {
  const slider = document.getElementById(sliderId);
  const label  = document.getElementById(valId);

  slider.addEventListener('input', () => {
    const value  = parseFloat(slider.value);
    params[key]  = value;
    label.textContent = fmt ? fmt(value) : value;
    scheduleRegen();
  });
}

/**
 * Initialise tous les contrôles du panneau.
 */
export function initUI() {
  wire('r-branches', 'v-branches', 'branches',   v => Math.round(v));
  wire('r-radius',   'v-radius',   'radius',     v => v.toFixed(1));
  wire('r-spin',     'v-spin',     'spin',       v => v.toFixed(1));
  wire('r-rand',     'v-rand',     'randomness', v => v.toFixed(2));
  wire('r-count',    'v-count',    'count',
        v => v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v);

  document.getElementById('c-inside').addEventListener('input', e => {
    params.insideColor = e.target.value;
    scheduleRegen();
  });

  document.getElementById('c-outside').addEventListener('input', e => {
    params.outsideColor = e.target.value;
    scheduleRegen();
  });
}
