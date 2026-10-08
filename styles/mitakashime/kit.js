// =====================================================================
//  styles/mitakashime/kit.js — "midnight automation": a deep green-black stage lit by one soft horizon,
//  hairline light threads that tangle and untangle, glass cards with dashed selection boxes (the plan),
//  a real logo extruded in glass, Inter headlines with one Instrument Serif italic phrase.
//  Matched from a dark motion-design reference (kept local, references/look/), recoloured to the brand.
//  Colour rule: green (MK.green) means only "answered" or "automated". Grey dashed = the plan / the problem.
//  Needs from the piece head: W, H, UNIT, SAFE, CX. Motion on 1s (springs), optional motion blur.
// =====================================================================
const MK = {
  ground: '#07120D', ground2: '#0B1B14', ground3: '#10251B', text: '#F4F6F2', muted: '#8A918C',
  green: '#4ADE80', line: '#C9D1CB', ink: '#07120D',
};
const SANS = 'Inter, "Inter Display", "Segoe UI", "Helvetica Neue", Arial, sans-serif';
const SERIF = '"Instrument Serif", "Iowan Old Style", Georgia, "Times New Roman", serif';
const rgba = (hex, a) => { const v = parseInt(hex.slice(1), 16); return `rgba(${v >> 16},${(v >> 8) & 255},${v & 255},${a})`; };

// ---------------------------------------------------------------------
//  light: a soft elliptical horizon rim (radial gradient, no blur filter) and a floor wash
// ---------------------------------------------------------------------
function mkHalo(cx, cy, rx, ry, w, color, a) {
  if (a <= 0.002) return;
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
  const r0 = Math.max(0, rx - w * 2.2), r1 = rx + w * 2.2, g = ctx.createRadialGradient(0, 0, r0, 0, 0, r1);
  g.addColorStop(0, rgba(color, 0)); g.addColorStop(0.35, rgba(color, a * 0.25)); g.addColorStop(0.5, rgba(color, a));
  g.addColorStop(0.62, rgba(color, a * 0.3)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r1, 0, TAU); ctx.fill(); ctx.restore();
  // the hairline core of the rim
  ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx);
  ctx.strokeStyle = rgba('#F4F6F2', a * 0.5); ctx.lineWidth = Math.max(1, w * 0.05); ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.stroke(); ctx.restore();
}
function mkWash(y, h, color, a) {   // light pooled at the bottom of the frame (screen space)
  if (a <= 0.002) return;
  ctx.save(); screen();
  const g = ctx.createRadialGradient(W / 2, y, 0, W / 2, y, h);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(0.55, rgba(color, a * 0.3)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}
// the stage: ground, a horizon rim above or below the subject, a floor wash. o: { c, a, cy, rx, wash }
function mkStage(o = {}) {
  ctx.save(); screen(); ctx.fillStyle = MK.ground; ctx.fillRect(0, 0, W, H);
  const c = o.c || MK.muted, a = o.a ?? 0.5, rx = o.rx ?? Math.max(W, H) * 0.62, cy = o.cy ?? H * 1.02;
  mkHalo(W / 2, cy, rx, rx * (o.sq ?? 0.62), 70 * UNIT, c, a);
  mkWash(H * 1.05, H * 0.75, c, (o.wash ?? 0.6) * a * 0.5);
  ctx.restore();
}

// ---------------------------------------------------------------------
//  threads: n hairlines across the frame that pinch and braid at the centre (the bottleneck),
//  or lie straight and merge into one green line when automated.
//  o: { n, spread, pinch 0..1, knot 0..1, t, color, alpha, w, x0, x1, cx, green 0..1 }
// ---------------------------------------------------------------------
function mkThreads(cy, o = {}) {
  const n = o.n ?? 7, x0 = o.x0 ?? -40, x1 = o.x1 ?? W + 40, cx = o.cx ?? (x0 + x1) / 2, half = (x1 - x0) / 2;
  const spread = o.spread ?? 360 * UNIT, pinch = o.pinch ?? 0.85, knot = o.knot ?? 1, t = o.t ?? TT;
  const amp = (o.amp ?? 60) * UNIT, R = RNG('threads', o.key ?? 'th');
  const ph = Array.from({ length: n }, () => [R.r(0, TAU), R.r(0.85, 1.2)]);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 0; i < n; i++) {
    const off = n > 1 ? (i / (n - 1) - 0.5) * spread : 0;
    ctx.beginPath();
    for (let k = 0; k <= 140; k++) {
      const x = x0 + (x1 - x0) * k / 140, u = (x - cx) / half, env = Math.exp(-((u * 2.4) ** 2)), fan = 1 - pinch * Math.exp(-((u * 1.6) ** 2));
      const y = cy + off * fan + knot * env * amp * Math.sin(x * 0.026 / UNIT * ph[i][1] + ph[i][0] + t * 2.4) * (0.6 + 0.4 * Math.sin(i * 1.7 + t));
      if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.strokeStyle = o.color || rgba(MK.line, o.alpha ?? 0.55); ctx.lineWidth = (o.w ?? 1.8) * UNIT; ctx.stroke();
  }
  ctx.restore();
}

// ---------------------------------------------------------------------
//  glass card: a dark rounded panel, hairline border, light pooled at its bottom edge
// ---------------------------------------------------------------------
function mkCard(x, y, w, h, o = {}) {
  const r = (o.r ?? 26) * UNIT;
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  // depth: a soft shadow under the card
  ctx.shadowColor = 'rgba(0,0,0,0.55)'; ctx.shadowBlur = 50 * UNIT; ctx.shadowOffsetY = 24 * UNIT;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, MK.ground3); g.addColorStop(1, MK.ground2);
  ctx.fillStyle = g; ctx.fill(); ctx.shadowColor = 'transparent';
  if (o.glow) {   // light at the bottom edge: grey for the problem, green for the automated
    ctx.save(); ctx.clip();
    const gg = ctx.createRadialGradient(x + w / 2, y + h * 1.15, 0, x + w / 2, y + h * 1.15, w * 0.75);
    gg.addColorStop(0, rgba(o.glow, o.glowA ?? 0.42)); gg.addColorStop(1, rgba(o.glow, 0));
    ctx.fillStyle = gg; ctx.fillRect(x, y, w, h); ctx.restore();
  }
  ctx.lineWidth = 1.5 * UNIT; ctx.strokeStyle = rgba(MK.text, o.edge ?? 0.13); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.stroke();
  // top highlight
  const hl = ctx.createLinearGradient(x, 0, x + w, 0); hl.addColorStop(0, rgba(MK.text, 0)); hl.addColorStop(0.5, rgba(MK.text, 0.22)); hl.addColorStop(1, rgba(MK.text, 0));
  ctx.strokeStyle = hl; ctx.beginPath(); ctx.moveTo(x + r, y + 0.75); ctx.lineTo(x + w - r, y + 0.75); ctx.stroke();
  ctx.restore();
}
// the plan: a dashed selection box with corner handles (marching ants), drawn on by frac
function mkSelect(x, y, w, h, o = {}) {
  const frac = clamp(o.frac ?? 1); if (frac <= 0) return;
  const P = [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.setLineDash([7 * UNIT, 7 * UNIT]); ctx.lineDashOffset = -TT * 28 * UNIT;
  ctx.strokeStyle = o.c || rgba(MK.muted, 0.9); ctx.lineWidth = 1.6 * UNIT;
  const S = subPath(P, frac); ctx.beginPath(); S.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke();
  ctx.setLineDash([]);
  const hs = 11 * UNIT * clamp(frac * 2);
  for (const [a, b] of [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]) {
    ctx.fillStyle = MK.ground; ctx.strokeStyle = o.c || MK.muted; ctx.lineWidth = 1.6 * UNIT;
    ctx.beginPath(); ctx.rect(a - hs / 2, b - hs / 2, hs, hs); ctx.fill(); ctx.stroke();
  }
  if (o.label && frac > 0.4) mkLabel(o.label, x, y - 16 * UNIT, { c: o.c || MK.muted, size: o.size ?? 22, alpha: clamp((frac - 0.4) * 3) });
  ctx.restore();
}
// dashed guide lines (the layout grid of the plan), screen space
function mkGuides(a = 0.35, pad = 70) {
  if (a <= 0) return;
  ctx.save(); screen(); ctx.setLineDash([6, 8]); ctx.strokeStyle = rgba(MK.muted, a); ctx.lineWidth = 1.2;
  const p = pad * UNIT; ctx.beginPath();
  ctx.moveTo(p, 0); ctx.lineTo(p, H); ctx.moveTo(W - p, 0); ctx.lineTo(W - p, H);
  ctx.moveTo(0, p); ctx.lineTo(W, p); ctx.moveTo(0, H - p); ctx.lineTo(W, H - p); ctx.stroke(); ctx.restore();
}
function mkCursor(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * UNIT, s * UNIT);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(9, 26); ctx.lineTo(15, 40); ctx.lineTo(21, 37); ctx.lineTo(15, 24); ctx.lineTo(27, 24); ctx.closePath();
  ctx.fillStyle = MK.text; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = MK.ground; ctx.stroke(); ctx.restore();
}
// small caps label (grey by default)
function mkLabel(str, x, y, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.font = `${o.weight ?? 600} ${(o.size ?? 22) * UNIT}px ${SANS}`;
  ctx.letterSpacing = `${(o.track ?? 0.12) * (o.size ?? 22) * UNIT}px`; ctx.fillStyle = o.c || MK.muted; ctx.textAlign = o.align || 'left'; ctx.textBaseline = 'alphabetic';
  ctx.fillText(o.upper === false ? str : str.toUpperCase(), x, y); ctx.restore();
}
function mkText(str, x, y, size, o = {}) {
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1; ctx.font = `${o.italic ? 'italic ' : ''}${o.weight ?? (o.serif ? 400 : 600)} ${size * UNIT}px ${o.serif ? SERIF : SANS}`;
  ctx.letterSpacing = `${(o.track ?? (o.serif ? 0 : -0.02)) * size * UNIT}px`;
  ctx.fillStyle = o.c || MK.text; ctx.textAlign = o.align || 'left'; ctx.textBaseline = o.base || 'alphabetic';
  ctx.fillText(str, x, y); const w = ctx.measureText(str).width; ctx.restore(); return w;
}

// ---------------------------------------------------------------------
//  headline: words rise on a spring and sharpen from a blur, one by one.
//  parts = [['First, we', 'n'], ['learn', 'i'], ['your business.', 'n']]  'n' = Inter, 'i' = Instrument Serif italic
//  o: { t0, gap, size, align: 'center'|'left'|'right', green (italic in green), maxW, lh } — drawn in screen space (DEFER)
// ---------------------------------------------------------------------
function mkHeadline(parts, x, y, o = {}) {
  const f = () => mkHeadlineNow(parts, x, y, o);
  if (DEFER) DEFER.push(f); else f();
}
function mkHeadlineNow(parts, x, y, o) {
  const size = (o.size ?? 64) * UNIT, t0 = o.t0 ?? E0 + 0.1, gap = o.gap ?? 0.09, align = o.align || 'center';
  ctx.save(); screen();
  // split into words keeping their style, then wrap into lines
  const words = []; parts.forEach(([s, k]) => s.split(' ').forEach((w) => w && words.push([w, k])));
  const fontOf = (k) => (k === 'i' ? `italic 400 ${size * 1.14}px ${SERIF}` : `${o.weight ?? 650} ${size}px ${SANS}`);
  const wOf = (w, k) => { ctx.font = fontOf(k); ctx.letterSpacing = k === 'i' ? '0px' : `${-0.025 * size}px`; return ctx.measureText(w).width; };
  const sp = size * 0.27, maxW = (o.maxW ?? 900) * UNIT, lines = [[]]; let lw = 0;
  words.forEach(([w, k], i) => { const ww = wOf(w, k); if (lw + ww > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; } lines[lines.length - 1].push([w, k, ww, i]); lw += ww + sp; });
  const lh = size * (o.lh ?? 1.12);
  lines.forEach((L, li) => {
    const tot = L.reduce((a, [, , ww]) => a + ww, 0) + sp * (L.length - 1);
    let px = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x;
    const py = y + li * lh;
    for (const [w, k, ww, i] of L) {
      const ts = t0 + i * gap, e = springEase(TT - ts, SPRING.smooth.k, SPRING.smooth.d);
      if (TT >= ts) {
        ctx.save(); ctx.globalAlpha = clamp((TT - ts) / 0.18) * (o.alpha ?? 1);
        const bl = (1 - clamp((TT - ts) / 0.3)) * 10; if (bl > 0.3) ctx.filter = `blur(${bl.toFixed(1)}px)`;
        ctx.font = fontOf(k); ctx.letterSpacing = k === 'i' ? '0px' : `${-0.025 * size}px`; ctx.textBaseline = 'alphabetic';
        ctx.fillStyle = k === 'i' ? (o.green ? MK.green : MK.text) : (o.c || MK.text);
        ctx.fillText(w, px, py + (1 - e) * size * 0.45);
        ctx.restore();
      }
      px += ww + sp;
    }
  });
  ctx.restore();
}

// ---------------------------------------------------------------------
//  the hero: the customer's message bubble. Centre-anchored. o: { size, dim 0..1, reply (green, tail right), meta, s, w }
// ---------------------------------------------------------------------
function mkBubbleBox(text, size) {
  ctx.save(); ctx.font = `500 ${size * UNIT}px ${SANS}`; ctx.letterSpacing = `${-0.01 * size * UNIT}px`;
  const tw = ctx.measureText(text).width; ctx.restore();
  const px = size * 0.75 * UNIT, py = size * 0.6 * UNIT;
  return { w: tw + px * 2, h: size * UNIT + py * 2, tw };
}
function mkBubble(x, y, text, o = {}) {
  const size = o.size ?? 40, s = o.s ?? 1; if (s <= 0.001) return;
  const { w, h } = mkBubbleBox(text, size), r = Math.min(h / 2, 34 * UNIT);
  const reply = !!o.reply, fill = reply ? MK.green : MK.text, dim = o.dim ?? 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha *= (o.alpha ?? 1) * (1 - dim * 0.62);
  if (!o.flat) { ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 40 * UNIT; ctx.shadowOffsetY = 18 * UNIT; }
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r);
  // the tail
  const tx = reply ? w / 2 - r * 0.9 : -w / 2 + r * 0.9, d = reply ? 1 : -1;
  ctx.moveTo(tx - d * 10 * UNIT, h / 2 - 2); ctx.quadraticCurveTo(tx + d * 6 * UNIT, h / 2 + 18 * UNIT, tx + d * 26 * UNIT, h / 2 + 16 * UNIT);
  ctx.quadraticCurveTo(tx + d * 12 * UNIT, h / 2 + 4 * UNIT, tx + d * 16 * UNIT, h / 2 - 6 * UNIT);
  ctx.fillStyle = dim > 0 && !reply ? mixHex(MK.text, MK.muted, dim) : fill; ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.font = `500 ${size * UNIT}px ${SANS}`; ctx.letterSpacing = `${-0.01 * size * UNIT}px`; ctx.fillStyle = MK.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, size * 0.04 * UNIT);
  if (o.meta) { ctx.font = `500 ${size * 0.55 * UNIT}px ${SANS}`; ctx.letterSpacing = '0px'; ctx.fillStyle = reply ? MK.green : MK.muted; ctx.textAlign = reply ? 'right' : 'left';
    ctx.fillText(o.meta, reply ? w / 2 : -w / 2, h / 2 + size * 1.0 * UNIT); }
  ctx.restore();
  if (!o.noAnchor) SPARK_AT = toScreen(x, y);
  return { w: w * s, h: h * s };
}

// ---------------------------------------------------------------------
//  the real logo (assets/mark.png, the user's own file, drawn unaltered) extruded in glass:
//  the same file stacked back in depth at low opacity, turned about its vertical axis by squeezing x.
//  o: { rot (radians about y), depth (layers), alpha, glow (colour of the light beneath) }
// ---------------------------------------------------------------------
let MK_SIDE = null;
function mkSideOf(img) {   // the logo's silhouette in the extrusion's side tone (the face itself is never recoloured)
  if (MK_SIDE) return MK_SIDE;
  const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d');
  g.drawImage(img, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#1E3A2D'; g.fillRect(0, 0, c.width, c.height);
  return (MK_SIDE = c);
}
function mkMark(x, y, h, o = {}) {
  const img = asset('mark.png'); if (!img) return;
  const w = h * img.naturalWidth / img.naturalHeight, side = mkSideOf(img);
  const rot = o.rot ?? 0, sx = Math.cos(rot), depth = o.depth ?? 18, dx = Math.sin(rot) * h * 0.0042, dy = h * 0.0022;
  ctx.save(); ctx.globalAlpha *= o.alpha ?? 1;
  ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60 * UNIT; ctx.shadowOffsetY = 40 * UNIT;
  for (let i = depth; i >= 1; i--) {
    ctx.save(); ctx.translate(x + dx * i, y + dy * i); ctx.scale(sx, 1);
    ctx.drawImage(side, -w / 2, -h / 2, w, h); ctx.restore();
    if (i === depth) ctx.shadowColor = 'transparent';
  }
  ctx.shadowColor = 'transparent';
  ctx.save(); ctx.translate(x, y); ctx.scale(sx, 1); ctx.drawImage(img, -w / 2, -h / 2, w, h); ctx.restore();
  ctx.restore();
}

// ---------------------------------------------------------------------
//  props: a line-art shopfront, a wall clock, a node on the line
// ---------------------------------------------------------------------
function mkShop(x, y, w, h, o = {}) {   // x,y = bottom centre
  const lit = o.lit ?? 0, a = o.alpha ?? 1, L = (P, al = 0.6, lw = 2) => { ctx.beginPath(); P.forEach(([p, q], i) => (i ? ctx.lineTo(p, q) : ctx.moveTo(p, q))); ctx.strokeStyle = rgba(MK.line, al * a); ctx.lineWidth = lw * UNIT; ctx.stroke(); };
  const x0 = x - w / 2, x1 = x + w / 2, y0 = y - h;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // facade fill (depth): slightly lifted ground
  ctx.fillStyle = rgba(MK.ground3, 0.9 * a); ctx.fillRect(x0, y0, w, h);
  // windows and door, lit from inside at the payoff
  const win = [[x0 + w * 0.08, y0 + h * 0.36, w * 0.36, h * 0.38], [x0 + w * 0.56, y0 + h * 0.36, w * 0.36, h * 0.38]];
  const door = [x - w * 0.09, y0 + h * 0.5, w * 0.18, h * 0.5];
  for (const [wx, wy, ww, wh] of [...win, door]) {
    const g = ctx.createLinearGradient(0, wy, 0, wy + wh); g.addColorStop(0, rgba(MK.text, (0.03 + lit * 0.32) * a)); g.addColorStop(1, rgba(MK.text, (0.01 + lit * 0.12) * a));
    ctx.fillStyle = g; ctx.fillRect(wx, wy, ww, wh); L([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh], [wx, wy]], 0.5, 1.6);
  }
  L([[x0, y], [x0, y0], [x1, y0], [x1, y]], 0.75, 2.2);                                         // the building
  L([[x0 - w * 0.04, y0 + h * 0.22], [x1 + w * 0.04, y0 + h * 0.22]], 0.6, 2);                  // the awning line
  for (let i = 0; i <= 8; i++) L([[x0 - w * 0.04 + (w * 1.08) * i / 8, y0 + h * 0.22], [x0 + (w) * i / 8, y0 + h * 0.3]], 0.3, 1.4);
  L([[x0 - w * 0.2, y], [x1 + w * 0.2, y]], 0.45, 1.6);                                          // the street
  ctx.restore();
}
function mkClock(x, y, r, mins, o = {}) {
  const a = o.alpha ?? 1;
  ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
  ctx.fillStyle = rgba(MK.ground3, 0.95); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.strokeStyle = rgba(MK.line, 0.7); ctx.lineWidth = 2.2 * UNIT; ctx.stroke();
  for (let i = 0; i < 60; i++) { const an = i / 60 * TAU, k = i % 5 ? 0.93 : 0.85; ctx.lineWidth = (i % 5 ? 1.2 : 2.4) * UNIT; ctx.strokeStyle = rgba(MK.line, i % 5 ? 0.3 : 0.7);
    ctx.beginPath(); ctx.moveTo(x + Math.cos(an) * r * k, y + Math.sin(an) * r * k); ctx.lineTo(x + Math.cos(an) * r * 0.97, y + Math.sin(an) * r * 0.97); ctx.stroke(); }
  const hand = (an, len, lw, c) => { ctx.strokeStyle = c; ctx.lineWidth = lw * UNIT; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(an) * len, y - Math.cos(an) * len); ctx.stroke(); };
  hand(mins / 720 * TAU, r * 0.5, 5, MK.text); hand((mins % 60) / 60 * TAU, r * 0.78, 3, MK.text);
  ctx.fillStyle = MK.text; ctx.beginPath(); ctx.arc(x, y, 6 * UNIT, 0, TAU); ctx.fill();
  ctx.restore();
}
function mkNode(x, y, r, o = {}) {   // a station node on the line: grey ring (planned) or green (automated)
  const g = o.green ?? 1;
  ctx.save();
  if (g > 0) { ctx.fillStyle = rgba(MK.green, 0.16 * g); ctx.beginPath(); ctx.arc(x, y, r * 2.1, 0, TAU); ctx.fill(); }
  ctx.fillStyle = MK.ground; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  ctx.lineWidth = 3 * UNIT; ctx.strokeStyle = g > 0.5 ? MK.green : MK.muted; ctx.stroke();
  ctx.fillStyle = g > 0.5 ? MK.green : MK.muted; ctx.beginPath(); ctx.arc(x, y, r * 0.42, 0, TAU); ctx.fill();
  ctx.restore();
}
// a line along points P: dashed grey (the plan) or solid green (built), drawn to frac
function mkPath(P, o = {}) {
  const frac = clamp(o.frac ?? 1); if (frac <= 0) return;
  const S = subPath(P, frac);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.plan) { ctx.setLineDash([10 * UNIT, 10 * UNIT]); ctx.lineDashOffset = -TT * 30 * UNIT; ctx.strokeStyle = rgba(MK.muted, o.alpha ?? 0.9); ctx.lineWidth = 2 * UNIT; }
  else {
    ctx.strokeStyle = rgba(MK.green, 0.18 * (o.alpha ?? 1)); ctx.lineWidth = 12 * UNIT; ctx.beginPath(); S.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke();
    ctx.strokeStyle = rgba(MK.green, o.alpha ?? 1); ctx.lineWidth = 3.2 * UNIT;
  }
  ctx.beginPath(); S.forEach(([a, b], i) => (i ? ctx.lineTo(a, b) : ctx.moveTo(a, b))); ctx.stroke(); ctx.restore();
  return S[S.length - 1];
}

// ---------------------------------------------------------------------
//  post: vignette + fine film grain (breaks gradient banding)
// ---------------------------------------------------------------------
let MK_GRAIN = null;
function mkGrainTile() {
  if (MK_GRAIN) return MK_GRAIN;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), id = g.createImageData(256, 256), R = RNG('mkgrain');
  for (let i = 0; i < id.data.length; i += 4) { const v = R.f() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 14; }
  g.putImageData(id, 0, 0); return (MK_GRAIN = c);
}
const STYLE = {
  name: 'mitakashime',
  paper: MK.ground,
  backdrop(c) { fillAll(c); },
  window(P, key, src) { ctx.save(); trace(P, true); ctx.clip(); ctx.drawImage(src, 0, 0); ctx.restore(); },
  blob(P, c) { ctx.save(); trace(P, true); ctx.fillStyle = c; ctx.fill(); ctx.restore(); },
  hero(x, y, r) { mkBubble(x, y, '…', { size: r * 0.8 }); },
  heroColor: MK.text,
  post() {
    ctx.save(); screen();
    const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    const t = mkGrainTile(), R = RNG('gr', F); ctx.globalCompositeOperation = 'overlay';
    ctx.translate(-R.r(0, 255), -R.r(0, 255)); ctx.fillStyle = ctx.createPattern(t, 'repeat'); ctx.fillRect(0, 0, W + 256, H + 256);
    ctx.restore();
  },
  ones: true,
};
