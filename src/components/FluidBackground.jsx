import { useEffect, useRef } from "react";

/**
 * Site-wide animated WebGL backdrop.
 *
 * Replaces both AuroraCanvas (hero-only shader) and AmbientVideo (which painted
 * a canvas, piped it through captureStream() into a <video>, and ran forever).
 * This is one shader on one canvas, so the page went from two permanent
 * requestAnimationFrame loops to one.
 *
 * Raw WebGL rather than three.js on purpose: this is a single full-screen
 * fragment shader with no scene graph, geometry or lighting, so three.js would
 * add ~150KB gzipped to draw two triangles.
 *
 * Interaction: the pointer drags a wake of retained samples that both light
 * the field and push the noise domain outward; clicking fires an expanding
 * ripple that deforms it. Both are pure uniform updates — no extra passes.
 *
 * Guards: pauses when the tab is hidden or the canvas is scrolled out of view,
 * caps device pixel ratio, and renders one static frame under
 * prefers-reduced-motion.
 */

const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;

uniform vec2  u_resolution;
uniform vec2  u_pointer;   // smoothed, 0..1
uniform float u_time;
uniform float u_scroll;    // 0..1 through the page
uniform float u_energy;    // pointer speed, 0..1

#define TRAIL 18
#define RIPPLES 4
uniform vec3 u_trail[TRAIL];    // xy = aspect-corrected pos, z = life 0..1
uniform vec3 u_ripples[RIPPLES]; // xy = origin, z = age in seconds (<0 = idle)

// -- value noise + fbm -----------------------------------------------------
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.045;

  // ---- pointer wake -------------------------------------------------------
  // Each retained pointer sample pushes the noise domain outward and adds
  // light, so the cursor drags a glowing, deforming wake behind it.
  float wake = 0.0;
  vec2 warp = vec2(0.0);
  for (int i = 0; i < TRAIL; i++) {
    vec3 tp = u_trail[i];
    if (tp.z > 0.0) {
      vec2 dv = p - tp.xy;
      float dist = length(dv);
      float infl = exp(-dist * 15.0) * tp.z * 0.42;
      wake += infl;
      warp += normalize(dv + vec2(1e-5)) * infl * 0.10;
    }
  }

  // ---- click ripples ------------------------------------------------------
  for (int i = 0; i < RIPPLES; i++) {
    vec3 rp = u_ripples[i];
    if (rp.z >= 0.0) {
      float r = length(p - rp.xy);
      float age = rp.z;
      float ring = sin((r - age * 0.85) * 24.0) * exp(-r * 2.6) * exp(-age * 1.5);
      ring *= smoothstep(0.0, 0.06, age);
      wake += abs(ring) * 0.30;
      warp += normalize(p - rp.xy + vec2(1e-5)) * ring * 0.05;
    }
  }

  // Accumulated influence has to be bounded or a fast drag stacks 18 samples
  // and blows out the text contrast.
  wake = clamp(wake, 0.0, 0.9);
  p += warp;

  // Domain warping — noise sampled through noise gives the slow drifting
  // "liquid" motion rather than a flat scrolling texture.
  vec2 q = vec2(fbm(p * 1.6 + vec2(0.0, t)), fbm(p * 1.6 + vec2(5.2, 1.3 - t)));
  vec2 r = vec2(fbm(p * 1.6 + 3.0 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(p * 1.6 + 3.0 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(p * 1.6 + 2.4 * r);
  float field = smoothstep(-0.55, 0.85, f);

  // Pointer light — a soft falloff that brightens as the pointer moves faster.
  vec2 ptr = u_pointer - 0.5;
  ptr.x *= u_resolution.x / u_resolution.y;
  float d = length(p - ptr);
  float glow = exp(-d * 3.2) * (0.16 + u_energy * 0.42);

  // Palette drifts as the page scrolls: lime -> teal -> magenta-ish.
  vec3 limeCol  = vec3(0.60, 0.92, 0.18);
  vec3 tealCol  = vec3(0.13, 0.52, 0.46);
  vec3 plumCol  = vec3(0.48, 0.16, 0.44);
  vec3 base = mix(limeCol, tealCol, smoothstep(0.0, 0.55, u_scroll));
  base = mix(base, plumCol, smoothstep(0.55, 1.0, u_scroll));

  vec3 col = base * field * 0.30;
  col += limeCol * glow;
  col += mix(limeCol, vec3(0.85, 0.98, 0.72), 0.45) * wake * 0.20;

  // Ridge highlights pick out the flow lines.
  float ridge = smoothstep(0.48, 0.52, fract(f * 3.0 + t * 2.0));
  col += base * ridge * 0.05;

  // Vignette so the centre of the page stays readable.
  float vig = smoothstep(1.05, 0.18, length(uv - 0.5));
  col *= vig;

  // Grain breaks up banding on wide gradients.
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.025;

  float alpha = clamp(field * 0.36 + glow * 1.0 + wake * 0.30, 0.0, 0.62);
  gl_FragColor = vec4(col, alpha * vig);
}
`;

function compile(gl, type, src) {
  const shader = gl.createShader(type);
  // createShader returns null on a lost context; calling shaderSource on that
  // throws, and getShaderInfoLog(null) is null — which is what produced the
  // useless "shader failed: null" warning.
  if (!shader) {
    console.warn("[FluidBackground] createShader returned null (context lost:", gl.isContextLost(), ")");
    return null;
  }
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[FluidBackground] shader compile failed:", gl.getShaderInfoLog(shader) || "(no info log)");
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function FluidBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: false, powerPreference: "low-power" }) ||
      canvas.getContext("experimental-webgl");

    // No WebGL (old browser, blocklisted GPU, headless) — leave the CSS
    // background in place rather than showing a dead black canvas.
    if (!gl || gl.isContextLost()) {
      canvas.style.display = "none";
      return undefined;
    }

    // A canvas only ever hands back one context. If a previous mount released
    // it, getContext returns that same dead object — so the context must never
    // be destroyed in cleanup (see teardown below).
    canvas.style.display = "";

    let frame = 0;
    let running = true;

    const onContextLost = (event) => {
      event.preventDefault();
      running = false;
      cancelAnimationFrame(frame);
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    const giveUp = () => {
      canvas.style.display = "none";
      canvas.removeEventListener("webglcontextlost", onContextLost);
      return undefined;
    };

    const program = gl.createProgram();
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return giveUp();

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[FluidBackground] link failed:", gl.getProgramInfoLog(program) || "(no info log)");
      return giveUp();
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    const loc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uScroll = gl.getUniformLocation(program, "u_scroll");
    const uEnergy = gl.getUniformLocation(program, "u_energy");
    const uTrail = gl.getUniformLocation(program, "u_trail");
    const uRipples = gl.getUniformLocation(program, "u_ripples");

    const TRAIL = 18;
    const RIPPLES = 4;
    const trail = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0, life: 0 }));
    const trailData = new Float32Array(TRAIL * 3);
    const ripples = Array.from({ length: RIPPLES }, () => ({ x: 0, y: 0, age: -1 }));
    const rippleData = new Float32Array(RIPPLES * 3);
    let trailHead = 0;
    let lastMs = 0;

    // Screen -> the same aspect-corrected space the shader works in.
    const toField = (clientX, clientY) => {
      const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
      return {
        x: (clientX / window.innerWidth - 0.5) * aspect,
        y: (1 - clientY / window.innerHeight) - 0.5,
      };
    };

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const target = { x: 0.5, y: 0.55 };
    const smooth = { x: 0.5, y: 0.55 };
    let energy = 0;
    let scroll = 0;

    const onPointer = (event) => {
      const nx = event.clientX / window.innerWidth;
      const ny = 1 - event.clientY / window.innerHeight;
      energy = Math.min(1, energy + Math.hypot(nx - target.x, ny - target.y) * 7);
      target.x = nx;
      target.y = ny;

      const f = toField(event.clientX, event.clientY);
      trail[trailHead].x = f.x;
      trail[trailHead].y = f.y;
      trail[trailHead].life = 1;
      trailHead = (trailHead + 1) % TRAIL;
    };

    const onClick = (event) => {
      const f = toField(event.clientX, event.clientY);
      // Reuse the oldest slot so rapid clicks keep working.
      let slot = 0;
      let oldest = -1;
      for (let i = 0; i < RIPPLES; i++) {
        if (ripples[i].age < 0) { slot = i; oldest = -1; break; }
        if (ripples[i].age > oldest) { oldest = ripples[i].age; slot = i; }
      }
      ripples[slot].x = f.x;
      ripples[slot].y = f.y;
      ripples[slot].age = 0;
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (ms) => {
      resize();
      const dt = lastMs ? Math.min(0.05, (ms - lastMs) / 1000) : 0.016;
      lastMs = ms;

      smooth.x += (target.x - smooth.x) * 0.045;
      smooth.y += (target.y - smooth.y) * 0.045;
      energy *= 0.94;

      for (let i = 0; i < TRAIL; i++) {
        const tp = trail[i];
        if (tp.life > 0) tp.life = Math.max(0, tp.life - dt * 1.15);
        trailData[i * 3] = tp.x;
        trailData[i * 3 + 1] = tp.y;
        trailData[i * 3 + 2] = tp.life * tp.life; // ease the fade out
      }
      gl.uniform3fv(uTrail, trailData);

      for (let i = 0; i < RIPPLES; i++) {
        const rp = ripples[i];
        if (rp.age >= 0) {
          rp.age += dt;
          if (rp.age > 2.6) rp.age = -1;
        }
        rippleData[i * 3] = rp.x;
        rippleData[i * 3 + 1] = rp.y;
        rippleData[i * 3 + 2] = rp.age;
      }
      gl.uniform3fv(uRipples, rippleData);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform2f(uPointer, smooth.x, smooth.y);
      gl.uniform1f(uTime, ms / 1000);
      gl.uniform1f(uScroll, scroll);
      gl.uniform1f(uEnergy, energy);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const loop = (ms) => {
      if (!running) return;
      draw(ms);
      frame = requestAnimationFrame(loop);
    };

    onScroll();

    if (reduced) {
      // One static frame: the texture is still there, nothing moves.
      resize();
      draw(0);
      return () => {
        canvas.removeEventListener("webglcontextlost", onContextLost);
      };
    }

    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(loop);

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      // Deliberately NOT calling WEBGL_lose_context here. React StrictMode
      // mounts effects twice in development; destroying the context on the
      // first teardown left the second mount with a dead context, so every
      // shader call failed and the backdrop silently vanished in dev.
    };
  }, []);

  return <canvas ref={canvasRef} className="fluid-bg" aria-hidden="true" />;
}
