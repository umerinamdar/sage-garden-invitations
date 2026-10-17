import { useEffect, useRef, useState } from "react";

export function ScratchReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const css = getComputedStyle(document.documentElement);
    const foil = css.getPropertyValue("--scratch-foil").trim();
    const ink = css.getPropertyValue("--scratch-ink").trim();
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = c.getBoundingClientRect();
    c.width = width * dpr;
    c.height = height * dpr;
    ctx.scale(dpr, dpr);
    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, ink);
    g.addColorStop(0.45, foil);
    g.addColorStop(0.55, foil);
    g.addColorStop(1, ink);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
    for (let i = 0; i < 1400; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.12})`;
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
    ctx.globalCompositeOperation = "destination-out";

    let drawing = false;
    let moves = 0;
    const pos = (e: PointerEvent): [number, number] => {
      const r = c.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    const scratch = (e: PointerEvent) => {
      if (!drawing) return;
      const [x, y] = pos(e);
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();
      if (++moves % 20 === 0) {
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        let clear = 0;
        for (let i = 3; i < d.length; i += 64) if (d[i] === 0) clear++;
        if (clear / (d.length / 64) > 0.5) setDone(true);
      }
    };
    const down = (e: PointerEvent) => { drawing = true; c.setPointerCapture(e.pointerId); scratch(e); };
    const up = () => { drawing = false; };
    c.addEventListener("pointerdown", down);
    c.addEventListener("pointermove", scratch);
    c.addEventListener("pointerup", up);
    return () => {
      c.removeEventListener("pointerdown", down);
      c.removeEventListener("pointermove", scratch);
      c.removeEventListener("pointerup", up);
    };
  }, []);

  return (
    <div className="relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-sm border border-border">
      <div className="flex h-full items-center justify-center bg-surface">{children}</div>
      <canvas
        ref={ref}
        aria-label="Scratch to reveal"
        onKeyDown={(e) => e.key === "Enter" && setDone(true)}
        tabIndex={0}
        className={`absolute inset-0 h-full w-full cursor-grab touch-none transition-opacity duration-700 ${done ? "pointer-events-none opacity-0" : ""}`}
      />
    </div>
  );
}
