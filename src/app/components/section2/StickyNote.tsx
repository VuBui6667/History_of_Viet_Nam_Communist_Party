import React, { memo, useRef, useEffect } from "react"
import { gsap } from "gsap"
import DragElements from "@/components/fancy/blocks/drag-elements"
import Image from "next/image"

const randomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const urls = [
  "/images/note3.webp",
  "/images/note2.webp",
  "/images/note1.webp",
]

const StickyNote: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const noteRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(noteRefs.current, {
        y: -200,
        opacity: 0,
        rotation: () => randomInt(-12, 12),
        duration: 1.2,
        ease: "bounce.out",
        stagger: 0.12,
        overwrite: true,
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative top-20 right-[500px]">
      <DragElements dragMomentum={false} dragElastic={1.5}>
        {urls.map((url, index) => {
          const rotation = randomInt(-12, 12)
          const width = 320 + randomInt(-20, 100)
          const height = 320 + randomInt(-20, 100)

          return (
            <div
              key={index}
              ref={(el: any) => (noteRefs.current[index] = el)}
              className={`flex items-start justify-center bg-white shadow-2xl p-4`}
              style={{
                transform: `rotate(${rotation}deg)`,
                width: `${width}px`,
                height: `${height}px`,
              }}
            >
              <div
                className={`relative overflow-hidden`}
                style={{
                  width: `${width - 4}px`,
                  height: `${height - 30}px`,
                }}
              >
                <Image
                  src={url}
                  fill
                  alt={`Analog photo ${index + 1}`}
                  className="object-cover"
                  draggable={false}
                />
              </div>
            </div>
          )
        })}
      </DragElements>
    </div>
  )
}

export default memo(StickyNote)