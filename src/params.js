/**
 * Paramètres partagés de la galaxie.
 * Modifiés en direct par l'UI, lus par generateGalaxy().
 */
const params = {
  count:        80000,   // nombre de particules
  branches:     3,       // nombre de bras spiraux
  radius:       5.0,     // rayon total de la galaxie
  spin:         1.0,     // torsion des bras (négatif = sens inverse)
  randomness:   0.30,    // dispersion des particules autour des bras
  randomPower:  3.0,     // concentration de la dispersion (plus haut = plus serré)
  insideColor:  '#ff6030',  // couleur au centre
  outsideColor: '#1b3aaa',  // couleur au bord
};

export default params;
