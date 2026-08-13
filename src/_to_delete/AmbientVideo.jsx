import { useEffect, useRef } from "react";

export default function AmbientVideo() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!canvas.captureStream || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const context = canvas.getContext("2d");
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    let frame;

    const render = (time) => {
      const seconds = time / 1000;
      context.fillStyle = "#050705";
      context.fillRect(0, 0, size, size);

      for (let index = 0; index < 115; index += 1) {
        const seed = index * 37.13;
        const x = (Math.sin(seed) * 0.5 + 0.5) * size;
        const y = (Math.cos(seed * 1.7) * 0.5 + 0.5) * size;
        const pulse = (Math.sin(seconds * (0.5 + (index % 4) * 0.12) + seed) + 1) / 2;
        context.fillStyle = `rgba(184, 255, 88, ${0.12 + pulse * 0.48})`;
        context.beginPath();
        context.arc(x, y, 0.8 + pulse * 1.7, 0, Math.PI * 2);
        context.fill();
      }

      context.strokeStyle = "rgba(184, 255, 88, 0.12)";
      context.lineWidth = 1;
      for (let line = 0; line < 4; line += 1) {
        context.beginPath();
        for (let x = 0; x <= size; x += 16) {
          const y = size * (0.72 + line * 0.045) + Math.sin(x * 0.018 + seconds * 0.9 + line) * 17;
          if (x === 0) context.moveTo(x, y); else context.lineTo(x, y);
        }
        context.stroke();
      }

      frame = requestAnimationFrame(render);
    };

    const stream = canvas.captureStream(24);
    video.srcObject = stream;
    video.play().catch(() => {});
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      stream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="ambient-source" aria-hidden="true" />
      <video ref={videoRef} className="ambient-video site-ambient-video" autoPlay muted loop playsInline aria-hidden="true" />
    </>
  );
}
