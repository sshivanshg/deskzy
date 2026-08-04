"use client";

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import createGlobe from "cobe";

export interface CdnMarker {
  id: string;
  location: [number, number];
  region: string;
}

export interface CdnArc {
  id: string;
  from: [number, number];
  to: [number, number];
}

interface GlobeCdnProps {
  markers?: CdnMarker[];
  arcs?: CdnArc[];
  /** Stable request counts keyed by arc id (real traffic). */
  arcTraffic?: Record<string, number>;
  className?: string;
  speed?: number;
  /** Match Deskzy dark theme when true */
  dark?: boolean;
}

/** Deskzy accent #1f6b57 */
const ACCENT: [number, number, number] = [0.12, 0.42, 0.34];

export function GlobeCdn({
  markers = [],
  arcs = [],
  arcTraffic,
  className = "",
  speed = 0.003,
  dark = false,
}: GlobeCdnProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef({ phi: 0, theta: 0 });
  const phiOffsetRef = useRef(0);
  const thetaOffsetRef = useRef(0);
  const isPausedRef = useRef(false);
  const [traffic, setTraffic] = useState(() =>
    arcs.map((a) => ({
      id: a.id,
      value: arcTraffic?.[a.id] ?? 100,
    })),
  );

  useEffect(() => {
    setTraffic(
      arcs.map((a) => ({
        id: a.id,
        value: arcTraffic?.[a.id] ?? 100,
      })),
    );
  }, [arcs, arcTraffic]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTraffic((data) =>
        data.map((t) => ({
          ...t,
          value: Math.max(10, t.value + Math.floor(Math.random() * 11) - 4),
        })),
      );
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const handlePointerDown = useCallback((e: ReactPointerEvent<HTMLCanvasElement>) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
    isPausedRef.current = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi;
      thetaOffsetRef.current += dragOffset.current.theta;
      dragOffset.current = { phi: 0, theta: 0 };
    }
    pointerInteracting.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        };
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerUp]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;

    function init() {
      const width = canvas.offsetWidth;
      if (width === 0 || globe) return;

      const base: [number, number, number] = dark
        ? [0.12, 0.14, 0.12]
        : [1, 1, 1];
      const glow: [number, number, number] = dark
        ? [0.15, 0.28, 0.24]
        : [0.94, 0.93, 0.91];
      const markerColor: [number, number, number] = dark
        ? ACCENT
        : [0.05, 0.08, 0.06];
      const arcColor: [number, number, number] = dark
        ? ACCENT
        : [0.08, 0.12, 0.1];

      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: 0.2,
        dark: dark ? 1 : 0,
        diffuse: dark ? 1.2 : 1.5,
        mapSamples: 16000,
        mapBrightness: dark ? 4 : 10,
        baseColor: base,
        markerColor,
        glowColor: glow,
        markerElevation: 0.02,
        markers: markers.map((m) => ({
          location: m.location,
          size: 0.014,
          id: m.id,
        })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor,
        arcWidth: 0.55,
        arcHeight: 0.25,
        opacity: dark ? 0.55 : 0.7,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({
          phi: phi + phiOffsetRef.current + dragOffset.current.phi,
          theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
        });
        animationId = requestAnimationFrame(animate);
      }
      animate();
      window.setTimeout(() => {
        if (canvas) canvas.style.opacity = "1";
      }, 0);
    }

    let ro: ResizeObserver | null = null;
    if (canvas.offsetWidth > 0) {
      init();
    } else {
      ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro?.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (globe) globe.destroy();
      ro?.disconnect();
    };
  }, [markers, arcs, speed, dark]);

  const pyramidFaceStyle = (nth: number): CSSProperties => {
    const transforms = [
      "rotateY(0deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(120deg) translateZ(4px) rotateX(19.5deg)",
      "rotateY(240deg) translateZ(4px) rotateX(19.5deg)",
      "rotateX(-90deg) rotateZ(60deg) translateY(4px)",
    ];
    const colors = dark
      ? ["#1f6b57", "#2a8f72", "#134a3c", "#185546"]
      : ["#111", "#333", "#555", "#222"];
    return {
      position: "absolute",
      left: -0.5,
      top: 0,
      width: 0,
      height: 0,
      borderLeft: "6.5px solid transparent",
      borderRight: "6.5px solid transparent",
      borderBottom: `13px solid ${colors[nth]}`,
      transformOrigin: "center bottom",
      transform: transforms[nth],
    };
  };

  const formatTraffic = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(Math.round(n));
  };

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <style>{`
        @keyframes pyramid-spin {
          0% { transform: rotateX(20deg) rotateY(0deg); }
          100% { transform: rotateX(20deg) rotateY(360deg); }
        }
      `}</style>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%",
          height: "100%",
          cursor: "grab",
          opacity: 0,
          transition: "opacity 1.2s ease",
          borderRadius: "50%",
          touchAction: "none",
        }}
      />
      {markers.map((m) => (
        <div
          key={m.id}
          style={
            {
              position: "absolute",
              positionAnchor: `--cobe-${m.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              pointerEvents: "none",
              opacity: `var(--cobe-visible-${m.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
              transition: "opacity 0.3s, filter 0.3s",
            } as CSSProperties
          }
        >
          <div
            style={{
              width: 12,
              height: 12,
              position: "relative",
              transformStyle: "preserve-3d",
              animation: "pyramid-spin 4s linear infinite",
            }}
          >
            {[0, 1, 2, 3].map((n) => (
              <div key={n} style={pyramidFaceStyle(n)} />
            ))}
          </div>
          <span
            style={{
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.55rem",
              color: dark ? "#eceae4" : "#000",
              background: dark ? "#1a1d18" : "#fff",
              padding: "2px 6px",
              borderRadius: 3,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            }}
          >
            {m.region}
          </span>
        </div>
      ))}
      {traffic.map((t) => (
        <div
          key={t.id}
          style={
            {
              position: "absolute",
              positionAnchor: `--cobe-arc-${t.id}`,
              bottom: "anchor(top)",
              left: "anchor(center)",
              translate: "-50% 0",
              fontFamily: "ui-monospace, monospace",
              fontSize: "0.5rem",
              color: "#fff",
              background: dark ? "#1f6b57" : "#111",
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              opacity: `var(--cobe-visible-arc-${t.id}, 0)`,
              filter: `blur(calc((1 - var(--cobe-visible-arc-${t.id}, 0)) * 8px))`,
              transition: "opacity 0.3s, filter 0.3s",
            } as CSSProperties
          }
        >
          {formatTraffic(t.value)} req
        </div>
      ))}
    </div>
  );
}
