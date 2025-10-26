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
    <section ref={sectionRef} className="w-full min-w-[150vw] h-screen flex relative bg-[#0b0b0b]">
      {/* PANEL 1 */}
      <div
        ref={leftRef}
        className={cn("relative z-[20] w-[50%] px-12 py-8 flex flex-col", inView ? "" : "opacity-0")}
      >
        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Giá Cả
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[#c64b4b] js-barb">
              {/* repeated tiny barbed-wire shapes */}
              <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9H220" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 9l6-4M20 9l6 4M52 9l6-4M52 9l6 4M84 9l6-4M84 9l6 4M116 9l6-4M116 9l6 4M148 9l6-4M148 9l6 4" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* bottom caption */}
        <div className="w-[80%] mt-10 js-caption">
          <div className="text-[#efe6d0] text-xl leading-8">
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              Mặc dù chủ trương chuyển sang một giá, nhưng do không thống nhất được mức giá vật tư đầu vào (các Bộ/địa phương đề nghị giá thấp hơn kế hoạch), nên đã dẫn đến méo mó, không triệt để.
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              Giá không phản ánh đúng chi phí, vẫn còn sự can thiệp hành chính.
            </div>
          </div>
        </div>
      </div>
      <img src="/images/arrow.gif" className="absolute w-20 h-auto left-[40vw] bottom-40 rotate-180" />
      {/* PANEL 2 */}
      <div className="relative w-[50%] bg-green-900/40 px-12 py-8 flex-col" ref={triggerRef}>

        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Tiền Lương
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[#c64b4b] js-barb">
              {/* repeated tiny barbed-wire shapes */}
              <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9H220" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 9l6-4M20 9l6 4M52 9l6-4M52 9l6 4M84 9l6-4M84 9l6 4M116 9l6-4M116 9l6 4M148 9l6-4M148 9l6 4" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* bottom caption */}
        <div className="w-[80%] mt-10 js-caption">
          <div className="text-[#efe6d0] text-xl leading-8">
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              Để thực hiện "bù giá vào lương" (lương tăng 100% so với kế hoạch ban đầu), Nhà nước buộc phải in thêm một khối lượng tiền lớn vượt xa khả năng cung ứng hàng hóa.
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              In tiền giải quyết vấn đề ngân sách và lương mà không có hàng hóa đối ứng.
            </div>
          </div>
        </div>
      </div>
      <img src="/images/arrow.gif" className="absolute w-20 h-auto left-[90vw] bottom-40 rotate-180" />
      {/* PANEL 3 */}
      <div className="relative w-[50%] bg-[#e94b59] px-12 py-8 flex-col" ref={triggerRef}>

        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Tiền Tệ
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-[#c64b4b] js-barb">
              {/* repeated tiny barbed-wire shapes */}
              <svg width="220" height="18" viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 9H220" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <g stroke="#fff" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 9l6-4M20 9l6 4M52 9l6-4M52 9l6 4M84 9l6-4M84 9l6 4M116 9l6-4M116 9l6 4M148 9l6-4M148 9l6 4" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* bottom caption */}
        <div className="w-[80%] mt-10 js-caption">
          <div className="text-[#efe6d0] text-xl leading-8">
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              Đổi tiền vội vàng (từ ngày 14/9/1985) và quy định hạn mức đổi tiền tối đa cho mỗi gia đình (1.500 – 2.000 đồng tiền mới).
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Cách thức tiến hành thực tế:
              </span>
              Quản lý hành chính quá mức trong việc đổi tiền, gây khủng hoảng niềm tin và tạo điều kiện cho lạm phát bùng nổ ngay sau đó (tiền mới nhanh chóng mất giá).
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default SectionChild3