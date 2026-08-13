import { useEffect, useRef } from "react";

const vertexShader = `
  attribute vec2 position;
  void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

const fragmentShader = `
  precision mediump float;
  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_time;

  float field(vec2 point, vec2 center, float radius) {
    return radius / length(point - center);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 point = uv - vec2(0.5);
    point.x *= u_resolution.x / u_resolution.y;
    vec2 cursor = u_pointer - vec2(0.5);
    cursor.x *= u_resolution.x / u_resolution.y;
    vec2 orbitA = vec2(cos(u_time * 0.22) * 0.21, sin(u_time * 0.31) * 0.12);
    vec2 orbitB = vec2(sin(u_time * 0.17) * 0.33, cos(u_time * 0.24) * 0.19);
    float glow = field(point, orbitA, 0.018) + field(point, orbitB, 0.012) + field(point, cursor * 0.65, 0.009);
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.035;
    vec3 deepGreen = vec3(0.015, 0.20, 0.075);
    vec3 neonGreen = vec3(0.72, 1.0, 0.20);
    vec3 color = mix(deepGreen, neonGreen, smoothstep(-0.5, 0.8, point.x + point.y));
    gl_FragColor = vec4(color * glow + grain, min(glow * 0.16, 0.27));
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

export default function AuroraCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const program = gl.createProgram();
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "u_resolution");
    const time = gl.getUniformLocation(program, "u_time");
    const pointer = gl.getUniformLocation(program, "u_pointer");
    const cursor = { x: 0.72, y: 0.47 };
    let frame;

    const movePointer = (event) => {
      const bounds = canvas.getBoundingClientRect();
      cursor.x = (event.clientX - bounds.left) / bounds.width;
      cursor.y = 1 - (event.clientY - bounds.top) / bounds.height;
    };
    window.addEventListener("pointermove", movePointer, { passive: true });

    const render = (milliseconds) => {
      const scale = Math.min(window.devicePixelRatio, 1.5);
      const width = canvas.clientWidth * scale;
      const height = canvas.clientHeight * scale;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(resolution, width, height);
      gl.uniform1f(time, milliseconds / 1000);
      gl.uniform2f(pointer, cursor.x, cursor.y);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", movePointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="aurora-canvas" aria-hidden="true" />;
}
