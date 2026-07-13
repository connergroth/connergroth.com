import { useEffect, useRef } from 'react';

/* 4×4 Bayer ordered-dither matrix */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const PAPER = [250, 250, 249]; // matches the sheet
const INK = [68, 64, 60]; // stone-700

/**
 * Renders `src` as a chunky two-tone ordered dither on a canvas.
 * Meant to sit on top of the real <img> and fade out on hover.
 * Hidden entirely on touch devices via the `dither-canvas` class.
 */
const DitheredImage = ({ src, className }: { src: string; className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      // Low internal resolution → visible dither chunks once CSS scales it up
      const W = 160;
      const H = 90;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Emulate object-cover / object-top so it lines up with the img below
      const scale = Math.max(W / img.width, H / img.height);
      const sw = W / scale;
      const sh = H / scale;
      const sx = (img.width - sw) / 2;
      ctx.drawImage(img, sx, 0, sw, sh, 0, 0, W, H);

      const imageData = ctx.getImageData(0, 0, W, H);
      const d = imageData.data;

      // Auto-levels: stretch each image's own luminance range (5th–95th
      // percentile) so pale screenshots dither as richly as dark ones.
      const lums = new Float32Array(W * H);
      for (let p = 0; p < W * H; p++) {
        const i = p * 4;
        lums[p] = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2];
      }
      const sorted = Array.from(lums).sort((a, b) => a - b);
      const lo = sorted[Math.floor(sorted.length * 0.05)];
      const hi = sorted[Math.floor(sorted.length * 0.95)];
      const range = Math.max(hi - lo, 1);

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const p = y * W + x;
          const i = p * 4;
          const lum = ((lums[p] - lo) / range) * 255;
          const threshold = ((BAYER[y % 4][x % 4] + 0.5) / 16) * 255;
          const tone = lum > threshold ? PAPER : INK;
          d[i] = tone[0];
          d[i + 1] = tone[1];
          d[i + 2] = tone[2];
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
    };
  }, [src]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={`dither-canvas ${className ?? ''}`}
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default DitheredImage;
