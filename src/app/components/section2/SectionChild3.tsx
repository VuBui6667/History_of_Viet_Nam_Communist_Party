import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import StickyNote from "./StickyNote"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"

const SectionChild3: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
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

  return (
    <section ref={sectionRef} className="w-full min-w-[100vw] h-screen flex relative bg-[#0b0b0b]">
      {/* LEFT PANEL */}
      <div className={cn("relative w-3/5 overflow-hidden px-12 py-8 flex flex-col", inView ? "" : "opacity-0")}>
        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Áp Lực Đổi Mới
            <br />
            Cơ Chế
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
              Sau khi thống nhất đất nước năm 1975, Việt Nam lựa chọn xây dựng nền kinh tế theo mô hình kế hoạch hóa tập trung bao cấp.
            </p>

            <p className="font-semibold mb-3">Trong mô hình này:</p>

            <ul className="list-disc list-inside space-y-3 text-base">
              <li>Nhà nước kiểm soát toàn bộ giá cả, tiền lương, phân phối hàng hóa.</li>
              <li>Hầu hết hàng hóa tiêu dùng thiết yếu được cấp phát bằng tem phiếu chứ không mua bán theo giá thị trường.</li>
              <li>Người lao động nhận lương bằng tiền, nhưng giá cả thấp giả tạo; thiếu hàng hóa nên tiền không phản ánh đúng giá trị thực.</li>
            </ul>

            <p className="mt-4 italic font-semibold">Và bước đột phá được chọn chính là: giá – lương – tiền.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative w-2/5" ref={triggerRef}>
        {/* background image (replace url with your image) */}
        <div
          className="absolute inset-0 bg-cover bg-center filter grayscale contrast-90"
          style={{
            backgroundImage: "url('/images/prison.jpg')",
            mixBlendMode: "multiply",
            backgroundColor: "#1e5b3a",
          }}
          aria-hidden
        />

        {/* green overlay to match tonal look */}
        <div className="absolute inset-0 bg-green-900/40" />

        {/* stack of sticky notes */}
      </div>
      {inView &&
        <StickyNote />
      }
    </section>
  )
}

export default SectionChild3