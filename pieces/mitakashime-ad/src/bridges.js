// =====================================================================
//  CAMERAS AND BRIDGES — every boundary is a hard cut on the beat (BRIDGES = []); the system shot
//  is one continuous camera track along the line (springs between stations, landing on the beat).
// =====================================================================
const ERA_BG = ERA_LIST.map(() => '#07120D');
function pieceCam(era, t) {
  const sc = SHOT_LIST[era][1];
  if (sc === 'system') return camOf({ z: 1, p: [pieceCamX(t), 0], to: [MIDX, 0] });
  if (sc === 'night' && SHOT_LIST[era][0] === 1.5) { const z = springMove(1.5, 1.35, 1.0, SPRING.heavy); return camOf({ z, p: [MIDX, MIDY - 300 * UNIT], to: [MIDX, MIDY - 300 * UNIT] }); }
  if (sc === 'cold') { const z = 1 + 0.05 * EZ.io(seg(TT, 0, 1.5)); return camOf({ z, p: [MIDX, MIDY], to: [MIDX, MIDY] }); }
  if (sc.startsWith('rush')) { const k = 0.07 * Math.exp(-(TT - SHOT_LIST[era][0]) * 9); return camOf({ z: 1 + k, p: [MIDX, ROW.line - 58 * UNIT], to: [MIDX, ROW.line - 58 * UNIT] }); }
  if (sc === 'payoff') { const z = springMove(CUE.payoff, 0.9, 1.0, SPRING.heavy); return camOf({ z, p: [MIDX, MIDY], to: [MIDX, MIDY] }); }
  if (sc === 'hold') { const z = 0.9 + 0.004 * (TT - CUE.hold); return camOf({ z, p: [MIDX, MIDY], to: [MIDX, MIDY] }); }
  if (sc === 'reply') { const z = 1.05 - 0.05 * EZ.o2(seg(TT, CUE.reply, CUE.end)); return camOf({ z, p: [MIDX, MIDY], to: [MIDX, MIDY] }); }
  return null;
}
const BRIDGES = [];
