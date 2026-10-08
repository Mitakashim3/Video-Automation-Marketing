// =====================================================================
//  THE PLAN, THE RUSH, THE HOLD, THE PAYOFF, THE ANSWER, THE END CARD
// =====================================================================

// ---- 5. the plan: the night world again, now mapped in dashed grey
SCENE.plan = () => {
  nightWorld();
  if (TT < CUE.plan + 0.35) { ctx.save(); ctx.globalAlpha = 1 - seg(TT, CUE.plan, CUE.plan + 0.35); pile(3); ctx.restore(); }
  mkGuides(0.3 * clamp(ev(CUE.plan, 0.4)), P916 ? 60 : 50);
  mkBubble(MIDX, NL.hero, MSG, { size: 40, dim: 0.55, meta: '9:47 PM' });
  // the customer's path: from the message down to the closed door
  const door = [NL.shopX, NL.street - 115 * UNIT * 1.0];
  const P = [[MIDX, NL.hero + 70 * UNIT], [MIDX, NL.threads - 50 * UNIT], [door[0] + 80 * UNIT, NL.threads - 50 * UNIT], [door[0], door[1]]];
  mkPath(P, { plan: true, frac: EZ.o2(ev(CUE.plan + 0.15, 0.6)) });
  // the gap: a dashed selection on the knot, labelled
  const bw = 400 * UNIT, bh = 190 * UNIT;
  mkSelect(NL.shopX - bw / 2, NL.threads - bh / 2, bw, bh, { frac: EZ.o2(ev(CUE.learn - 0.1, 0.5)), label: 'after hours · no reply' });
  // a cursor glides in to the selection
  const cs = springEase(TT - (CUE.plan + 0.3), SPRING.smooth.k, SPRING.smooth.d);
  mkCursor(lerp(W * 0.9, NL.shopX + bw / 2 - 10 * UNIT, cs), lerp(H * 0.95, NL.threads + bh / 2 - 10 * UNIT, cs), 1.3);
  // the turn into the build: the path starts going green from the message
  mkPath(P, { frac: EZ.io(ev(9.5, 0.5)) });
  mkHeadline([['First, we', 'n'], ['learn', 'i'], ['your business.', 'n']], MIDX, P916 ? 420 : 170, { t0: CUE.learn, size: P916 ? 64 : 62, maxW: P916 ? 820 : 1000 });
};

// ---- 7. the rush: one more skill per beat, the hero holding its screen spot
const RUSH = [
  { head: [['Missed-call', 'n'], ['text-back', 'i']], draw: rushMissed },
  { head: [['AI chat', 'n'], ['assistant', 'i']], draw: rushChat },
  { head: [['SMS & email', 'n'], ['campaigns', 'i']], draw: rushCampaign },
  { head: [['Reporting', 'n'], ['dashboard', 'i']], draw: rushReport },
];
function rushBox() { const w = (P916 ? 820 : 760) * UNIT, h = (P916 ? 460 : 380) * UNIT; return [MIDX - w / 2, ROW.line + 110 * UNIT, w, h]; }
function rushMissed(x, y, w, h) {
  const pad = 40 * UNIT;
  mkLabel('Missed call · 10:14 PM', x + pad, y + 70 * UNIT, { size: 24, c: MK.text });
  ctx.strokeStyle = MK.muted; ctx.lineWidth = 3 * UNIT; ctx.beginPath(); ctx.moveTo(x + w - pad - 60 * UNIT, y + 50 * UNIT); ctx.lineTo(x + w - pad - 20 * UNIT, y + 90 * UNIT); ctx.moveTo(x + w - pad - 20 * UNIT, y + 50 * UNIT); ctx.lineTo(x + w - pad - 60 * UNIT, y + 90 * UNIT); ctx.stroke();
  const t = 'Sorry we missed you! Want to book?', b = mkBubbleBox(t, 30);
  mkBubble(x + w - pad - b.w / 2, y + h * 0.62, t, { size: 30, reply: true, noAnchor: true, flat: true, meta: 'Sent automatically' });
}
function rushChat(x, y, w, h) {
  const pad = 40 * UNIT, q = 'Do you take walk-ins?', a = 'Yes! Want me to save you a spot?';
  const qb = mkBubbleBox(q, 30), ab = mkBubbleBox(a, 30);
  mkBubble(x + pad + qb.w / 2, y + 80 * UNIT, q, { size: 30, noAnchor: true, flat: true });
  mkBubble(x + w - pad - ab.w / 2, y + 200 * UNIT, a, { size: 30, reply: true, noAnchor: true, flat: true, meta: 'AI assistant · 24/7' });
}
function rushCampaign(x, y, w, h) {
  const pad = 40 * UNIT, rows = [['SMS', 'We miss you! 1 tap to rebook'], ['Email', 'Your monthly check-in']];
  rows.forEach(([a, b], i) => {
    const ry = y + 70 * UNIT + i * 130 * UNIT;
    mkLabel(a, x + pad, ry, { size: 22, c: MK.text });
    mkText(b, x + pad, ry + 42 * UNIT, 28, { weight: 500, c: MK.muted });
    ctx.fillStyle = rgba(MK.muted, 0.2); ctx.beginPath(); ctx.roundRect(x + pad, ry + 66 * UNIT, w - pad * 2 - 80 * UNIT, 10 * UNIT, 5 * UNIT); ctx.fill();
    ctx.fillStyle = MK.green; ctx.beginPath(); ctx.roundRect(x + pad, ry + 66 * UNIT, (w - pad * 2 - 80 * UNIT) * (i ? 0.7 : 1), 10 * UNIT, 5 * UNIT); ctx.fill();
    check(x + w - pad - 20 * UNIT, ry + 60 * UNIT, -1, 18);
  });
}
function rushReport(x, y, w, h) {
  const pad = 40 * UNIT;
  mkLabel('Bookings this week', x + pad, y + 64 * UNIT, { size: 22, c: MK.text });
  const vals = [0.35, 0.5, 0.45, 0.7, 0.8, 0.95], bw = (w - pad * 2) / vals.length, base = y + h - 60 * UNIT, mh = h - 160 * UNIT;
  vals.forEach((v, i) => { ctx.fillStyle = i === vals.length - 1 ? MK.green : rgba(MK.green, 0.35 + i * 0.08); ctx.beginPath(); ctx.roundRect(x + pad + i * bw + 10 * UNIT, base - mh * v, bw - 20 * UNIT, mh * v, 8 * UNIT); ctx.fill(); });
  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((d, i) => mkLabel(d, x + pad + (i + 0.5) * bw, base + 34 * UNIT, { size: 18, align: 'center' }));
}
function rushShot(i) {
  mkStage({ c: MK.green, a: 0.26, cy: -H * 0.55, rx: W * 1.1, sq: 0.5, wash: 0.3 });
  mkWash(H * 1.1, H * 0.7, MK.green, 0.18);
  mkGuides(0.28, P916 ? 60 : 50);
  mkPath([[-20, ROW.line], [W + 20, ROW.line]], {});
  mkNode(MIDX, ROW.line, 14 * UNIT);
  const [x, y, w, h] = rushBox();
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.4 });
  RUSH[i].draw(x, y, w, h);
  mkBubble(MIDX, ROW.line - 58 * UNIT, '• • •', { size: 26 });
  mkLabel(`Also automated · ${i + 1} / 4`, MIDX, ROW.head - (P916 ? 110 : 96) * UNIT, { align: 'center', size: 22 });
  mkHeadline(RUSH[i].head, MIDX, ROW.head, { t0: E0 - 1, size: 76, green: true });   // a 0.5s shot is complete on its first frame
}
RUSH.forEach((_, i) => { SCENE['rush' + (i + 1)] = () => rushShot(i); });

// ---- 8/9. the whole system, wide: held dark and silent, then everything lights on the hit
const MAP = P916
  ? { line: 960, shopX: 190, street: 1040, n0: 400, n1: 900, cal: [60, 1130, 420, 330], pills: [500, 1130, 440] , head: 390 }
  : { line: 560, shopX: 160, street: 640, n0: 360, n1: 960, cal: [70, 700, 450, 270], pills: [560, 700, 450], head: 160 };
function systemMap(lit) {
  const on = lit > 0;
  mkStage({ c: on ? MK.green : MK.muted, a: on ? 0.36 : 0.12, cy: H * 1.1, rx: W * 0.95, sq: 0.45, wash: on ? 0.9 : 0.3 });
  mkGuides(0.22, P916 ? 60 : 50);
  mkShop(MAP.shopX, MAP.street, 220 * UNIT, 170 * UNIT, { lit });
  const nx = (i) => lerp(MAP.n0, MAP.n1, i / 4) * UNIT;
  const L = [[MAP.shopX + 110 * UNIT, MAP.line], [MAP.n1 * UNIT + 40 * UNIT, MAP.line]];
  if (on) mkPath(L, {}); else mkPath(L, { plan: true, alpha: 0.5 });
  // pulses travelling the built line
  if (on) for (let p = 0; p < 4; p++) { const u = mod((TT - CUE.payoff) * 0.55 + p / 4, 1); const px = lerp(L[0][0], L[1][0], u); ctx.fillStyle = MK.green; ctx.beginPath(); ctx.arc(px, MAP.line, 7 * UNIT, 0, TAU); ctx.fill(); }
  ['Lead', 'Reply', 'Book', 'CRM', 'Retain'].forEach((s, i) => { mkNode(nx(i), MAP.line, 13 * UNIT, { green: on ? 1 : 0 }); mkLabel(s, nx(i), MAP.line + 50 * UNIT, { align: 'center', size: 19, c: on ? MK.text : MK.muted }); });
  // the calendar: empty and dim while held, filling green on the hit
  const [cx, cy, cw, ch] = MAP.cal.map((v) => v * UNIT);
  mkCard(cx, cy, cw, ch, { glow: on ? MK.green : null, glowA: 0.35 });
  mkLabel('This week', cx + 28 * UNIT, cy + 44 * UNIT, { size: 19, c: on ? MK.text : MK.muted });
  const gx = cx + 28 * UNIT, gy = cy + 66 * UNIT, gw = (cw - 56 * UNIT) / 6, gh = (ch - 90 * UNIT) / 4;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) {
    const ts = CUE.payoff + (i + j) * 0.05, f = on ? clamp(springEase(TT - ts, SPRING.snappy.k, SPRING.snappy.d)) : 0;
    ctx.beginPath(); ctx.roundRect(gx + i * gw + 4 * UNIT, gy + j * gh + 4 * UNIT, gw - 8 * UNIT, gh - 8 * UNIT, 6 * UNIT);
    ctx.fillStyle = f > 0 ? rgba(MK.green, 0.15 + 0.75 * f * ((i * 7 + j * 3) % 5 ? 1 : 0.55)) : rgba(MK.muted, 0.08); ctx.fill();
  }
  // the four extra skills as pills
  const [px, py, pw] = MAP.pills.map((v) => v * UNIT), ph = 54 * UNIT, gap = ((P916 ? 330 : 270) * UNIT - ph * 4) / 3;
  ['Missed-call text-back', 'AI chat assistant', 'SMS & email campaigns', 'Reporting dashboard'].forEach((s, i) => {
    const yy = py + i * (ph + gap);
    ctx.beginPath(); ctx.roundRect(px, yy, pw, ph, ph / 2); ctx.fillStyle = rgba(on ? MK.green : MK.muted, on ? 0.12 : 0.06); ctx.fill(); ctx.strokeStyle = rgba(on ? MK.green : MK.muted, on ? 0.6 : 0.3); ctx.lineWidth = 1.5 * UNIT; ctx.stroke();
    ctx.fillStyle = on ? MK.green : MK.muted; ctx.beginPath(); ctx.arc(px + 28 * UNIT, yy + ph / 2, 6 * UNIT, 0, TAU); ctx.fill();
    mkText(s, px + 50 * UNIT, yy + ph / 2 + 9 * UNIT, 25, { weight: 550, c: on ? MK.text : MK.muted });
  });
  // the hero: the customer's message, now at the start of the line
  mkBubble(MAP.n0 * UNIT + 150 * UNIT, MAP.line - 80 * UNIT, MSG, { size: 22, dim: on ? 0 : 0.5, flat: true });
}
SCENE.hold = () => systemMap(0);
SCENE.payoff = () => {
  systemMap(1);
  const sz = P916 ? 80 : 76;
  mkHeadline([['Business Automation,', 'n']], MIDX, MAP.head * UNIT, { t0: CUE.payoff + 0.05, size: sz, gap: 0.08 });
  mkHeadline([['Done Your Way.', 'i']], MIDX, MAP.head * UNIT + sz * 1.18 * UNIT, { t0: CUE.payoff + 0.25, size: sz * 1.12, green: true, gap: 0.08 });
};

// ---- 10. the opening, answered; then the end card
SCENE.reply = () => {
  mkStage({ c: MK.green, a: 0.12, cy: H * 1.12, rx: W * 0.95, sq: 0.45, wash: 0.5 });
  mkBubble(MIDX - 40 * UNIT, MIDY - 80 * UNIT, MSG, { size: 44, meta: '9:47 PM' });
  const ts = CUE.reply + 0.25;
  if (TT >= ts) { const e = springEase(TT - ts, SPRING.snappy.k, SPRING.snappy.d); mkBubble(MIDX + 40 * UNIT, MIDY + 90 * UNIT + (1 - e) * 40 * UNIT, REPLY, { size: 44, reply: true, s: lerp(0.6, 1, e), meta: 'Replied in 0:02', noAnchor: true }); }
};
SCENE.end = () => {
  mkStage({ c: MK.green, a: 0.24, cy: H * 1.15, rx: W * 0.9, sq: 0.45, wash: 0.7 });
  const L = P916 ? { mark: 560, mh: 300, name: 840, sub: 892, q: 1060, url: 1330 } : { mark: 280, mh: 250, name: 520, sub: 568, q: 712, url: 880 };
  const e = springEase(TT - CUE.end, SPRING.heavy.k, SPRING.heavy.d);
  mkMark(MIDX, L.mark * UNIT, L.mh * UNIT * lerp(0.85, 1, e), { rot: lerp(0.8, -0.4, e) + 0.05 * Math.sin(TT * 1.4), depth: 22 });
  const fade = (t) => clamp((TT - t) / 0.2);
  mkText('Mitakashime', MIDX, L.name * UNIT, 66, { weight: 700, align: 'center', alpha: fade(CUE.end + 0.1) });
  mkLabel('Business Automation Studio', MIDX, L.sub * UNIT, { align: 'center', size: 24, alpha: fade(CUE.end + 0.2) });
  if (P916) {   // two deliberate lines on 9:16
    mkHeadline([['What would you', 'n']], MIDX, L.q * UNIT, { t0: CUE.end + 0.35, size: 62 });
    mkHeadline([['automate first?', 'i']], MIDX, L.q * UNIT + 76 * UNIT, { t0: CUE.end + 0.55, size: 66, green: true });
  } else mkHeadline([['What would you', 'n'], ['automate first?', 'i']], MIDX, L.q * UNIT, { t0: CUE.end + 0.35, size: 58, green: true, maxW: 1000 });
  mkText('mitakashime.cosedevs.com', MIDX, L.url * UNIT, 32, { weight: 500, align: 'center', c: MK.text, alpha: 0.85 * fade(CUE.end + 0.6) });
};
