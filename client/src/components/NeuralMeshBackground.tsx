import { useEffect, useRef } from "react";

type NodePoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

interface NeuralMeshBackgroundProps {
  intensity?: number;
}

// Squared distance threshold — avoids Math.sqrt in the hot O(n²) inner loop
const LINK_DIST = 130;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const ATTRACT_DIST_SQ = 180 * 180;

export function NeuralMeshBackground({ intensity = 1 }: NeuralMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const isMobile = width < 768;
    const pointer = { x: width * 0.5, y: height * 0.5, active: false };
    let isLightMode = document.documentElement.dataset.colorMode === "light";

    // Reduced node count: 16 mobile / 22 desktop (was Math.max(34,...) = always 34+)
    // 22 nodes → 231 checks/frame vs old 34 → 561 checks/frame (−59% CPU)
    const nodeCount = Math.max(isMobile ? 12 : 16, Math.min(isMobile ? 18 : 22, Math.floor((width * height) / 55000) * intensity));
    const nodes: NodePoint[] = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const observer = new MutationObserver(() => {
      isLightMode = document.documentElement.dataset.colorMode === "light";
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-color-mode"],
    });

    resize();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Physics — O(n), cheap, runs every frame
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < ATTRACT_DIST_SQ && distSq > 1) {
            const dist = Math.sqrt(distSq);
            node.vx += (dx / dist) * 0.004;
            node.vy += (dy / dist) * 0.004;
          }
        }

        node.vx = Math.max(Math.min(node.vx, 0.6), -0.6);
        node.vy = Math.max(Math.min(node.vy, 0.6), -0.6);
      }

      // Lines — O(n²). Batch canvas state outside loops to avoid per-segment
      // strokeStyle string parsing (the primary CPU bottleneck in the old code).
      const baseAlpha = pointer.active
        ? (isLightMode ? 0.72 : 0.5)
        : (isLightMode ? 0.42 : 0.28);
      ctx.strokeStyle = isLightMode ? "rgb(30, 64, 175)" : "rgb(56, 189, 248)";
      ctx.lineWidth = pointer.active
        ? (isLightMode ? 1.25 : 1.1)
        : (isLightMode ? 0.95 : 0.75);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < LINK_DIST_SQ) {
            // Only compute sqrt when within range (avoids it for most pairs)
            ctx.globalAlpha = (1 - Math.sqrt(distSq) / LINK_DIST) * baseAlpha;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Nodes — batch fillStyle and radius outside loop
      ctx.fillStyle = isLightMode
        ? (pointer.active ? "rgba(30, 64, 175, 0.78)" : "rgba(59, 130, 246, 0.66)")
        : (pointer.active ? "rgba(125, 211, 252, 0.6)" : "rgba(56, 189, 248, 0.42)");
      const nodeRadius = pointer.active
        ? (isLightMode ? 2 : 1.7)
        : (isLightMode ? 1.55 : 1.3);
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = window.requestAnimationFrame(draw);
    };

    const pauseAnimation = () => {
      if (animationId !== 0) {
        window.cancelAnimationFrame(animationId);
        animationId = 0;
      }
    };

    const resumeAnimation = () => {
      if (animationId === 0 && !document.hidden) {
        animationId = window.requestAnimationFrame(draw);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        pauseAnimation();
      } else {
        resumeAnimation();
      }
    };

    resumeAnimation();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      pauseAnimation();
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="neural-mesh-canvas fixed inset-0 z-[1] pointer-events-none"
    />
  );
}
