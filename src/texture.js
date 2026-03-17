import * as THREE from 'three';

/**
 * Génère une texture sparkle 4 rayons sur canvas (imitation du PNG fourni).
 * Composition : halo radial + 2 pics en croix (longs) + 2 pics diagonaux (courts).
 */
function makeSparkleTexture() {
  const SIZE  = 128;
  const cv    = document.createElement('canvas');
  cv.width    = cv.height = SIZE;
  const ctx   = cv.getContext('2d');
  const center = SIZE / 2;

  // ── Halo radial central
  const glow = ctx.createRadialGradient(center, center, 0, center, center, center);
  glow.addColorStop(0.00, 'rgba(255,255,255,1)');
  glow.addColorStop(0.05, 'rgba(255,255,255,1)');
  glow.addColorStop(0.18, 'rgba(255,255,255,0.7)');
  glow.addColorStop(0.40, 'rgba(255,255,255,0.18)');
  glow.addColorStop(0.70, 'rgba(255,255,255,0.04)');
  glow.addColorStop(1.00, 'rgba(255,255,255,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // ── Rayon en forme de losange (angle, longueur, demi-largeur)
  const drawSpike = (angle, length, halfWidth) => {
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(angle);

    const grad = ctx.createLinearGradient(0, -length, 0, length);
    grad.addColorStop(0,    'rgba(255,255,255,0)');
    grad.addColorStop(0.48, 'rgba(255,255,255,0.88)');
    grad.addColorStop(0.5,  'rgba(255,255,255,1)');
    grad.addColorStop(0.52, 'rgba(255,255,255,0.88)');
    grad.addColorStop(1,    'rgba(255,255,255,0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0,          -length);
    ctx.lineTo( halfWidth,  0);
    ctx.lineTo(0,           length);
    ctx.lineTo(-halfWidth,  0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  // Croix principale (rayons longs)
  drawSpike(0,             center * 0.98, 2.2);
  drawSpike(Math.PI / 2,  center * 0.98, 2.2);
  // Diagonales (rayons courts)
  drawSpike(Math.PI / 4,  center * 0.58, 1.3);
  drawSpike(-Math.PI / 4, center * 0.58, 1.3);

  // ── Halo secondaire (anneau lumineux subtil)
  ctx.globalCompositeOperation = 'lighter';
  const ring = ctx.createRadialGradient(center, center, center * 0.06, center, center, center * 0.28);
  ring.addColorStop(0, 'rgba(255,255,255,0.28)');
  ring.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = ring;
  ctx.fillRect(0, 0, SIZE, SIZE);

  return new THREE.CanvasTexture(cv);
}

export const starTex = makeSparkleTexture();
