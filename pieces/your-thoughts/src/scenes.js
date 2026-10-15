// =====================================================================
//  SCENES — your thoughts. World coords 1080x1920 (the page); time TT on 2s; ev / popS for events.
//  Graphite = the mess and the provisional; ink = what is settled; terracotta = the hero only;
//  highlighter = the word to read (and the flower's heart, the one glowing thing).
// =====================================================================
const HERO = { x: 380, y: 1000, r: 95 };
const THINK = { x: 540, y: 570 };                    // where the thought lives, over the hero's head
const GROUND = 1140;
const BUBBLE = { x: 790, y: 940, w: 300, h: 170 };

// ---- background life (graphite, small): an ant on the ground line, margin stars that twinkle
function antDoodle(x, y, s, key) {
  for (let i = 0; i < 3; i++) { ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.ellipse(x + (i - 1) * 11 * s, y - 6 * s, (i === 1 ? 5 : 6.5) * s, 5 * s, 0, 0, TAU); ctx.fill(); }
  const k = B % 2 ? 1 : -1;
  for (let i = 0; i < 3; i++) gline([[x + (i - 1) * 8 * s, y - 4 * s], [x + (i - 1) * 8 * s + k * (i % 2 ? 5 : -5) * s, y + 3 * s]], { w: 1.8 * s, key: key + i, amp: 0.3, second: false, step: 4 });
  gline([[x + 16 * s, y - 8 * s], [x + 24 * s, y - 16 * s]], { w: 1.6 * s, key: key + 'ant', amp: 0.3, second: false, step: 4 });
}
function pageLife(key) {
  gpencil([[90, GROUND + 2], [400, GROUND - 4], [700, GROUND + 4], [980, GROUND - 2]], { key: 'ground', w: 3, a: 0.75 });
  antDoodle(560 + mod(TT * 34, 420), GROUND - 1, 1.5, 'ant');
  [[110, 480, 0], [150, 720, 1], [96, 860, 2]].forEach(([x, y, i]) => doodleStar(x, y, 22 + 7 * ((B + i) % 3 === 0), key + 'mstar' + i, { w: 3.2 }));
}

// ---- a speech bubble from the hero: graphite while it's a mean thought, ink once it's kind
function speechBubble(lines, o = {}) {
  const { pen = 'ink', reveal = 1, key = 'bub', strike = 0, pop = 1 } = o;
  const { x, y, w, h } = BUBBLE;
  ctx.save(); ctx.translate(x, y); ctx.scale(pop, pop); ctx.translate(-x, -y);
  const box = sketchBox(x - w / 2, y - h / 2, w, h, 30, 0.05);
  const tail = [[x - w / 2 + 14, y + 22], [HERO.x + 128, HERO.y - 34], [x - w / 2 + 12, y + 56]];
  gfill(box, SK.sheet, { a: 0.75, off: [0, 0], key: key + 'f' });
  if (pen === 'ink') { gline(box, { w: 4.5, key: key + 'o' }); gline(tail, { w: 4.5, key: key + 't', second: false }); }
  else { gpencil(box, { w: 3, key: key + 'o', a: 0.9 }); gpencil(tail, { w: 3, key: key + 't', a: 0.9 }); }
  const col = pen === 'ink' ? SK.ink : SK.graph;
  lines.forEach((ln, i) => {
    const ly = y - 8 + (i - (lines.length - 1) / 2) * 62 + 18;
    const [x0, x1] = handLetter(ln, x, ly, 58, { col, key: key + 'l' + i, reveal: clamp(reveal * lines.length - i) });
    if (strike > 0) gpencil([[x0 - 10, ly - 18], [lerp(x0 - 10, x1 + 12, clamp(strike * 2 - i)), ly - 22]], { w: 4, key: key + 's' + i, a: 0.95, col: SK.ink });
  });
  ctx.restore();
}

// ---- the hero, with its idle life (blinks are in the kit; a bob on 2s)
function hero(o = {}) {
  const bob = o.bob ?? 4 * Math.sin(B * 0.7);
  return doodleHero(o.x ?? HERO.x, (o.y ?? HERO.y) + bob, HERO.r, { key: 'hero', legs: true, ...o });
}

// =====================================================================
//  ERA 0: the thoughts (tangle -> eraser -> rings)
// =====================================================================
const SEED = { x: 330, y: THINK.y, r: 40 };          // the first loop; it survives the eraser and becomes ring 0
const TANGLE = [...Array(9)].map((_, i) => {
  const S = RNG('tangle', i), k = i / 8;
  return { x: THINK.x + S.n(38) - 10, y: THINK.y + S.n(26), w: 230 + 360 * k, h: 200 + 290 * k, t: 1.5 + 0.5 * i, n: 22 + Math.round(18 * k), key: 'tg' + i };
});
const RING_N = 10, RING_X = 290;
const ringR = (i) => SEED.r + 22 * i;
const ringT = (i) => TIMELINE.cues.rings + E8 * (i - 1);
const ERASE_ROWS = 5, ERASE_Y0 = 310, ERASE_RH = 104, ERASE_X = [210, 870];
function eraserAt(p) {   // the eraser's zigzag over the tangle, p 0..1
  const row = Math.min(ERASE_ROWS - 1, Math.floor(p * ERASE_ROWS)), f = clamp(p * ERASE_ROWS - row);
  const x = row % 2 ? lerp(ERASE_X[1], ERASE_X[0], f) : lerp(ERASE_X[0], ERASE_X[1], f);
  return [x, ERASE_Y0 + ERASE_RH * (row + 0.5), row, f];
}
// one layer of the tangle: a looping pencil line (sums of sines; seeded shape, so only the tremor boils)
function tanglePts(L) {
  const S = RNG('tpts', L.key), f = [S.r(2.2, 4.8), S.r(5, 8.5), S.r(1.6, 4.2), S.r(4.5, 9)], p = [0, 1, 2, 3].map(() => S.r(0, TAU)), P = [];
  for (let i = 0; i <= L.n * 6; i++) {
    const u = i / (L.n * 6) * TAU;
    P.push([L.x + L.w / 2 * (0.62 * Math.sin(f[0] * u + p[0]) + 0.38 * Math.sin(f[1] * u + p[1])), L.y + L.h / 2 * (0.62 * Math.cos(f[2] * u + p[2]) + 0.38 * Math.sin(f[3] * u + p[3]))]);
  }
  return P;
}
function tangleLayers(a, scale) {
  ctx.save(); ctx.translate(THINK.x, THINK.y); ctx.scale(scale, scale); ctx.translate(-THINK.x, -THINK.y);
  for (const L of TANGLE) gpencil(tanglePts(L), { key: L.key, part: ev(L.t, 0.45), a: 0.85 * a, w: 2.9, amp: 1.6, step: 9 });
  ctx.restore();
}
function sceneThoughts() {
  const cu = TIMELINE.cues;
  sketchPage({ grid: 'dots' });
  pageLife('a');
  // the tangle: one layer written on per beat, pressing in at the peak; then rubbed out row by row
  const press = 1 + 0.05 * Math.sin(Math.PI * ev(cu.press, 0.5)) + 0.03 * ev(cu.tangle, 4);
  const ep = ev(cu.erase, cu.eraseEnd - cu.erase);
  if (TT >= cu.erase) tangleLayers(0.12, press);                         // the ghost an eraser always leaves
  ctx.save();
  if (ep > 0) {                                                           // clip out what the eraser has passed
    const [ex, , row, f] = eraserAt(ep);
    ctx.beginPath(); ctx.rect(-SK_M, -SK_M, W + 2 * SK_M, H + 2 * SK_M);
    for (let r = 0; r < row; r++) ctx.rect(ERASE_X[0] - 60, ERASE_Y0 + r * ERASE_RH, ERASE_X[1] - ERASE_X[0] + 120, ERASE_RH);
    const xa = row % 2 ? ex : ERASE_X[0] - 60, xb = row % 2 ? ERASE_X[1] + 60 : ex;
    if (ep >= 1) ctx.rect(ERASE_X[0] - 60, ERASE_Y0 + row * ERASE_RH, ERASE_X[1] - ERASE_X[0] + 120, ERASE_RH);
    else if (xb > xa) ctx.rect(xa, ERASE_Y0 + row * ERASE_RH, xb - xa, ERASE_RH);
    ctx.clip('evenodd');
  }
  if (TT < cu.eraseEnd + 0.1) tangleLayers(1, press);
  ctx.restore();
  // crumbs left behind the eraser (they stay on the page)
  if (ep > 0) {
    const S = RNG('crumbs');
    for (let i = 0; i < 70; i++) {
      const s = S.f(), dx = S.n(40), dy = 30 + S.f() * 40, rr = 3 + S.f() * 5, rot = S.f() * 3;
      if (s > ep) continue;
      const [x, y] = eraserAt(s);
      ctx.save(); ctx.fillStyle = i % 3 ? '#d9a7a4' : '#9a948b'; ctx.globalAlpha = 0.85;
      ctx.beginPath(); ctx.ellipse(x + dx, y + dy, rr, rr * 0.6, rot, 0, TAU); ctx.fill(); ctx.restore();
    }
  }
  // the seed loop: pencilled first, survives the eraser, then inked; the rings ripple out of it
  gpencil(loopPts(SEED.x, SEED.y, SEED.r, SEED.r, 0.12), { key: 'seed', w: 3, a: 0.9, part: ev(cu.seed, 0.6) });
  gline(loopPts(SEED.x, SEED.y, SEED.r, SEED.r, 0.08), { key: 'seedInk', w: 4.5, part: ev(cu.inkSeed, 0.35) });
  for (let i = 1; i <= RING_N; i++) {
    const r = ringR(i);
    gline(loopPts(RING_X + r, THINK.y, r, r, 0.06, Math.PI * 0.98), { key: 'ring' + i, w: 4 + 0.2 * i, part: ev(ringT(i), 0.3) });
  }
  // the eraser: in from the top right, a zigzag over the tangle, out again
  if (TT >= cu.eraser && TT < cu.eraseEnd + 0.4) {
    let p;
    if (TT < cu.erase) { const k = EZ.o2(ev(cu.eraser, cu.erase - cu.eraser)); p = [lerp(1180, ERASE_X[0], k), lerp(220, ERASE_Y0 + 52, k)]; }
    else if (TT < cu.eraseEnd) p = eraserAt(ep);
    else { const k = EZ.i2(ev(cu.eraseEnd, 0.4)); const e = eraserAt(1); p = [lerp(e[0], 1250, k), lerp(e[1], 1000, k)]; }
    eraserTool(p[0], p[1] - 30, -0.45 + 0.12 * Math.sin(B * 2.3), 0.95);
  }
  // the pencil: draws the seed, inks it, then runs round each ring as it ripples out
  let tip = null;
  if (TT >= cu.seed && TT < cu.seed + 0.75) tip = writeEnd(loopPts(SEED.x, SEED.y, SEED.r, SEED.r, 0.12), ev(cu.seed, 0.6));
  else if (TT >= cu.inkSeed - 0.15 && TT < cu.inkSeed + 0.4) tip = writeEnd(loopPts(SEED.x, SEED.y, SEED.r, SEED.r, 0.08), ev(cu.inkSeed, 0.35));
  else if (TT >= ringT(1) && TT < ringT(RING_N) + 0.5) {
    const i = Math.min(RING_N, 1 + Math.floor((TT - ringT(1)) / E8)), r = ringR(i);
    tip = writeEnd(loopPts(RING_X + r, THINK.y, r, r, 0.06, Math.PI * 0.98), ev(ringT(i), 0.3));
    if (TT >= ringT(RING_N) + 0.3) { const k = EZ.i2(ev(ringT(RING_N) + 0.3, 0.2)); tip = [lerp(tip[0], 1150, k), lerp(tip[1], 300, k)]; }
  }
  if (tip) pencilTool(tip[0], tip[1], -0.75 + 0.08 * Math.sin(B * 1.7), 1);
  // the hero: calm, then sinking under the tangle; watches the eraser; brightens with the rings
  const sink = TT < cu.erase ? ev(cu.tangle, cu.press + 0.5 - cu.tangle) : 1 - ev(cu.erase, 1.5);
  const sq = Math.sin(Math.PI * ev(cu.press, 0.5));
  const hop = Math.sin(Math.PI * ev(cu.bubble2, 0.25));
  const mood = TT < cu.tangle ? 'calm' : TT < cu.eraser ? 'puzzled' : TT < cu.bubble2 ? 'wow' : 'happy';
  const look = TT < cu.eraser ? [0.6, -1] : TT < cu.eraseEnd ? [0.9, -0.9] : [0.4, -1];
  hero({ mood, look, y: HERO.y + 26 * sink - 50 * hop, sx: 1 + 0.08 * sink + 0.06 * sq, sy: 1 - 0.1 * sink - 0.08 * sq + 0.06 * hop,
    arms: TT >= cu.bubble2 ? [0.6 + 0.6 * hop, 1.0 + 0.5 * ((B % 4) < 2 ? 1 : 0)] : [-0.9 - 0.3 * sink, -0.9 - 0.3 * sink] });
  if (TT >= cu.tangle + 2 && TT < cu.erase + 0.5) for (let i = 0; i < 2; i++) sweat(HERO.x - 82 - i * 16, HERO.y - 60 + i * 10, ((TT * 1.3 + i * 0.5) % 1), 'sw' + i);
  if (TT >= cu.inkSeed + 0.3 && TT < cu.bubble2 + 0.5) sparkle(SEED.x - 20, SEED.y - 70, 34, ev(cu.inkSeed + 0.3, 0.4), 'seedspk');
  // the bubble: the mean thought in graphite, crossed out, then the kind one in ink
  if (TT >= cu.bubble1 && TT < cu.bubble2) speechBubble(["I'm bad", 'at this'], { pen: 'pencil', reveal: ev(cu.bubble1, 0.5), strike: ev(cu.bubble2 - 0.5, 0.35), key: 'b1' });
  else if (TT >= cu.bubble2) speechBubble(["I'm", 'learning'], { pen: 'ink', reveal: ev(cu.bubble2 + 0.05, 0.4), pop: popS(cu.bubble2), key: 'b2' });
  pageTag('thoughts');
  if (TT >= cu.cap1 && TT < cu.eraser) pageCaption(['nothing can hurt you', 'like your thoughts'], [[0, 'hurt']], { at: cu.cap1 });
  if (TT >= cu.cap2) pageCaption(['nothing can heal you', 'like your thoughts'], [[0, 'heal']], { at: cu.cap2 });
}
