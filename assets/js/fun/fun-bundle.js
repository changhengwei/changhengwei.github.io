// fun.ts
var RISO = { main: "#ff58a8", gold: "#ffe14a", tint: "#ffd4e8", ok: "#15b9a6", hot: "#ff7a1a", deep: "#2b50e0", white: "#ffffff", grey: "#cccccc", paper: "#f7f7f7", ink: "#000000" };
var PALETTES = {
  riso: RISO,
  candy: { ...RISO, main: "#b49bff", gold: "#ffd9a8", tint: "#ece5ff", ok: "#7fdcc0", hot: "#ff8fb1", deep: "#6a5cff" },
  matcha: { ...RISO, main: "#6cc46f", gold: "#f2d16b", tint: "#e2f4d6", ok: "#2bb39a", hot: "#ff8a5b", deep: "#1f6b55" },
  sunset: { ...RISO, main: "#ff7a3d", gold: "#ffc94a", tint: "#ffe2d1", ok: "#2ec4b6", hot: "#ff4d6d", deep: "#6b2d91" },
  clay: { ...RISO, main: "#f0845f", gold: "#f4c463", tint: "#fde3d6", ok: "#7fb894", hot: "#e0533d", deep: "#3d5a80" },
  aqua: { ...RISO, main: "#22c3d3", gold: "#ffd75e", tint: "#d3f4f7", ok: "#3fc46a", hot: "#ff6f61", deep: "#0f5f73" }
};
var VIEWS = {
  right: { tilt: [-18, 36], extrude: [-4, 18] },
  left: { tilt: [18, 36], extrude: [4, 18] },
  front: { tilt: [0, 30], extrude: [0, 18] },
  flat: { tilt: [-45, 55], extrude: [0, 20] }
};
var FPS = 60;
var curves = /* @__PURE__ */ new Map();
function bezier(x1, y1, x2, y2) {
  const key = `${x1},${y1},${x2},${y2}`;
  const hit = curves.get(key);
  if (hit) return hit;
  const [ax, bx, cx] = [1 + 3 * x1 - 3 * x2, 3 * x2 - 6 * x1, 3 * x1];
  const [ay, by, cy] = [1 + 3 * y1 - 3 * y2, 3 * y2 - 6 * y1, 3 * y1];
  const sx = (s) => ((ax * s + bx) * s + cx) * s;
  const sy = (s) => ((ay * s + by) * s + cy) * s;
  const dx = (s) => (3 * ax * s + 2 * bx) * s + cx;
  const fn = (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    if (x1 === y1 && x2 === y2) return x;
    let s = x;
    for (let i = 0; i < 8; i++) {
      const [e, d] = [sx(s) - x, dx(s)];
      if (Math.abs(e) < 1e-7) return sy(s);
      if (Math.abs(d) < 1e-6) break;
      s -= e / d;
    }
    let [lo, hi] = [0, 1];
    s = x;
    for (let i = 0; i < 40 && Math.abs(sx(s) - x) > 1e-7; i++) {
      if (sx(s) < x) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return sy(s);
  };
  curves.set(key, fn);
  return fn;
}
var parsed = /* @__PURE__ */ new Map();
var NUM = /-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/gi;
function parse(d) {
  var _a;
  let hit = parsed.get(d);
  if (!hit) {
    const nums = ((_a = d.match(NUM)) != null ? _a : []).map(Number);
    hit = [d.split(NUM), nums];
    if (parsed.size > 4e3) parsed.clear();
    parsed.set(d, hit);
  }
  return hit;
}
function mix(a, b, y) {
  var _a;
  if (typeof a === "number") return a + (b - a) * y;
  if (typeof a === "string") {
    if (y === 0 || a === b) return a;
    const [bits, na] = parse(a);
    const nb = parse(b)[1];
    let out = bits[0];
    for (let i = 0; i < na.length; i++) out += +(na[i] + (((_a = nb[i]) != null ? _a : na[i]) - na[i]) * y).toFixed(3) + bits[i + 1];
    return out;
  }
  const [va, vb] = [a, b];
  return [va[0] + (vb[0] - va[0]) * y, va[1] + (vb[1] - va[1]) * y];
}
var isTrack = (v) => Array.isArray(v) && Array.isArray(v[0]);
var arcs = /* @__PURE__ */ new WeakMap();
function along(key, a, b, y) {
  let hit = arcs.get(key);
  if (!hit) {
    const [to, ti] = key[3];
    const [c1, c2] = [[a[0] + to[0], a[1] + to[1]], [b[0] + ti[0], b[1] + ti[1]]];
    const pts2 = [];
    const lens2 = [0];
    for (let i2 = 0; i2 <= 150; i2++) {
      const s = i2 / 150;
      const u = 1 - s;
      const [w0, w1, w2, w3] = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s];
      pts2.push([w0 * a[0] + w1 * c1[0] + w2 * c2[0] + w3 * b[0], w0 * a[1] + w1 * c1[1] + w2 * c2[1] + w3 * b[1]]);
      if (i2) lens2.push(lens2[i2 - 1] + Math.hypot(pts2[i2][0] - pts2[i2 - 1][0], pts2[i2][1] - pts2[i2 - 1][1]));
    }
    hit = { pts: pts2, lens: lens2 };
    arcs.set(key, hit);
  }
  const { pts, lens } = hit;
  const goal = lens[150] * y;
  if (goal <= 0) return pts[0];
  if (goal >= lens[150]) return pts[150];
  let i = 1;
  while (lens[i] < goal) i++;
  const k = (goal - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
}
function at(v, f) {
  if (!isTrack(v)) return v;
  if (f <= v[0][0]) return v[0][1];
  for (let i = 0; i < v.length - 1; i++) {
    const [t0, a, e, bend] = v[i];
    const [t1, b] = v[i + 1];
    if (f >= t1) continue;
    if (e === 0) return a;
    const x = (f - t0) / (t1 - t0);
    const y = e ? bezier(e[0], e[1], e[2], e[3])(x) : x;
    return bend ? along(v[i], a, b, y) : mix(a, b, y);
  }
  return v[v.length - 1][1];
}
var mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5]
];
var mod = (a, n) => (a % n + n) % n;
var r2 = (v) => +v.toFixed(2);
var pt = (p) => `${r2(p[0])} ${r2(p[1])}`;
var lean = ([spin, by]) => {
  const [a, k] = [spin * Math.PI / 180, Math.cos(by * Math.PI / 180)];
  return [Math.cos(a), Math.sin(a) * k, -Math.sin(a), Math.cos(a) * k, 0, 0];
};
function poseOf(L, f, frames) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  let [p, r, s, o, x] = [at((_a = L.p) != null ? _a : [0, 0], f), at((_b = L.r) != null ? _b : 0, f), at((_c = L.s) != null ? _c : [100, 100], f), at((_d = L.o) != null ? _d : 100, f), 0];
  const list = L.m ? Array.isArray(L.m) ? L.m : [L.m] : [];
  for (const m2 of list) {
    const g = mod(f - ((_e = m2.at) != null ? _e : 0), (_f = m2.loop) != null ? _f : frames);
    const k2 = (_g = m2.k) != null ? _g : 1;
    if (m2.r) r += at(m2.r, g) * k2;
    if (m2.p) {
      const d = at(m2.p, g);
      p = [p[0] + d[0] * k2, p[1] + d[1] * k2];
    }
    if (m2.s) {
      const d = at(m2.s, g);
      s = [s[0] * (100 + (d[0] - 100) * k2) / 100, s[1] * (100 + (d[1] - 100) * k2) / 100];
    }
    if (m2.o) o *= at(m2.o, g) / 100;
    if (m2.x) x += at(m2.x, g) * k2;
  }
  const [a, rad] = [(_h = L.a) != null ? _h : [0, 0], r * Math.PI / 180];
  const [cos, sin, sx, sy] = [Math.cos(rad), Math.sin(rad), s[0] / 100, s[1] / 100];
  let m = [cos * sx, sin * sx, -sin * sy, cos * sy, 0, 0];
  const k = L.tilt ? Math.cos(L.tilt[1] * Math.PI / 180) : 1;
  if (L.tilt) m = mul(m, lean(L.tilt));
  m[4] = p[0] - (m[0] * a[0] + m[2] * a[1]);
  m[5] = p[1] - (m[1] * a[0] + m[3] * a[1]);
  return { m, o, x, k };
}
var paths = /* @__PURE__ */ new Map();
var pathOf = (d) => {
  let hit = paths.get(d);
  if (!hit) {
    if (paths.size > 4e3) paths.clear();
    hit = new Path2D(d);
    paths.set(d, hit);
  }
  return hit;
};
var samples = /* @__PURE__ */ new Map();
function lengthOf(d, m) {
  let pts = samples.get(d);
  if (!pts) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("d", d);
    const l = el.getTotalLength();
    pts = Array.from({ length: 65 }, (_, i) => {
      const q = el.getPointAtLength(l * i / 64);
      return [q.x, q.y];
    });
    if (samples.size > 4e3) samples.clear();
    samples.set(d, pts);
  }
  let sum = 0;
  for (let i = 1; i < pts.length; i++) {
    const [dx, dy] = [pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]];
    sum += Math.hypot(m[0] * dx + m[2] * dy, m[1] * dx + m[3] * dy);
  }
  return sum;
}
function scene(icon, frame) {
  var _a;
  const f = mod(frame, icon.frames);
  const byId = new Map(icon.layers.filter((l) => l.id).map((l) => [l.id, l]));
  const memo = /* @__PURE__ */ new Map();
  const world = (L) => {
    let hit = memo.get(L);
    if (!hit) {
      hit = poseOf(L, f, icon.frames);
      const up = L.parent ? byId.get(L.parent) : void 0;
      if (up) hit = { ...hit, m: mul(world(up).m, hit.m), k: world(up).k * hit.k };
      memo.set(L, hit);
    }
    return hit;
  };
  const parts = [];
  for (const L of icon.layers) {
    if (L.ip !== void 0 && f < L.ip || L.op !== void 0 && f >= L.op || !L.shapes.length) continue;
    const p = world(L);
    if (p.o > 0) parts.push({ L, pose: p, ds: L.shapes.map((S) => at(S.d, f)), trims: L.shapes.map((S) => S.trim === void 0 ? 1 : at(S.trim, f)) });
  }
  return { f, ext: at((_a = icon.extrude) != null ? _a : [-4, 14], f), parts, world, byId };
}
function fingerprint({ ext, parts }) {
  let out = `${ext[0].toFixed(2)},${ext[1].toFixed(2)}`;
  for (const { L, pose, ds, trims } of parts) {
    out += `|${pose.m.map((v) => v.toFixed(2)).join()},${pose.o.toFixed(1)},${pose.x.toFixed(2)}`;
    L.shapes.forEach((S, i) => typeof S.d !== "string" && (out += `;${ds[i]}`));
    L.shapes.forEach((S, i) => S.trim !== void 0 && (out += `;${trims[i].toFixed(3)}`));
  }
  return out;
}
function render(ctx, icon, sc, palette) {
  var _a, _b;
  const base = ctx.getTransform();
  const colour = (c) => c[0] === "#" ? c : palette[c];
  const [W, ink, { ext, world, byId, f }] = [(_a = icon.line) != null ? _a : 4, colour((_b = icon.ink) != null ? _b : "ink"), sc];
  const len = Math.hypot(ext[0], ext[1]) || 1;
  const dev = Math.sqrt(Math.abs(base.a * base.d - base.b * base.c)) || 1;
  const step = new DOMMatrix();
  ctx.save();
  ctx.miterLimit = 4;
  for (const { L, pose, ds, trims } of sc.parts) {
    const { m, o, x, k } = pose;
    const [det, dm] = [m[0] * m[3] - m[1] * m[2], new DOMMatrix(m)];
    const grow = Math.sqrt(Math.abs(det) / Math.abs(k || 1));
    ctx.globalAlpha = Math.min(1, o / 100);
    const mask = L.clip ? byId.get(L.clip) : void 0;
    if (mask) {
      ctx.save();
      const region = new Path2D();
      const mm = new DOMMatrix(world(mask).m);
      for (const s of mask.shapes) region.addPath(pathOf(at(s.d, f)), mm);
      ctx.setTransform(base);
      ctx.clip(region);
    }
    L.shapes.forEach((S, i) => {
      var _a2, _b2, _c;
      const d = ds[i];
      const path = new Path2D();
      path.addPath(pathOf(d), dm);
      const w = (S.line === false ? 0 : typeof S.line === "number" ? S.line : W) * grow;
      ctx.setTransform(base);
      ctx.lineCap = S.round ? "round" : "butt";
      ctx.lineJoin = S.round ? "round" : "miter";
      const depth = (_a2 = S.depth) != null ? _a2 : 0;
      if (depth && S.fill) {
        const kk = depth + x / len;
        const [vx, vy] = [ext[0] * kk, ext[1] * kk];
        const n = Math.min(64, Math.max(2, Math.ceil(Math.hypot(vx, vy) * dev / 0.8)));
        const sweep = new Path2D();
        for (let j = n; j >= 0; j--) step.e = vx * j / n, step.f = vy * j / n, sweep.addPath(path, step);
        if (w) {
          ctx.strokeStyle = ink;
          ctx.lineWidth = w * 2;
          ctx.stroke(sweep);
        }
        ctx.fillStyle = colour((_b2 = S.side) != null ? _b2 : S.fill);
        ctx.fill(sweep);
        const auto = S.crease === false ? void 0 : corners.get(d);
        if (w && (S.edges || auto)) {
          const vl = Math.hypot(vx, vy) || 1;
          const lines = [...(_c = S.edges) != null ? _c : []];
          const faces = (nx, ny) => {
            const [wx, wy] = [(m[3] * nx - m[1] * ny) * Math.sign(det), (m[0] * ny - m[2] * nx) * Math.sign(det)];
            return (wx * vx + wy * vy) / (Math.hypot(wx, wy) * vl) > 0.05;
          };
          for (const [cx, cy, ax, ay, bx, by] of auto != null ? auto : []) if (faces(ax, ay) && faces(bx, by)) lines.push([cx, cy]);
          ctx.strokeStyle = ink;
          ctx.lineWidth = w;
          ctx.beginPath();
          for (const [ex, ey] of lines) {
            const [px, py] = [m[0] * ex + m[2] * ey + m[4], m[1] * ex + m[3] * ey + m[5]];
            ctx.moveTo(px, py);
            ctx.lineTo(px + vx, py + vy);
          }
          ctx.stroke();
        }
      }
      if (S.fill) {
        if (w) {
          ctx.strokeStyle = ink;
          ctx.lineWidth = w * 2;
          ctx.stroke(path);
        }
        ctx.fillStyle = colour(S.fill);
        ctx.fill(path);
      } else if (w && trims[i] > 0) {
        ctx.strokeStyle = ink;
        ctx.lineWidth = w;
        if (trims[i] < 1) {
          const l = lengthOf(d, m);
          ctx.setLineDash([l * trims[i], l]);
        }
        ctx.stroke(path);
        ctx.setLineDash([]);
      }
    });
    if (mask) ctx.restore();
  }
  ctx.restore();
}
var themed = /* @__PURE__ */ new Map();
var resolve = (p) => {
  if (!p) return RISO;
  const key = JSON.stringify(p);
  let hit = themed.get(key);
  if (!hit) {
    if (themed.size > 200) themed.clear();
    hit = { ...RISO, ...p };
    themed.set(key, hit);
  }
  return hit;
};
var rect = (x, y, w, h, r = 0) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], r);
var corners = /* @__PURE__ */ new Map();
function poly(points, r = 0) {
  var _a;
  const n = points.length;
  let d = "";
  let area = 0;
  for (let i = 0; i < n; i++) area += points[i][0] * points[(i + 1) % n][1] - points[(i + 1) % n][0] * points[i][1];
  const marks = [];
  for (let i = 0; i < n; i++) {
    const [P, A, B] = [points[i], points[(i + n - 1) % n], points[(i + 1) % n]];
    const rad = typeof r === "number" ? r : (_a = r[i]) != null ? _a : 0;
    const [ua, ub] = [[A[0] - P[0], A[1] - P[1]], [B[0] - P[0], B[1] - P[1]]];
    const [la, lb] = [Math.hypot(ua[0], ua[1]), Math.hypot(ub[0], ub[1])];
    const cos = (ua[0] * ub[0] + ua[1] * ub[1]) / (la * lb);
    const half = Math.acos(Math.max(-1, Math.min(1, cos))) / 2;
    let t = rad && half > 1e-3 ? rad / Math.tan(half) : 0;
    t = Math.min(t, la / 2, lb / 2);
    const rr = t * Math.tan(half);
    const T1 = [P[0] + ua[0] / la * t, P[1] + ua[1] / la * t];
    const T2 = [P[0] + ub[0] / lb * t, P[1] + ub[1] / lb * t];
    const cross = ua[0] * ub[1] - ua[1] * ub[0];
    const sweep = cross < 0 ? 1 : 0;
    d += `${i ? "L" : "M"}${pt(T1)}A${r2(rr)} ${r2(rr)} 0 0 ${sweep} ${pt(T2)}`;
    const round = rad > 0 && t >= Math.min(la, lb) / 2 - 1e-6;
    if (Math.sign(cross) === -Math.sign(area) && !round) {
      let [bx, by] = [ua[0] / la + ub[0] / lb, ua[1] / la + ub[1] / lb];
      const bl = Math.hypot(bx, by) || 1;
      [bx, by] = [bx / bl, by / bl];
      const k = half > 1e-3 ? rr / Math.sin(half) - rr : 0;
      const out = (u, l) => {
        const [nx, ny] = [-u[1] / l, u[0] / l];
        return nx * bx + ny * by > 0 ? [-nx, -ny] : [nx, ny];
      };
      const [na, nb] = [out(ua, la), out(ub, lb)];
      marks.push([P[0] + bx * k, P[1] + by * k, na[0], na[1], nb[0], nb[1]]);
    }
  }
  d += "Z";
  if (corners.size > 4e3) corners.clear();
  corners.set(d, marks);
  return d;
}
var line = (...points) => points.map((p, i) => `${i ? "L" : "M"}${pt(p)}`).join("");
var clock = { frame: 0, speed: 1, paused: false };
var BOUNCE = [
  [0, 0],
  [0.076, 0.5737],
  [0.1187, 0.8382],
  [0.1419, 0.9463],
  [0.1654, 1.0292],
  [0.1897, 1.0886],
  [0.2153, 1.1258],
  [0.2297, 1.137],
  [0.2448, 1.1424],
  [0.261, 1.1423],
  [0.2786, 1.1366],
  [0.3101, 1.1165],
  [0.3862, 1.0507],
  [0.4257, 1.0219],
  [0.4699, 0.9995],
  [0.5163, 0.9872],
  [0.5877, 0.9842],
  [0.8126, 1.0011],
  [1, 1]
];
function popBounce(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const i = BOUNCE.findIndex(([x]) => x >= t);
  const [[x0, y0], [x1, y1]] = [BOUNCE[i - 1], BOUNCE[i]];
  return y0 + (y1 - y0) * (t - x0) / (x1 - x0);
}
function present(canvas, icon, sc, e, palette, css) {
  var _a;
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  const px = Math.max(1, Math.round(css * dpr));
  if (canvas.width !== px || canvas.height !== px) canvas.width = canvas.height = px;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const size = (_a = icon.size) != null ? _a : 500;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, px, px);
  const b = popBounce(e);
  if (b <= 0) return;
  ctx.globalAlpha = Math.min(1, b);
  ctx.translate(px / 2, px / 2);
  ctx.rotate(-90 * (1 - b) * Math.PI / 180);
  ctx.scale(0.2 + 0.8 * b, 0.2 + 0.8 * b);
  ctx.translate(-px / 2, -px / 2);
  ctx.scale(px / size, px / size);
  render(ctx, icon, sc, palette);
}
var live = /* @__PURE__ */ new Set();
var [raf, last] = [0, 0];
var reduce;
var still = () => {
  if (reduce === void 0) reduce = typeof matchMedia === "undefined" ? null : matchMedia("(prefers-reduced-motion: reduce)");
  return !!(reduce == null ? void 0 : reduce.matches);
};
function frameOf({ icon, o, start: start2 }) {
  var _a, _b, _c;
  if (still()) return (_a = icon.still) != null ? _a : 0;
  const t = clock.frame - (start2 != null ? start2 : 0) + ((_b = o.offset) != null ? _b : 0);
  if (o.loop !== false) return t;
  return t < (icon.still || icon.frames) ? t : (_c = icon.still) != null ? _c : 0;
}
function tick(now) {
  const dt = last ? Math.min(100, now - last) : 0;
  last = now;
  if (!clock.paused) clock.frame += dt / 1e3 * FPS * clock.speed;
  for (const l of live) {
    if (!l.shown) continue;
    try {
      if (!l.seen) l.seen = now;
      if (l.o.loop === false && l.start === void 0) l.start = clock.frame;
      const e = l.o.enter === void 0 || still() ? 1 : (now - l.seen - l.o.enter * 1e3) / 1e3;
      const [sc, css] = [scene(l.icon, frameOf(l)), l.css || l.canvas.clientWidth];
      const key = e < 1 ? "" : `${css}|${window.devicePixelRatio}|${fingerprint(sc)}`;
      if (key && key === l.key) continue;
      present(l.canvas, l.icon, sc, e, l.pal, css);
      l.key = key;
    } catch (err) {
      console.error(`fun-isometric: ${l.icon.name} stopped`, err);
      l.stop();
    }
  }
  raf = live.size ? requestAnimationFrame(tick) : 0;
}
function play(canvas, icon, opts = {}) {
  const io = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([en]) => l.shown = en.isIntersecting);
  const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(([en]) => l.css = en.contentRect.width);
  const stop = () => {
    io == null ? void 0 : io.disconnect();
    ro == null ? void 0 : ro.disconnect();
    live.delete(l);
  };
  const l = { canvas, icon, o: { ...opts }, pal: resolve(opts.palette), seen: 0, shown: !io, css: 0, key: "", stop };
  io == null ? void 0 : io.observe(canvas);
  ro == null ? void 0 : ro.observe(canvas);
  live.add(l);
  if (!raf) last = 0, raf = requestAnimationFrame(tick);
  return {
    stop,
    replay: () => (l.start = clock.frame, l.key = ""),
    set: ({ icon: next, ...o }) => {
      if (next) l.icon = next;
      Object.assign(l.o, o);
      l.pal = resolve(l.o.palette);
      l.key = "";
    }
  };
}

// motions.ts
var SNAP = [0.8, 0, 0.2, 1];
var SPRING = [
  [0.17, 0.17, 0.55, 1],
  [0.35, 0, 0.62, 1],
  [0.31, 0, 0.67, 1],
  [0.31, 0, 0.64, 1],
  [0.3, 0, 0.64, 1],
  [0.24, 0, 0.57, 1]
];
var REACH = [1.448, 0.778, 1.11, 0.95, 1.012, 1];
var GAPS = [13, 16, 16, 15, 15, 16];
function spring(to, start2 = 0, pace = 1, from = [0, 0]) {
  let t = start2;
  const keys = [[t, from, SPRING[0]]];
  REACH.forEach((k, i) => {
    var _a;
    t += Math.round(GAPS[i] * pace);
    keys.push([t, [from[0] + (to[0] - from[0]) * k, from[1] + (to[1] - from[1]) * k], (_a = SPRING[i + 1]) != null ? _a : 0]);
  });
  return keys;
}
function springTurn(to, start2 = 0, pace = 1, from = 0) {
  return spring([to, 0], start2, pace, [from, 0]).map(([t, v, e]) => [t, v[0], e]);
}
var jolt = (v = [-7.86, 13.25]) => ({ p: [...spring(v, 2), [98, v, [0.65, 0, 0.35, 1]], [141, [0, 0]]] });
var slide = (to, start2, hold = 60, len = 60) => ({
  p: [[start2, [0, 0], SNAP], [start2 + len, to, 0], [start2 + len + hold, to, SNAP], [start2 + len * 2 + hold, [0, 0]]]
});

// mailbox.ts
var LINE = 5;
var BOX = VIEWS.left.tilt;
var EXT = VIEWS.left.extrude;
var mailbox = {
  name: "mailbox",
  frames: 180,
  line: LINE,
  extrude: EXT,
  layers: [
    // Whole mailbox (post and box) jolts on landing.
    { id: "mail", a: [0, 150], p: [250, 392], m: jolt([-4, 10]), shapes: [] },
    // The post under the box.
    { parent: "mail", tilt: BOX, shapes: [{ d: rect(-18, 40, 36, 150, 6), fill: "grey", depth: 0.8 }] },
    // Letter slides out of the door, then back in.
    {
      parent: "box",
      a: [70, 0],
      p: [70, 0],
      m: slide([56, 0], 24, 72, 40),
      shapes: [{ d: rect(30, -40, 96, 62, 6), fill: "white", depth: 0.25 }, { d: line([44, -24], [78, -6], [112, -24]) }]
    },
    // Box body: a back slab and the front face.
    {
      id: "box",
      parent: "mail",
      tilt: BOX,
      shapes: [
        { d: poly([[-136, -96], [136, -96], [136, 56], [-136, 56]], [72, 72, 10, 10]), fill: "deep", depth: 1 },
        { d: poly([[96, -96], [136, -96], [136, 56], [96, 56]], [0, 72, 10, 0]), fill: "main", depth: 1 }
      ]
    },
    // Flag springs up when the post lands, then settles.
    {
      parent: "box",
      a: [-60, -10],
      p: [-60, -10],
      r: 84,
      m: { r: [...springTurn(-84, 18), [128, -84, SNAP], [168, 0]] },
      shapes: [{ d: rect(-68, -130, 16, 124, 4), fill: "grey", depth: 0.5 }, { d: rect(-68, -130, 70, 44, 6), fill: "hot", depth: 0.5 }]
    }
  ]
};

// main.ts
function start() {
  const canvas = document.getElementById("mailbox-canvas");
  if (!canvas) return;
  play(canvas, mailbox, { palette: PALETTES.candy, loop: true, enter: 0.3 });
}
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start);
} else {
  start();
}
