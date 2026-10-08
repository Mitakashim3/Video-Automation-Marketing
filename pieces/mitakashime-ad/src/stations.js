// =====================================================================
//  THE SYSTEM — one long line, five stations, the camera tracks along it (springs landing on the beat).
//  Each station card is the plan (dashed grey box) handing over to the built, automated thing (green).
// =====================================================================
const typed = (str, t0, cps = 55) => str.slice(0, Math.max(0, Math.floor((TT - t0) * cps)));
function field(x, y, label, value, o = {}) {
  mkLabel(label, x, y, { size: 19 });
  mkText(value, x, y + 40 * UNIT, o.size ?? 29, { weight: 500, c: o.c || MK.text });
}
function greenPill(str, x, y, t0, o = {}) {   // right-aligned at x
  if (TT < t0) return;
  const e = springEase(TT - t0, SPRING.snappy.k, SPRING.snappy.d), size = (o.size ?? 21) * UNIT;
  ctx.save(); ctx.font = `700 ${size}px ${SANS}`; const w = ctx.measureText(str).width + 46 * UNIT, h = size * 1.9;
  ctx.translate(x - w / 2, y); ctx.scale(lerp(0.6, 1, e), lerp(0.6, 1, e)); ctx.globalAlpha *= clamp((TT - t0) / 0.12);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.fillStyle = rgba(MK.green, 0.14); ctx.fill(); ctx.strokeStyle = rgba(MK.green, 0.7); ctx.lineWidth = 1.5 * UNIT; ctx.stroke();
  ctx.fillStyle = MK.green; ctx.beginPath(); ctx.arc(-w / 2 + 20 * UNIT, 0, 5 * UNIT, 0, TAU); ctx.fill();
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(str, 8 * UNIT, 1); ctx.restore();
}
function check(x, y, t0, r = 18) {   // a green check in a ring, popping in
  if (TT < t0) return; const e = springEase(TT - t0, SPRING.playful.k, SPRING.playful.d);
  ctx.save(); ctx.translate(x, y); ctx.scale(e, e); ctx.fillStyle = MK.green; ctx.beginPath(); ctx.arc(0, 0, r * UNIT, 0, TAU); ctx.fill();
  ctx.strokeStyle = MK.ink; ctx.lineWidth = 3.5 * UNIT; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-r * 0.42 * UNIT, 0); ctx.lineTo(-r * 0.1 * UNIT, r * 0.32 * UNIT); ctx.lineTo(r * 0.45 * UNIT, -r * 0.3 * UNIT); ctx.stroke(); ctx.restore();
}

function stationLead(k, t0) {
  const [x, y, w, h] = cardBox(k), pad = 40 * UNIT;
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.12 + 0.35 * clamp(ev(t0 + 0.3, 0.4)) });
  mkText('New lead', x + pad, y + 64 * UNIT, 34, { weight: 650 });
  greenPill('Captured · 9:47 PM', x + w - pad, y + 52 * UNIT, t0 + 0.25);
  const rows = [['Name', 'Jordan'], ['Channel', 'Facebook Messenger'], ['Message', MSG], ['Tag', 'After hours']];
  const gap = (h - 130 * UNIT) / rows.length;
  rows.forEach(([l, v], i) => {
    const ry = y + 120 * UNIT + i * gap;
    ctx.strokeStyle = rgba(MK.muted, 0.18); ctx.lineWidth = 1.2 * UNIT; ctx.beginPath(); ctx.moveTo(x + pad, ry - 18 * UNIT); ctx.lineTo(x + w - pad, ry - 18 * UNIT); ctx.stroke();
    field(x + pad, ry + 12 * UNIT, l, typed(v, t0 - 0.15 + i * 0.12, 70));
  });
}
function stationReply(k, t0) {
  const [x, y, w, h] = cardBox(k), pad = 40 * UNIT;
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.12 + 0.35 * clamp(ev(t0 + 0.2, 0.4)) });
  mkLabel('Messenger · 9:47 PM', x + pad, y + 56 * UNIT, { size: 20 });
  const bb = mkBubbleBox(MSG, 30), cy1 = y + 130 * UNIT;
  mkBubble(x + pad + bb.w / 2, cy1, MSG, { size: 30, noAnchor: true, flat: true });
  const ts = t0 + 0.15;
  if (TT >= ts) {
    const rb = mkBubbleBox(REPLY, 30), e = springEase(TT - ts, SPRING.snappy.k, SPRING.snappy.d);
    mkBubble(x + w - pad - rb.w / 2, y + 240 * UNIT + (1 - e) * 30 * UNIT, REPLY, { size: 30, reply: true, s: lerp(0.7, 1, e), noAnchor: true, flat: true });
  }
  // the response time
  const secs = clamp((TT - (t0 - 0.35)) / 0.5) * 2;
  mkLabel('Response time', x + pad, y + h - 50 * UNIT, { size: 20 });
  mkText(`0:0${Math.floor(secs)}`, x + w - pad, y + h - 38 * UNIT, 84, { serif: true, italic: true, c: MK.green, align: 'right' });
}
function stationCRM(k, t0) {
  const [x, y, w, h] = cardBox(k), pad = 34 * UNIT, cols = ['New', 'Booked', 'Done'], cw = (w - pad * 2 - 40 * UNIT) / 3;
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.12 + 0.35 * clamp(ev(t0 + 0.3, 0.4)) });
  const ts = t0 + 0.12, e = TT >= ts ? springEase(TT - ts, SPRING.smooth.k, SPRING.smooth.d) : 0;
  const counts = [lerp(3, 2, e > 0.5 ? 1 : 0), lerp(4, 5, e > 0.5 ? 1 : 0), 9];
  const ch = 64 * UNIT, colX = (i) => x + pad + i * (cw + 20 * UNIT), top = y + 110 * UNIT;
  cols.forEach((c, i) => {
    mkLabel(c, colX(i), y + 62 * UNIT, { size: 20, c: MK.text });
    mkLabel(String(Math.round(counts[i])), colX(i) + cw, y + 62 * UNIT, { size: 20, align: 'right' });
    const n = [2, 3, 3][i];
    for (let j = 0; j < n; j++) {
      const cy = top + (i === 1 ? ch + 14 * UNIT : 0) + j * (ch + 14 * UNIT);
      if (cy + ch > y + h - 20 * UNIT) continue;
      ctx.beginPath(); ctx.roundRect(colX(i), cy, cw, ch, 12 * UNIT); ctx.fillStyle = rgba(MK.text, 0.05); ctx.fill(); ctx.strokeStyle = rgba(MK.muted, 0.25); ctx.lineWidth = 1.2 * UNIT; ctx.stroke();
      ctx.fillStyle = rgba(MK.muted, 0.45); ctx.fillRect(colX(i) + 16 * UNIT, cy + 20 * UNIT, cw * 0.55, 8 * UNIT); ctx.fillStyle = rgba(MK.muted, 0.25); ctx.fillRect(colX(i) + 16 * UNIT, cy + 38 * UNIT, cw * 0.35, 7 * UNIT);
    }
  });
  // Jordan's card slides from New into Booked
  const cx = lerp(colX(0), colX(1), e), cy = lerp(top + 2 * (ch + 14 * UNIT), top, e);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 24 * UNIT; ctx.shadowOffsetY = 10 * UNIT;
  ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 12 * UNIT); ctx.fillStyle = MK.ground3; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = e > 0.5 ? MK.green : rgba(MK.muted, 0.5); ctx.lineWidth = 2 * UNIT; ctx.stroke(); ctx.restore();
  mkText('Jordan', cx + 16 * UNIT, cy + 30 * UNIT, 22, { weight: 650 });
  mkText(e > 0.5 ? 'Thu 10:00' : 'New lead', cx + 16 * UNIT, cy + 54 * UNIT, 18, { weight: 500, c: e > 0.5 ? MK.green : MK.muted });
}
function stationKeep(k, t0) {
  const [x, y, w, h] = cardBox(k), pad = 40 * UNIT;
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.12 + 0.35 * clamp(ev(t0 + 0.3, 0.4)) });
  const rows = [
    ['Reminder sent', 'See you tomorrow at 10:00', t0 + 0.12, 'bell'],
    ['Review request sent', 'How was your visit?', t0 + 0.28, 'star'],
  ];
  const rh = (h - 3 * 26 * UNIT) / 2;
  rows.forEach(([a, b, ts, ic], i) => {
    const ry = y + 26 * UNIT + i * (rh + 26 * UNIT);
    ctx.beginPath(); ctx.roundRect(x + 26 * UNIT, ry, w - 52 * UNIT, rh, 18 * UNIT); ctx.fillStyle = rgba(MK.text, 0.04); ctx.fill(); ctx.strokeStyle = rgba(MK.muted, 0.22); ctx.lineWidth = 1.2 * UNIT; ctx.stroke();
    const ix = x + 26 * UNIT + 58 * UNIT, iy = ry + rh / 2;
    ctx.strokeStyle = MK.text; ctx.lineWidth = 3 * UNIT; ctx.lineJoin = 'round';
    if (ic === 'bell') { ctx.beginPath(); ctx.moveTo(ix - 18 * UNIT, iy + 12 * UNIT); ctx.quadraticCurveTo(ix - 16 * UNIT, iy - 24 * UNIT, ix, iy - 24 * UNIT); ctx.quadraticCurveTo(ix + 16 * UNIT, iy - 24 * UNIT, ix + 18 * UNIT, iy + 12 * UNIT); ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(ix, iy + 18 * UNIT, 5 * UNIT, 0, TAU); ctx.stroke(); }
    else { ctx.beginPath(); starPts(ix, iy, 24 * UNIT, 5).forEach(([p, q], j) => (j ? ctx.lineTo(p, q) : ctx.moveTo(p, q))); ctx.closePath(); ctx.stroke(); }
    mkText(a, ix + 50 * UNIT, iy - 6 * UNIT, 30, { weight: 650 });
    mkText(b, ix + 50 * UNIT, iy + 32 * UNIT, 24, { weight: 500, c: MK.muted });
    check(x + w - 26 * UNIT - 54 * UNIT, iy, ts, 22);
  });
}
const STATION_DRAW = { book: stationBook };
Object.assign(STATION_DRAW, { lead: stationLead, reply: stationReply, crm: stationCRM, keep: stationKeep });

SCENE.system = () => {
  mkStage({ c: MK.green, a: 0.22, cy: -H * 0.55, rx: W * 1.1, sq: 0.5, wash: 0.25 });
  mkWash(H * 1.1, H * 0.7, MK.green, 0.16);
  mkGuides(0.32, P916 ? 60 : 50);
  const k = stationAt(), t0 = CUE.stations[k], camX = pieceCamX(TT);
  // the line: still the dashed plan ahead, built green behind the hero
  mkPath([[stX(-1), ROW.line], [stX(5), ROW.line]], { plan: true, alpha: 0.6 });
  const grow = EZ.o3(seg(TT, CUE.built, CUE.built + 0.4));
  mkPath([[stX(-1), ROW.line], [lerp(stX(-1), camX, grow), ROW.line]], {});
  for (let i = 0; i < 5; i++) {
    const on = TT >= CUE.stations[i] - 0.25, r = 14 * UNIT * (i === 0 ? clamp(springEase(TT - 10.25, SPRING.playful.k, SPRING.playful.d)) : 1);
    if (r > 0.5) mkNode(stX(i), ROW.line, r, { green: on ? 1 : 0 });
  }
  for (let i = Math.max(0, k - 1); i <= Math.min(4, k + 1); i++) {
    const a = i === 0 ? clamp(ev(10.15, 0.3)) : 1; if (a <= 0) continue;
    ctx.save(); ctx.globalAlpha = a;
    STATION_DRAW[STATIONS[i].key](i, CUE.stations[i]);
    const [x, y, w, h] = cardBox(i);
    mkSelect(x - 18 * UNIT, y - 18 * UNIT, w + 36 * UNIT, h + 36 * UNIT, { frac: 1, alpha: 0.75 * (1 - 0.6 * clamp(ev(CUE.stations[i] + 0.45, 0.4))), label: STATIONS[i].label });
    ctx.restore();
  }
  // the hero: the customer's bubble shrinks into the first node, then rides the line as a small bubble
  if (TT < 10.4) mkBubble(camX, ROW.line - 70 * UNIT * (1 - seg(TT, 10.0, 10.4)), MSG, { size: 40, s: 1 - EZ.i3(seg(TT, 10.0, 10.4)) * 0.95 });
  else mkBubble(camX, ROW.line - 58 * UNIT, '• • •', { size: 26, s: springEase(TT - 10.4, SPRING.playful.k, SPRING.playful.d) });
  if (TT >= t0 - 0.3) mkHeadline(STATIONS[k].head, MIDX, ROW.head, { t0: t0 - 0.2, size: 76, green: true });
};
const pieceCamX = (t) => springTrack([[0, stX(0)], ...CUE.stations.slice(1).map((c, i) => [c - 0.35, stX(i + 1)])], SPRING.smooth);
