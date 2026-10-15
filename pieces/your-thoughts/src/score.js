  // ================= YOUR THOUGHTS: the arc =================
  // a thin, uneasy minor figure under the tangle (busiest at the press) -> a dip while the eraser rubs -> one chime as the
  // last loop is inked -> warm D major, a rising note per ring -> the morph's rising fifth -> a flat groove, one pluck per
  // day, speeding up -> dead silence for the last circle -> the loudest hit as every circle inks -> warm -> the fifth again
  const T = TIMELINE, cu = T.cues, R = RNG('score');
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };
  const HERO5 = (t, vel, notes = [['D4', 0], ['A4', E8]]) => notes.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));   // the hero: a rising fifth
  const UNEASY = ['D4', 'F4', 'E4', 'F4', 'A4', 'F4', 'E4', 'Cs5'];
  const DAYS = ['D4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'E4', 'A4'];

  // ================= MUSIC =================
  to = 'm';
  // 0-1.5: near silence, a low pad
  pad(0.0, 1.6, ['D3', 'A3'], 0.02, { type: 'triangle', cut: 600, att: 0.4, rel: 0.2 });
  // 1.5-6.25: the tangle, a minor figure that thickens, quarters -> 8ths -> 16ths at the press
  pad(1.5, 6.3, ['D3', 'F3', 'A3'], 0.028, { cut: 800, att: 0.4, rel: 0.05, send: 0.2 });
  each(1.5, 3.5, BEAT, (t, k) => pluck(t, nz(UNEASY[(k * 2) % 8]), 0.05, Math.sin(k) * 0.3, 0.4, 2200, 0.2));
  each(3.5, 5.5, E8, (t, k) => { pluck(t, nz(UNEASY[k % 8]), 0.055 * (k % 2 ? 0.75 : 1), Math.sin(k * 0.9) * 0.3, 0.3, 2600, 0.15); if (k % 2 === 0) bass(t, nz('D2'), 0.14); });
  each(5.5, 6.25, E16, (t, k) => { pluck(t, nz(UNEASY[(k * 3) % 8]), 0.06, Math.sin(k * 1.3) * 0.4, 0.2, 3200, 0.05); if (k % 2 === 0) bass(t, nz(k % 4 ? 'F2' : 'D2'), 0.15); });
  // 7.5: the last loop is inked: one chime (sfx below); 8.25-12.4: warm, a rising note per ring
  pad(8.0, 12.5, ['D3', 'A3', 'Fs4'], 0.034, { cut: 1100, att: 0.5, rel: 0.3, send: 0.4 });
  const RISE = ['D4', 'E4', 'Fs4', 'A4', 'B4', 'D5', 'E5', 'Fs5', 'A5', 'D6'];
  for (let i = 1; i <= RING_N; i++) pluck(ringT(i), nz(RISE[i - 1]), 0.05, -0.3 + i * 0.06, 0.5, 2800, 0.35);
  [[11.0, 'A4'], [11.5, 'Fs4'], [12.0, 'E4']].forEach(([t, n], i) => pluck(t, nz(n), 0.035, 0.2 - i * 0.2, 0.6, 2400, 0.4));
  // 13.6: the beginner's circle: the hero's fifth
  HERO5(13.6, 0.12);
  // 13.6-21.0: practice, a flat groove: one pluck per day (each circle), a bass on the beat, 8ths when it speeds up
  pad(13.6, 21.0, ['D3', 'A3', 'E4'], 0.03, { cut: 1000, att: 0.3, rel: 0.02, send: 0.25 });
  PETAL_T.slice(1, -1).forEach((t, i) => pluck(t, nz(DAYS[i % 8]), t >= 18.5 ? 0.06 : 0.07, Math.sin(i * 0.9) * 0.35, t >= 20.5 ? 0.22 : 0.3, 3000 + (t >= 18.5 ? 600 : 0), t >= 20.5 ? 0 : 0.18));
  each(14.5, 21.0, BEAT, (t, k) => { bass(t, nz(Math.floor(k / 2) % 2 ? 'A2' : 'D2'), 0.14); if (t >= 18.5 && t < 20.25) sub(t, 0.05); });
  each(18.5, 21.0, E8, (t, k) => { if (k % 2) noiseHit(t, 0.02, 'highpass', 8000, 0.7, 0.02, k % 4 === 1 ? 0.3 : -0.3, t >= 20.5 ? 0 : 0.02); });
  // 21.0-23.0: silence (everything above ends dry before 21.0)
  // 23.0: every circle inks: a short chord stab and a sub, then a flat warm chord
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(cu.payoff + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(cu.payoff, cu.payoff + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.5, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });
  pad(cu.payoff + 0.5, 25.2, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.045, { cut: 1300, att: 0.25, rel: 0.4, send: 0.5 });
  drone(cu.payoff + 0.5, 25.2, nz('D2'), 0.06, { att: 0.12, rel: 0.4 });
  // 25-31: the return decays: the same chord, half as loud, then the opening pad
  pad(25.0, 28.2, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.018, { cut: 1100, att: 0.4, rel: 0.4, send: 0.5 });
  drone(25.0, 28.2, nz('D2'), 0.022, { att: 0.4, rel: 0.4 });
  [[24.5, 'A4'], [25.0, 'D5'], [25.5, 'Fs5'], [26.5, 'E5'], [27.0, 'D5'], [27.5, 'A4']].forEach(([t, n], i) => pluck(t, nz(n), t >= 25 ? 0.022 : 0.036, (i - 2) * 0.15, 0.6, 3000, 0.4));
  // 28-31: the closing line, back to the opening pad, the hero's fifth as it's underlined; it fades
  pad(28.0, 31.0, ['D3', 'A3', 'Fs4'], 0.02, { type: 'triangle', cut: 800, att: 0.3, rel: 0.6 });
  HERO5(cu.sign, 0.08, [['D4', 0], ['A4', E8], ['D5', BEAT]]);

  // ================= SFX =================
  to = 's';
  const scratch = (t0, t1, vel = 0.03, f = 2800) => { for (let t = t0; t < t1 - 1e-6; t += E16) noiseHit(t + 0.01, 0.1, 'bandpass', f + R.n(500), 1.4, vel * (0.7 + R.f() * 0.5), 0.2); };
  scratch(cu.seed, cu.seed + 0.6, 0.02);                                              // the first loop
  TANGLE.forEach((L) => scratch(L.t, L.t + 0.45, 0.022 + 0.002 * TANGLE.indexOf(L))); // each layer of the tangle
  for (let t = cu.erase; t < cu.eraseEnd - 1e-6; t += E16) noiseHit(t, 0.11, 'lowpass', 900 + R.n(150), 0.8, 0.03, Math.sin(t * 9) * 0.3);   // the rubbing
  chime(cu.inkSeed + 0.35, [nz('D5'), nz('A5'), nz('E6')], 0.07, 0);               // the last loop is inked
  for (let i = 1; i <= RING_N; i++) scratch(ringT(i), ringT(i) + 0.25, 0.012, 3400);
  sweep(12.4, 13.0, 0.012, 500, 2800, 0);                                             // into the morph
  for (let i = 0; i < PETAL_N - 1; i++) scratch(PETAL_T[i], PETAL_T[i] + Math.min(PETAL_D[i], 0.5), 0.014, 3200);
  [8.9, cu.pull + 0.5].forEach((t) => blip(t, 900, 1500, 0.08, 0.03, 0.3));        // the bubble pops
  sub(cu.payoff, 0.22);
  for (let i = 0; i < 4; i++) blip(26.2 + i * E8, 2200 + (i % 2) * 400, 1800, 0.03, 0.02, 0.3);   // birds
