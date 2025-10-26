import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"

const SectionChild3: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  const { ref: triggerRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (!sectionRef.current || !inView) return

    const ctx = gsap.context(() => {
      // Title entrance
      gsap.from(".js-title", {
        y: 80,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.05,
      })

      // decorative barbed wire
      gsap.from(".js-barb", {
        x: -40,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      })

      // caption lines
      gsap.from(".js-caption > *", {
        y: 20,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.12,
        delay: 0.4,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [inView])

  // Smooth follow loop
  const loop = () => {
    pos.current.x += (target.current.x - pos.current.x) * 0.18
    pos.current.y += (target.current.y - pos.current.y) * 0.18

    if (imgRef.current) {
      imgRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`
    }

    // stop loop when near target and not hovering
    const dx = Math.abs(target.current.x - pos.current.x)
    const dy = Math.abs(target.current.y - pos.current.y)
    if (!hovering && dx < 0.5 && dy < 0.5) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      return
    }

    rafRef.current = requestAnimationFrame(loop)
  }

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const rect = leftRef.current?.getBoundingClientRect()
    if (!rect || !imgRef.current) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // if the RAF loop was running, stop it to avoid conflicting transforms
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }

    // Smooth, delayed follow using GSAP — animate the target ref and apply transform on each tick
    gsap.to(target.current, {
      x,
      y,
      duration: 1.2,
      ease: "power3.out",
      overwrite: true,
      onUpdate: () => {
        if (imgRef.current) {
          imgRef.current.style.transform = `translate(${target.current.x}px, ${target.current.y}px) translate(-50%, -50%)`
        }
      },
    })
  }

  const handleMouseEnter = () => {
    setHovering(true)
    if (imgRef.current) {
      imgRef.current.style.opacity = "1"
      imgRef.current.style.transition = "opacity 200ms ease"
    }
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(loop)
    }
  }

  const handleMouseLeave = () => {
    setHovering(false)
    if (imgRef.current) {
      imgRef.current.style.opacity = "0"
    }
    // loop will stop itself when settled; or cancel after a small timeout
    if (rafRef.current) {
      // keep running briefly so it eases out; optional: cancel immediately
      // cancelAnimationFrame(rafRef.current)
      // rafRef.current = null
    }
  }

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="w-full min-w-[100vw] h-screen flex relative bg-[#0b0b0b]">
      {/* LEFT PANEL */}
      <div
        ref={leftRef}
        className={cn("relative z-[20] w-[50%] px-12 py-8 flex flex-col", inView ? "" : "opacity-0")}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* FOLLOW IMAGE (replace src with your image) */}
        <img
          ref={imgRef}
          src="/images/section3.3.webp" /* <-- replace with your image path */
          alt="follow"
          style={{
            position: "absolute",
            left: 200,
            top: -100,
            width: 320,
            height: "auto",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            opacity: 0,
            transition: "opacity 200ms ease",
            willChange: "transform, opacity",
            zIndex: 200,
          }}
        />

        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Nguyên nhân
            <br />
            khách quan
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[#c64b4b] js-barb">
              {/* repeated tiny barbed-wire shapes */}
              <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9H220" stroke="#c64b4b" strokeWidth="2" strokeLinecap="round" />
                <g stroke="#c64b4b" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 9l6-4M20 9l6 4M52 9l6-4M52 9l6 4M84 9l6-4M84 9l6 4M116 9l6-4M116 9l6 4M148 9l6-4M148 9l6 4" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* bottom caption */}
        <div className="w-[80%] mt-10 js-caption">
          <div className="text-[#efe6d0] text-xl leading-8">
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>Nền kinh tế sau chiến tranh kiệt quệ; sản xuất nhỏ, manh mún là phổ biến.</li>
              <li>Hậu quả chiến tranh biên giới và bao vây, cấm vận từ Hoa Kỳ cùng các nước phương Tây làm suy yếu khả năng phục hồi.</li>
              <li>Thiên tai liên tục (1979–1984) ảnh hưởng nặng nề đến sản xuất nông nghiệp, làm giảm sút nguồn lương thực và nguyên liệu.</li>
            </ul>
          </div >
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative w-[50%] bg-green-900/40 px-12 py-8 flex-col" ref={triggerRef}>

        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Nguyên nhân
            <br />
            chủ quan
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[#c64b4b] js-barb">
              {/* repeated tiny barbed-wire shapes */}
              <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9H220" stroke="#c64b4b" strokeWidth="2" strokeLinecap="round" />
                <g stroke="#c64b4b" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 9l6-4M20 9l6 4M52 9l6-4M52 9l6 4M84 9l6-4M84 9l6 4M116 9l6-4M116 9l6 4M148 9l6-4M148 9l6 4" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* bottom caption */}
        <div className="w-[80%] mt-10 js-caption">
          <div className="text-[#efe6d0] text-xl leading-8">
            <p className="mb-4">
              Các sai lầm chủ yếu bao gồm
            </p>

            <p className="font-semibold mb-3">Sai lầm về tư duy và bước đi nóng vội:</p>

            <ul className="list-disc list-inside space-y-3 text-base">
              <li>Ưu tiên phát triển công nghiệp nặng.</li>
              <li>Đặt các chỉ tiêu kinh tế cao.</li>
              <li>Chủ trương nóng vội (hoàn thành cải tạo XHCN cả nước trong thời gian ngắn 1976).</li>
            </ul>
          </div>
        </div>
      </div>
    </section >
  )
}

export default SectionChild3