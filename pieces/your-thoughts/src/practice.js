// =====================================================================
//  ERA 1: practice (one beginner's circle -> day after day -> silence -> every circle inks: a flower -> the return)
// =====================================================================
const PETAL_N = PETAL_T.length, PETAL_R = 150, PETAL_OFF = 105;
const petalC = (k) => { const a = Math.PI + k * TAU / PETAL_N; return [THINK.x + PETAL_OFF * Math.cos(a), THINK.y + PETAL_OFF * Math.sin(a)]; };
const petalPts = (k, over = 0.05) => { const [x, y] = petalC(k); return loopPts(x, y, PETAL_R, PETAL_R, over, Math.PI + k * TAU / PETAL_N + 0.4); };
const petalNow = () => { let k = -1; for (let i = 0; i < PETAL_N; i++) if (TT >= PETAL_T[i] - 1e-6) k = i; return k; };

// the day counter: a marker label on tape, top left (where the era's tag lives)
function dayTagDraw(n) {
  const str = 'day ' + n, size = 70, w = letterW('day 365', size, 'marker'), x = 84, y = 340;
  tapeStrip(x + w / 2, y - size * 0.3, w + 70, -0.03, 'daytape', size * 1.15);
  handLetter(str, x, y, size, { face: 'marker', align: 'left', key: 'day' + n, jit: 0.7 });
}
const dayTag = (n) => { const f = () => dayTagDraw(n); if (DEFER) DEFER.push(f); else f(); };
// the closing line's red underline, under one word of a caption line (same layout as pageCaption)
function captionUnderline(line, li, word, part, o = {}) {
  const f = () => {
    const size = o.size ?? 80, y = (o.y ?? 1330) + li * size * 1.12, xs = glyphX(line, skFont(size, 'hand')), x0 = CX - xs[xs.length - 1] / 2, k = line.indexOf(word);
    underline(x0 + xs[k], x0 + xs[k + word.length], y + 22, { col: SK.red, w: 6, key: 'capul', part });
  };
  if (DEFER) DEFER.push(f); else f();
}

function scenePractice() {
  const cu = TIMELINE.cues, k = petalNow(), done = TT >= cu.payoff;
  sketchPage({ grid: 'dots' });
  pageLife('b');
  // birds crossing the top margin now and then
  if (TT > 15 && TT < 19) for (let i = 0; i < 3; i++) doodleBird(1120 - 150 * (TT - 15) + i * 60, 270 + i * 22 - (i % 2) * 12, 1.1 - i * 0.15, (B + i) % 2, 'bird' + i);
  if (TT > 26 && TT < 30.5) for (let i = 0; i < 2; i++) doodleBird(1120 - 140 * (TT - 26) + i * 70, 262 + i * 26, 1.0 - i * 0.15, (B + i) % 2, 'birdb' + i);
  // the flower's heart: at the payoff, a highlighter dot lights where every circle crosses
  if (done) {
    const hk = ev(cu.payoff, 0.25);
    scribbleFill(loopPts(THINK.x, THINK.y, 34, 34, 0, 0, 28), SK.hilite, { key: 'heart', part: hk, gap: 9, w: 4, base: 0.5 });
    gline(loopPts(THINK.x, THINK.y, 34, 34, 0.08), { key: 'heartO', w: 4, part: hk });
  }
  // the circles: the one being drawn today is ink; the days before are graphite; at the payoff all ink at once
  for (let i = 0; i <= k; i++) {
    const P = petalPts(i);
    if (done) gline(P, { key: 'pi' + i, w: 4.6, amp: 1.4 });
    else if (i === k) gline(P, { key: 'pi' + i, w: 5, part: ev(PETAL_T[i], PETAL_D[i]) });
    else gpencil(P, { key: 'pp' + i, w: 2.8, a: 0.8, amp: 1.8 });
  }
  if (done) for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.5; sparkle(THINK.x + Math.cos(a) * 300, THINK.y + Math.sin(a) * 300, 44, ev(cu.payoff + 0.04 * i, 0.6), 'pspk' + i); }
  // the pencil: runs round today's circle, waits poised between days, holds still in the silence, then leaves
  let tip = null;
  if (k >= 0 && TT < cu.payoff + 0.3) {
    const t0 = PETAL_T[k], d = PETAL_D[k];
    if (TT < t0 + d) tip = writeEnd(petalPts(k), ev(t0, d));
    else if (k < PETAL_N - 1) { const nx = petalPts(k + 1)[0], e = writeEnd(petalPts(k), 1), u = EZ.io(seg(TT, t0 + d, PETAL_T[k + 1])); tip = [lerp(e[0], nx[0], u), lerp(e[1], nx[1], u) - 30 * Math.sin(Math.PI * u)]; }
    else { const e = writeEnd(petalPts(k), 1), u = EZ.i2(ev(cu.payoff, 0.3)); tip = [lerp(e[0], 1180, u), lerp(e[1], 240, u)]; }
  }
  if (tip) pencilTool(tip[0], tip[1], -0.75 + 0.06 * Math.sin(B * 1.7), 1);
  // the hero: hops as each slow day starts, bobs through the fast ones, holds its breath, then cheers
  let hop = 0;
  for (let i = 1; i < 7; i++) hop = Math.max(hop, Math.sin(Math.PI * ev(PETAL_T[i], 0.25)));
  const cheer = Math.max(Math.sin(Math.PI * ev(cu.payoff, 0.3)), Math.sin(Math.PI * ev(cu.payoff + 0.5, 0.25)));
  const fast = TT >= 18.5 && TT < 21.0, still = TT >= 21.0 && TT < cu.payoff;
  const mood = still ? 'wow' : done ? 'happy' : TT < 18.5 ? 'calm' : 'happy';
  const look = tip && !done ? [clamp((tip[0] - HERO.x) / 300, -1, 1), -1] : [0.3, -1];
  const wave = 1.0 + 0.5 * ((B % 4) < 2 ? 1 : -1);
  hero({ mood, look, y: HERO.y - 44 * hop - 70 * cheer - (fast ? 10 * ((B % 2)) : 0), bob: still ? 0 : undefined,
    sx: 1 - 0.04 * (hop + cheer), sy: 1 + 0.07 * (hop + cheer),
    arms: done ? [1.3 + 0.2 * cheer, TT >= cu.cap5 ? wave : 1.3 + 0.2 * cheer] : still ? [0.2, 0.2] : [-0.7, -0.7] });
  if (cheer > 0) for (let i = 0; i < 2; i++) gline([[HERO.x - 60 + i * 120, GROUND - 6], [HERO.x - 72 + i * 144, GROUND + 6]], { w: 3, key: 'dust' + i, second: false, a: cheer });
  if (TT >= cu.pull + 0.5) speechBubble(["I'm", 'learning'], { pen: 'ink', reveal: ev(cu.pull + 0.5, 0.4), pop: popS(cu.pull + 0.5), key: 'b3' });
  // the lettering
  if (k >= 0 && TT < cu.pull + 0.5) dayTag(PETAL_DAY[k]);
  else if (TT >= cu.pull + 0.5) pageTag('thoughts');
  const at = (t) => t - ERA_LIST[1][0];
  if (TT >= cu.cap3 && TT < 21.0) pageCaption(['if you enjoy', 'being a beginner'], [[1, 'beginner']], { at: at(cu.cap3) });
  if (TT >= cu.cap4 && TT < cu.cap5) pageCaption(['you become a', 'master by accident'], [[1, 'master']], { at: at(cu.cap4) });
  if (TT >= cu.cap5 && TT < cu.cap6) pageCaption(['change how you', 'talk to yourself'], [[1, 'talk']], { at: at(cu.cap5) });
  if (TT >= cu.cap6) {
    pageCaption(["what you don't change", 'you are choosing'], [[1, 'choosing']], { at: at(cu.cap6) });
    captionUnderline('you are choosing', 1, 'choosing', ev(cu.sign, 0.3));
  }
}
