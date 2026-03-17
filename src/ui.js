import params from './params.js';
import { generateGalaxy } from './galaxy.js';

// Pendant l'interaction : on réduit les particules pour un rendu instantané.
// À l'arrêt : on restaure le vrai count et on régénère en qualité complète.
const PREVIEW_COUNT = 12000;
const END_DELAY_MS  = 350;

let endTimer   = null;
let savedCount = null;  // count sauvegardé pendant le preview

function beginPreview() {
  if (savedCount !== null) return;          // déjà en mode preview
  savedCount = params.count;
  if (params.count > PREVIEW_COUNT) params.count = PREVIEW_COUNT;
}

function endPreview() {
  if (savedCount === null) return;
  params.count = savedCount;
  savedCount   = null;
  generateGalaxy();
}

function scheduleEnd() {
  clearTimeout(endTimer);
  endTimer = setTimeout(endPreview, END_DELAY_MS);
}

/**
 * Applique la valeur, lance un rendu preview immédiat, planifie la qualité finale.
 * Pour le slider "count" on ne réduit pas (l'utilisateur règle lui-même la quantité).
 */
function applyAndPreview(slider, label, key, fmt, isCountKey) {
  const value  = parseFloat(slider.value);
  params[key]  = value;
  label.textContent = fmt ? fmt(value) : value;

  if (!isCountKey) beginPreview();
  generateGalaxy();
  scheduleEnd();
}

/**
 * Connecte un slider avec :
 *  - glissement classique
 *  - molette (+ Shift = ×5 plus rapide)
 *  - drag horizontal sur le label (style Blender)
 */
function wire(sliderId, valId, key, fmt) {
  const slider     = document.getElementById(sliderId);
  const label      = document.getElementById(valId);
  const ctrl       = slider.closest('.ctrl') ?? slider;
  const dragTarget = ctrl.querySelector('.ctrl-hd span:first-child');
  const isCountKey = key === 'count';

  const apply = () => applyAndPreview(slider, label, key, fmt, isCountKey);

  const clamp = v =>
    Math.min(parseFloat(slider.max), Math.max(parseFloat(slider.min), v));

  // ── Slider natif ────────────────────────────────────────────
  slider.addEventListener('input', apply);

  // ── Molette (Shift = ×5) ────────────────────────────────────
  ctrl.addEventListener('wheel', e => {
    e.preventDefault();
    const step      = parseFloat(slider.step) || 1;
    const multiplier = e.shiftKey ? 5 : 1;
    slider.value    = clamp(parseFloat(slider.value) - Math.sign(e.deltaY) * step * multiplier);
    apply();
  }, { passive: false });

  // ── Drag horizontal sur le label (style Blender) ─────────────
  if (dragTarget) {
    dragTarget.style.cursor = 'ew-resize';
    dragTarget.title        = 'Glisser pour modifier · Scroll molette · Shift = ×5';

    let dragStartX   = 0;
    let dragStartVal = 0;

    const onMove = e => {
      const dx        = e.clientX - dragStartX;
      const range     = parseFloat(slider.max) - parseFloat(slider.min);
      const step      = parseFloat(slider.step) || 1;
      const perPixel  = range / 180;          // 180 px = plage complète
      const raw       = dragStartVal + dx * perPixel;
      slider.value    = clamp(Math.round(raw / step) * step);
      apply();
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup',   onUp);
      document.body.style.cursor = '';
    };

    dragTarget.addEventListener('mousedown', e => {
      dragStartX   = e.clientX;
      dragStartVal = parseFloat(slider.value);
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup',   onUp);
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    });
  }
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
    beginPreview();
    generateGalaxy();
    scheduleEnd();
  });

  document.getElementById('c-outside').addEventListener('input', e => {
    params.outsideColor = e.target.value;
    beginPreview();
    generateGalaxy();
    scheduleEnd();
  });
}
