"use client";

import React, { useEffect, useRef } from "react";

const Main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // pointer target (actual mouse/touch pos)
  const targetX = useRef<number>(-9999);
  const targetY = useRef<number>(-9999);
  // current (rendered) cursor pos
  const curX = useRef<number>(0);
  const curY = useRef<number>(0);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // base visual: white circle that uses difference blend to contrast with background
    cursor.style.position = "fixed";
    cursor.style.width = "40px";
    cursor.style.height = "40px";
    cursor.style.borderRadius = "50%";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    cursor.style.transform = "translate3d(-50%, -50%, 0)"; // scale applied on down/up
    cursor.style.transition = "transform 120ms linear, width 160ms, height 160ms";
    cursor.style.willChange = "transform, left, top";
    cursor.style.left = "0px";
    cursor.style.top = "0px";

    // Use a neutral fill and mix-blend-mode: difference so the cursor contrasts automatically.
    // White fill is a good default because difference with dark -> light and with light -> dark.
    cursor.style.background = "white";
    cursor.style.mixBlendMode = "difference";
    // Add a subtle outline (shadow) so the cursor remains perceivable even in edge cases.
    cursor.style.boxShadow = "0 0 0 4px rgba(0,0,0,0.12)";

    const speed = 0.15; // lerp factor (0..1) - lower => more delay

    // animation loop: lerp current pos toward target pos
    const tick = () => {
      if (!cursor) return;
      // lerp current position toward target
      curX.current += (targetX.current - curX.current) * speed;
      curY.current += (targetY.current - curY.current) * speed;

      // apply positions
      cursor.style.left = curX.current + "px";
      cursor.style.top = curY.current + "px";

      rafRef.current = requestAnimationFrame(tick);
    };

    // start loop
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    const onMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
      // ensure cursor visible on move
      cursor.style.display = "block";
    };

    const onMouseDown = () => {
      cursor.style.transform = "translate3d(-50%, -50%, 0) scale(0.85)";
    };
    const onMouseUp = () => {
      cursor.style.transform = "translate3d(-50%, -50%, 0) scale(1)";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // touch fallback: update target positions and show/hide
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      targetX.current = t.clientX;
      targetY.current = t.clientY;
      cursor.style.display = "block";
    };
    const onTouchEnd = () => {
      cursor.style.display = "none";
    };
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // container hides native cursor so custom one is visible
  return (
    <div className="cursor-none">
      {/* <div className="fixed inset-0 z-[1]">
        <PixelTrail
          pixelSize={screenSize.lessThan(`md`) ? 16 : 24}
          fadeDuration={500}
          pixelClassName="bg-white mix-blend-difference"
        />
      </div> */}
      {children}
      <div ref={cursorRef} aria-hidden />
    </div>
  );
};

export default Main;
