  // =====================================================================
  //  SCORE BODY — modern minimal electronic, 120 BPM, D minor (Dm · Bb · F · C, one chord per bar).
  //  Music bus ('m'): kick, clap, hats, sub bass, arp, pads, the hits. SFX bus ('s'): ping, ticks, station sounds.
  //  Arc: room tone → sparse pulse → cut out (6.0) → one hit (7.0) → pad + ticking → drop (10.0) → full groove
  //  through the stations → the rush (+ riser) → hard stop 17.45 → silence → THE HIT 19.0 (loudest) → flat chord
  //  → the answer chime → the end card decays.
  // =====================================================================
  const T = TIMELINE, q = T.cues;
  const BAR = 2.0;
  const CH = [['D3', 'F3', 'A3'], ['Bb2', 'D3', 'F3'], ['F2', 'A2', 'C3'], ['C3', 'E3', 'G3']];
  const ROOT = ['D2', 'Bb1', 'F2', 'C2'];
  const ARP = [['D4', 'F4', 'A4', 'D5'], ['Bb3', 'D4', 'F4', 'Bb4'], ['F4', 'A4', 'C5', 'F5'], ['C4', 'E4', 'G4', 'C5']];
  const chordAt = (t) => Math.floor(t / BAR) % 4;
  // drums built from the kit's oscillators and noise
  function kick(t, vel) {
    const o = osc('sine', 160, t, t + 0.5); o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    const g = ac.createGain(); env(g, t, 0.002, vel, 0.36); o.connect(g); out(g);
    noiseHit(t, 0.012, 'highpass', 3000, 0.7, vel * 0.18);
  }
  function clap(t, vel) { for (let i = 0; i < 3; i++) noiseHit(t + i * 0.011, i < 2 ? 0.02 : 0.16, 'bandpass', 1500, 1.2, vel * (i < 2 ? 0.6 : 1), 0, 0.25); }
  function hat(t, vel, open = false, pan = 0.15) { noiseHit(t, open ? 0.16 : 0.035, 'highpass', open ? 7000 : 9000, 0.8, vel, pan); }
  function stab(t, notes, vel, dur = 0.4) {
    notes.forEach((n, i) => { const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(5200, t); lp.frequency.exponentialRampToValueAtTime(600, t + dur);
      const g = ac.createGain(); env(g, t, 0.004, vel, dur);
      for (const d of [-9, 9]) { const o = osc('sawtooth', nz(n), t, t + dur + 0.05); o.detune.value = d; o.connect(lp); }
      lp.connect(g); out(g, (i - 1) * 0.3, 0.45); });
  }
  const grid = (a, b, step, fn) => { for (let t = a; t < b - 1e-6; t += step) fn(+t.toFixed(4)); };

  to = 'm';
  // ---- 1. the night (0–6.0): a dark pad, a sparse pulse from 1.5, hats from 3.0, thinning at 5.0, cut at 6.0
  pad(0.0, 6.0, ['D3', 'A3'], 0.012, { type: 'triangle', cut: 700, att: 1.2, rel: 0.25, send: 0.3 });
  grid(1.5, 6.0, 1.0, (t) => kick(t, 0.15));
  grid(1.5, 6.0, E8, (t) => bass(t, nz(ROOT[chordAt(t)]), (Math.round(t / E8) % 2 ? 0.08 : 0.14)));
  grid(3.0, 5.0, BEAT, (t) => hat(t + E8, 0.05));
  grid(3.0, 5.0, BEAT, (t) => pluck(t, nz(ARP[chordAt(t)][Math.round(t / BEAT) % 4]), 0.07, 0.2, 0.25, 1600, 0.3));
  // ---- 2. the turn: one hit at 7.0 (the second loudest)
  kick(q.hit, 0.25); sub(q.hit, 0.22); stab(q.hit, ['D4', 'F4', 'A4'], 0.1, 0.5);
  pad(q.hit + 0.02, 8.0, ['D3', 'A3', 'F4'], 0.02, { type: 'triangle', cut: 1200, att: 0.08, rel: 0.4, send: 0.6 });
  // ---- 3. the plan (8.0–10.0): a soft pad, ticking 16ths, a riser into the drop
  pad(8.0, 10.0, ['Bb2', 'F3', 'D4'], 0.022, { type: 'triangle', cut: 1500, att: 0.3, rel: 0.1, send: 0.4 });
  grid(8.0, 10.0, E16, (t) => hat(t, Math.round(t / E16) % 4 === 2 ? 0.05 : 0.022, false, -0.2));
  grid(8.0, 10.0, BEAT, (t) => bass(t, nz('Bb1'), 0.08));
  riser(9.0, 9.98, 0.035);
  // ---- 4. the system (10.0–15.5) and the rush (15.5–17.45): the full groove
  const G1 = 17.45;
  grid(10.0, G1, BEAT, (t) => kick(t, 0.17));
  grid(10.5, G1, 1.0, (t) => clap(t, 0.09));
  grid(10.0, G1, BEAT, (t) => hat(t + E8, 0.07, true));
  grid(10.0, G1, E16, (t) => hat(t, Math.round(t / E16) % 2 ? 0.02 : 0.035, false, -0.25));
  grid(10.0, G1, E8, (t) => bass(t, nz(ROOT[chordAt(t)]) * (Math.round(t / E8) % 4 === 3 ? 2 : 1), Math.round(t / E8) % 2 ? 0.08 : 0.12));
  grid(10.0, G1, E16, (t) => { const k = Math.round(t / E16); pluck(t, nz(ARP[chordAt(t)][[0, 1, 2, 3, 2, 1, 3, 2][k % 8]]), 0.034 + (t > 15.5 ? 0.016 : 0), (k % 2 ? 0.35 : -0.35), 0.18, 2600 + (t - 10) * 250, 0.25); });
  for (let b = 10.0; b < 15.5 - 1e-6; b += BAR) pad(b, b + BAR, CH[chordAt(b)].map((n) => n.replace(/\d/, (d) => +d + 1)), 0.007, { type: 'sawtooth', cut: 1100, att: 0.15, rel: 0.1, send: 0.35 });
  // the rush: a stab on every beat, rising, then a riser into the hard stop
  T.rush.forEach((t, i) => { stab(t, ARP[chordAt(t)].slice(0, 3), 0.05 + i * 0.012, 0.22); noiseHit(t, 0.2, 'bandpass', 1200 + i * 600, 1.4, 0.06, (i % 2 ? 0.4 : -0.4), 0.3); });
  riser(16.0, G1, 0.05);
  // ---- 5. the hold (17.5–19.0): silence. Nothing sounds here.
  // ---- 6. THE HIT (19.0): a chord stab + sub + kick on the hit, then a flat chord (craft.md payoff recipe)
  kick(q.payoff, 0.9); sub(q.payoff, 1.0); stab(q.payoff, ['D3', 'A3', 'D4', 'F4', 'A4', 'D5'], 0.5, 0.7); noiseHit(q.payoff, 0.9, 'lowpass', 7000, 0.7, 0.22, 0, 0.7, 1500);
  pad(q.payoff + 0.05, 22.6, ['D3', 'A3', 'D4', 'F4'], 0.05, { type: 'sawtooth', cut: 1700, att: 0.12, rel: 0.25, send: 0.5, swellTo: 0.04, swellAt: 21.2 });
  pad(22.5, 24.1, ['D3', 'A3', 'F4'], 0.012, { type: 'triangle', cut: 1200, att: 0.05, rel: 0.5, send: 0.6 });
  // a light pulse returns under the flat chord (kept well below the hit)
  // (no kicks under the flat chord: the hit stays the loudest moment)
  grid(20.0, 22.5, BEAT, (t) => hat(t + E8, 0.03, true));
  // ---- 7. the end card: one warm chord on 24.0, decaying
  sub(q.end, 0.1); stab(q.end, ['F3', 'A3', 'D4'], 0.05, 0.6);
  pad(q.end + 0.02, 26.0, ['D3', 'A3', 'F4'], 0.009, { type: 'triangle', cut: 1200, att: 0.1, rel: 1.4, send: 0.6 });

  to = 's';
  // ---- sound effects: the ping, the clock, the pile, the stations, the answer
  chime(q.ping, [nz('E6'), nz('B6')], 0.06, 0.1);
  for (let i = 0; i < 12; i++) blip(2.5 + i * 0.04, 3200, 2600, 0.008, 0.02, (i % 2 ? 0.2 : -0.2));   // the clock sweeping
  q.pile.forEach((t, i) => blip(t, 900 - i * 120, 700 - i * 120, 0.06, 0.035, -0.2));                   // unanswered, duller each time
  noiseHit(q.drift, 1.0, 'bandpass', 2400, 1.3, 0.012, 0.4, 0.3, 700);                                   // the bubble drifting away
  noiseHit(q.shrink + 0.2, 0.3, 'bandpass', 3000, 2, 0.015, 0, 0.3, 6000);                               // the mark to a point
  for (let i = 0; i < 4; i++) blip(9.5 + i * 0.06, 1500 + i * 200, 1800 + i * 200, 0.02, 0.02);         // the path turns green
  blip(10.0, 400, 1400, 0.18, 0.05);                                                                     // the bubble becomes the node
  const st = q.stations;
  blip(st[0], 2400, 2000, 0.02, 0.05); blip(st[0] + 0.25, 1800, 2200, 0.05, 0.04);                       // lead: a click, captured
  chime(st[1] + 0.15, [nz('A5'), nz('E6')], 0.05, 0.2);                                                   // reply: the answer chime
  noiseHit(st[2] + 0.2, 0.05, 'bandpass', 2200, 2, 0.08); blip(st[2] + 0.2, 1200, 600, 0.06, 0.05);       // booking: a snap
  noiseHit(st[3] + 0.12, 0.3, 'bandpass', 1400, 1.2, 0.03, 0, 0.1, 3000);                                 // CRM: a slide
  blip(st[4] + 0.12, 2600, 2600, 0.03, 0.04); blip(st[4] + 0.28, 3100, 3100, 0.03, 0.04);                // retention: two ticks
  chime(q.reply + 0.25, [nz('D6'), nz('A6')], 0.07, 0.15);                                                // the opening, answered
  chime(25.0, [nz('A5')], 0.025, 0.1);                                                                    // one last soft ping
