import React, { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";

type SwapNoteProps = {
  notes: string[];
  titles?: string[];
  initialFront?: number;
};

export default function SwapNote({ notes, titles, initialFront = 0 }: SwapNoteProps) {
  const count = notes.length;
  const noteRefs = useRef<Array<HTMLDivElement | null>>([]);
  const isAnimating = useRef(false);

  const [frontIndex, setFrontIndex] = useState(() =>
    Math.max(0, Math.min(initialFront, Math.max(0, count - 1)))
  );

  // ensure refs array length
  useEffect(() => {
    noteRefs.current = new Array(count).fill(null).map((_, i) => noteRefs.current[i] || null);
  }, [count]);

  // apply base stacked styles whenever frontIndex or number of notes changes
  useEffect(() => {
    if (count === 0) return;
    for (let i = 0; i < count; i++) {
      const el = noteRefs.current[i];
      if (!el) continue;
      gsap.set(el, { clearProps: "all" });
    }

    // styling strategy:
    // front: index = frontIndex -> center, z high
    // next one behind (frontIndex+1) -> slight offset
    // the others get an incremental offset based on their distance from front
    for (let i = 0; i < count; i++) {
      const el = noteRefs.current[i];
      if (!el) continue;
      const distance = (i - frontIndex + count) % count; // 0 = front, 1 = immediate behind, etc.
      if (distance === 0) {
        gsap.set(el, { zIndex: 30, x: 0, y: 0, rotate: -3, scale: 1, opacity: 1 });
      } else if (distance === 1) {
        gsap.set(el, { zIndex: 20, x: 12, y: 10, rotate: 3, scale: 0.98, opacity: 0.98 });
      } else {
        // deeper in the stack get slightly more offset / lower zIndex
        const extra = Math.min(distance - 1, 3);
        gsap.set(el, {
          zIndex: 10,
          x: 12 + extra * 4,
          y: 10 + extra * 3,
          rotate: 3 + extra * 1.5,
          scale: 0.98 - extra * 0.005,
          opacity: 0.95 - extra * 0.01,
        });
      }
    }
  }, [frontIndex, count]);

  const handleClick = (idx: number) => {
    if (isAnimating.current) return;
    if (idx !== frontIndex) return;
    if (count < 2) return;

    const frontNode = noteRefs.current[frontIndex]!;
    const nextIndex = (frontIndex + 1) % count;
    const backNode = noteRefs.current[nextIndex]!;
    if (!frontNode || !backNode) return;

    isAnimating.current = true;

    // bring the incoming note above during animation
    gsap.set(backNode, { zIndex: 40 });

    // compute travel distance from front node width
    const rect = frontNode.getBoundingClientRect();
    const frontWidth = rect?.width || 520;
    const extraDistance = 40;
    const travelDistance = frontWidth + extraDistance;
    const direction = 1; // always slide front to the right; adjust if you want alternation

    const tl = gsap.timeline({
      defaults: { duration: 0.45, ease: "power2.inOut" },
      onComplete: () => {
        // advance frontIndex to next note
        setFrontIndex(nextIndex);
        // tiny delay to allow useEffect to reapply base positions
        setTimeout(() => {
          isAnimating.current = false;
        }, 20);
      },
    });

    // slide current front out
    tl.to(
      frontNode,
      {
        x: travelDistance * direction,
        y: -18,
        rotate: 8 * direction,
        scale: 0.96,
        opacity: 0.95,
      },
      0
    );

    // bring next note into center
    // use fromTo to start from a stacked offset depending on current base (mirrors useEffect)
    tl.fromTo(
      backNode,
      { x: 12, y: 10, rotate: 3, scale: 0.98, opacity: 0.98 },
      { x: 0, y: 0, rotate: -3, scale: 1, opacity: 1 },
      0.15
    );

    // return the outgoing note to a "back" stacked position
    tl.to(
      frontNode,
      { x: 12, y: 10, rotate: 3, scale: 0.98, opacity: 0.95 },
      0.6
    );

    // set zIndex adjustments near end of animation
    tl.set(frontNode, { zIndex: 10 }, 0.6);
    tl.set(backNode, { zIndex: 30 }, 0.6);
  };

  const noteBase =
    "w-[420px] max-w-full min-h-[260px] p-8 rounded-lg shadow-2xl bg-[#efe7d6] border border-[#e6decf] font-mono text-xl leading-relaxed select-none";

  return (
    <div className="relative flex items-center justify-center w-full h-[420px] text-black">
      <div className="absolute inset-0 bg-[url('/images/green-bg.jpg')] bg-cover opacity-30 pointer-events-none" />

      {notes.map((text, i) => {
        const isFront = i === frontIndex;
        return (
          <div
            key={i}
            ref={(el: any) => (noteRefs.current[i] = el)}
            className={`${noteBase} absolute ${isFront ? "cursor-pointer" : ""}`}
            onClick={() => handleClick(i)}
            role="button"
            aria-label={`note ${i + 1}`}
          >
            <p>{i + 1}/{notes.length}</p>
            <p>{titles?.[i]}</p>
            <pre className="whitespace-pre-wrap mt-4">{text}</pre>
          </div>
        );
      })}
    </div>
  );
}