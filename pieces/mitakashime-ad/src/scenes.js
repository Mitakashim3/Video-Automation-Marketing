// =====================================================================
//  SCENES — one function per scene key (SHOT_LIST). World coords = screen coords at camera z=1.
//  Layout from MIDX / MIDY / ROW / UNIT so 1:1 and 9:16 each get their own arrangement.
// =====================================================================
const MSG = 'Hi, are you open tomorrow?';
const REPLY = 'Yes! 10:00 is open. Want it?';
const P916 = FORMAT === '9:16';

// the night world: a dark shop, the messages, the threads that tangle at its closed door.
// Layout rows: hero bubble high, the unanswered pile under it, the threads, the shop on the street.
const NL = P916
  ? { hero: 590, pile: 760, threads: 1010, street: 1440, shopX: MIDX - 170, otherX: MIDX + 270 }
  : { hero: 290, pile: 452, threads: 618, street: 965, shopX: MIDX - 200, otherX: MIDX + 300 };
function nightWorld(o = {}) {
  mkStage({ c: MK.muted, a: 0.26, cy: -H * 0.42, rx: W * 0.95, sq: 0.55, wash: 0.3 });
  const knot = clamp(ev(CUE.pile[0], 1.6)) * (o.knot ?? 1);
  mkThreads(NL.threads, { n: 3 + Math.round(4 * knot), spread: 260 * UNIT, pinch: 0.9, knot: 0.2 + knot, cx: NL.shopX, key: 'night', alpha: 0.85, amp: 46, w: 2.4 });
  mkShop(NL.shopX, NL.street, 330 * UNIT, 230 * UNIT, { lit: 0 });
  if (o.other) {   // a different business down the street, its window lit (no name, no logo)
    const ox = NL.otherX, ow = 170 * UNIT, oh = 290 * UNIT, oy = NL.street;
    ctx.fillStyle = rgba(MK.ground3, 0.95); ctx.fillRect(ox - ow / 2, oy - oh, ow, oh);
    const k = clamp(ev(CUE.drift, 0.5));
    const g = ctx.createLinearGradient(0, oy - oh * 0.78, 0, oy - oh * 0.36); g.addColorStop(0, rgba(MK.text, 0.12 + 0.3 * k)); g.addColorStop(1, rgba(MK.text, 0.04 + 0.1 * k));
    ctx.fillStyle = g; ctx.fillRect(ox - ow * 0.3, oy - oh * 0.78, ow * 0.6, oh * 0.42);
    ctx.strokeStyle = rgba(MK.line, 0.55); ctx.lineWidth = 2 * UNIT; ctx.strokeRect(ox - ow / 2, oy - oh, ow, oh);
    ctx.strokeRect(ox - ow * 0.3, oy - oh * 0.78, ow * 0.6, oh * 0.42);
  }
  return { other: [NL.otherX, NL.street - 290 * UNIT * 0.57] };
}
// the stacked unanswered messages (grey, dim), indented under the hero like a chat thread
function pile(n) {
  const msgs = ['Do you take walk-ins?', 'Missed call · 10:14 PM', 'Hello?'];
  for (let i = 0; i < n; i++) {
    if (TT < CUE.pile[i]) continue;
    const s = springMove(CUE.pile[i], 0.6, 1, SPRING.snappy);
    mkBubble(MIDX - 110 * UNIT + i * 46 * UNIT, NL.pile + i * 66 * UNIT, msgs[i], { size: 26, dim: 0.75, s, noAnchor: true, flat: true });
  }
}

SCENE.cold = () => {
  mkStage({ c: MK.muted, a: 0.1, cy: -H * 0.45, rx: W * 0.95, sq: 0.55, wash: 0 });
  const s = springMove(CUE.ping, 0, 1, SPRING.snappy);
  if (TT >= CUE.ping) mkBubble(MIDX, MIDY, MSG, { size: 44, s, meta: '9:47 PM' });
};
SCENE.night = () => {
  nightWorld();
  pile(CUE.pile.filter((c) => TT >= c).length);
  mkBubble(MIDX, NL.hero, MSG, { size: 40, dim: 0.55 * clamp(ev(3.0, 1.2)), meta: '9:47 PM' });
};
SCENE.clock = () => {
  mkStage({ c: MK.muted, a: 0.25, cy: H * 1.1 });
  const m = lerp(9 * 60 + 47, 11 * 60 + 58, EZ.io(seg(TT, 2.5, 3.0)));
  mkClock(MIDX, MIDY, 300 * UNIT, m);
  const hh = Math.floor(m / 60), mm = Math.floor(m % 60);
  mkLabel(`${hh}:${String(mm).padStart(2, '0')} PM · no reply`, MIDX, MIDY + 380 * UNIT, { align: 'center', size: 30, c: MK.muted });
};
SCENE.loss = () => {
  const w = nightWorld({ other: true });
  pile(3);
  // the hero lifts off and drifts down the street into the other, lit window; gone by 5.9
  const u = EZ.io(seg(TT, CUE.drift, 5.9));
  const x = lerp(MIDX, w.other[0], u), y = lerp(NL.hero, w.other[1], u) - Math.sin(u * Math.PI) * 90 * UNIT;
  if (u < 1) mkBubble(x, y, MSG, { size: 40, s: lerp(1, 0.2, EZ.i2(u)), dim: 0.3 * (1 - u), alpha: 1 - EZ.i3(seg(u, 0.7, 1)) });
  mkHeadline([['They', 'n'], ['moved on.', 'i']], MIDX, P916 ? 420 : 170, { t0: CUE.moved, size: 80 });
  const k = ev(6.05, 0.4); if (k > 0) { ctx.save(); screen(); ctx.fillStyle = rgba(MK.ground, k); ctx.fillRect(0, 0, W, H); ctx.restore(); }
};
SCENE.turn = () => {
  const on = past(TT, CUE.hit);
  mkStage({ c: MK.green, a: on ? lerp(0.0, 0.26, springEase(TT - CUE.hit, 120, 16)) : 0, cy: H * 1.16, rx: W * 0.85, sq: 0.5, wash: 0.9 });
  if (!on) { mkStage({ c: MK.muted, a: 0.07 * clamp(ev(6.5, 0.4)), cy: H * 1.16, rx: W * 0.85, sq: 0.5, wash: 0.5 }); return; }
  const e = springEase(TT - CUE.hit, SPRING.heavy.k, SPRING.heavy.d), sh = EZ.i3(seg(TT, CUE.shrink + 0.15, 8.0));
  const h = 330 * UNIT * lerp(0.82, 1, e) * (1 - sh * 0.97);
  mkMark(MIDX, MIDY - 10 * UNIT, h, { rot: lerp(1.0, -0.5, e) + 0.06 * Math.sin(TT * 1.3), depth: 30 });
  if (sh > 0) { ctx.fillStyle = MK.green; ctx.beginPath(); ctx.arc(MIDX, MIDY - 10 * UNIT, 7 * UNIT * sh, 0, TAU); ctx.fill(); }
};

// ---- the system world: one long line, five stations, the camera tracks along it
const ST_GAP = 1150;
const stX = (k) => MIDX + k * ST_GAP * UNIT;
const STATIONS = [
  { key: 'lead', head: [['Lead', 'n'], ['capture', 'i']], label: '01 / 05 · Lead capture' },
  { key: 'reply', head: [['Instant', 'n'], ['follow-up', 'i']], label: '02 / 05 · Instant follow-up' },
  { key: 'book', head: [['Auto', 'n'], ['booking', 'i']], label: '03 / 05 · Booking' },
  { key: 'crm', head: [['CRM', 'n'], ['pipeline', 'i']], label: '04 / 05 · CRM pipeline' },
  { key: 'keep', head: [['Reminders &', 'n'], ['reviews', 'i']], label: '05 / 05 · Retention' },
];
const stationAt = () => { let k = 0; CUE.stations.forEach((c, i) => { if (TT >= c - 0.25) k = i; }); return k; };
const CARD = { w: (P916 ? 820 : 780) * UNIT, h: (P916 ? 560 : 470) * UNIT };
function cardBox(k) { return [stX(k) - CARD.w / 2, ROW.line + 90 * UNIT, CARD.w, CARD.h]; }

function stationBook(k, t0) {
  const [x, y, w, h] = cardBox(k);
  mkCard(x, y, w, h, { glow: MK.green, glowA: 0.12 + 0.4 * clamp(ev(t0 + 0.25, 0.4)) });
  mkText('Thursday', x + 40 * UNIT, y + 70 * UNIT, 34, { weight: 650 });
  mkText('Oct 10', x + 40 * UNIT + 175 * UNIT, y + 70 * UNIT, 34, { c: MK.muted, weight: 500 });
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], hours = ['9:00', '10:00', '11:00', '12:00'];
  const gx = x + 130 * UNIT, gy = y + 130 * UNIT, cw = (w - 170 * UNIT) / 5, ch = (h - 170 * UNIT) / 4;
  days.forEach((d, i) => mkLabel(d, gx + cw * (i + 0.5), gy - 14 * UNIT, { align: 'center', size: 20 }));
  hours.forEach((hr, j) => mkLabel(hr, gx - 20 * UNIT, gy + ch * (j + 0.62), { align: 'right', size: 20, track: 0.02 }));
  const taken = [[0, 0], [1, 2], [2, 1], [4, 0], [0, 3], [2, 3], [4, 2]];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    const cx = gx + cw * i + 5 * UNIT, cy = gy + ch * j + 5 * UNIT, isT = taken.some(([a, b]) => a === i && b === j);
    ctx.beginPath(); ctx.roundRect(cx, cy, cw - 10 * UNIT, ch - 10 * UNIT, 10 * UNIT);
    ctx.fillStyle = rgba(MK.muted, isT ? 0.22 : 0.05); ctx.fill(); ctx.strokeStyle = rgba(MK.muted, 0.22); ctx.lineWidth = 1.2 * UNIT; ctx.stroke();
  }
  // the green slot snaps into Thu 10:00
  const ts = t0 + 0.2;
  if (TT >= ts) {
    const e = springEase(TT - ts, SPRING.snappy.k, SPRING.snappy.d), tx = gx + cw * 3 + 5 * UNIT, ty = gy + ch * 1 + 5 * UNIT;
    const yy = lerp(ty - 140 * UNIT, ty, e), sc = lerp(1.25, 1, e);
    ctx.save(); ctx.translate(tx + (cw - 10 * UNIT) / 2, yy + (ch - 10 * UNIT) / 2); ctx.scale(sc, sc);
    ctx.shadowColor = rgba(MK.green, 0.35); ctx.shadowBlur = 24 * UNIT;
    ctx.beginPath(); ctx.roundRect(-(cw - 10 * UNIT) / 2, -(ch - 10 * UNIT) / 2, cw - 10 * UNIT, ch - 10 * UNIT, 10 * UNIT); ctx.fillStyle = MK.green; ctx.fill();
    ctx.shadowColor = 'transparent'; ctx.font = `700 ${20 * UNIT}px ${SANS}`; ctx.fillStyle = MK.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; if (!MK_MUTE) ctx.fillText('Booked', 0, 1);
    ctx.restore();
  }
}
