// =====================================================================
//  ERAS, CAMERAS, BRIDGES — your thoughts (read by kit/morph.js). One page throughout; the camera leans in and back.
// =====================================================================
const ERA_BG = ['#f2ead8', '#f2ead8'];
function pieceCam(era, t) {
  const cu = TIMELINE.cues;
  if (era === 0) {
    if (t < 7) return push(t, 3.5, cu.press, { z: 1.1, p: [THINK.x, THINK.y], to: [THINK.x, THINK.y + 20] }, cu.erase, cu.erase + 0.6);   // lean in on the tangle, back for the eraser
    return push(t, 10.9, 12.3, { z: 1.12, p: [THINK.x, THINK.y], to: [THINK.x, THINK.y + 20] });                                     // close in on the rings
  }
  const lean = camOf({ z: 1.08 + 0.07 * (t >= cu.payoff ? Math.exp(-(t - cu.payoff) * 5) : 0), p: [THINK.x, THINK.y], to: [THINK.x, THINK.y + 20] });
  return camMix(lean, CAM0, EZ.io(seg(t, cu.pull, cu.pull + 1.0)));                                                                  // then pull back to the opening frame
}
const BRIDGES = [
  // the outermost ring -> the beginner's one circle
  { tc: 13.0, d: 0.6, A: () => ({ P: ellipsePts(RING_X + ringR(RING_N), THINK.y, ringR(RING_N), ringR(RING_N), 0, 64), c: SK.graphL }), B: () => ({ P: ellipsePts(...petalC(0), PETAL_R, PETAL_R, 0, 64), c: SK.graphL }) },
];
