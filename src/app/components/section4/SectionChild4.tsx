import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"
import { usePathname } from "next/navigation"
import ViewModal from "../ViewModal"

const SectionChild4: React.FC = () => {
  const pathname = usePathname()
  const isQuiz = pathname === '/quiz'
  const sectionRef = useRef<HTMLElement | null>(null)
  const { ref: triggerRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  })
  const [isOpen, setIsOpen] = useState(false)

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
    <section ref={sectionRef} className="w-full min-w-[100vw] h-screen flex relative bg-[#e94b59]">
      <img
        src="/images/section4.4.png"
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] rounded-l-xl"
      />
      {/* LEFT PANEL */}
      <div className={cn("relative w-full overflow-hidden px-12 py-8 flex flex-col", inView ? "" : "opacity-0")} ref={triggerRef}>
        {/* Big title */}
        <div className="mt-4">
          <div className="flex justify-between">
            <h1
              className="js-title text-white font-extrabold leading-[1.2] tracking-tight"
              style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
            >
              CÁC GIẢI PHÁP
              <br />
              SỬA SAI TRỌNG TÂM
            </h1>
            <p>1987-1988</p>
          </div>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-black js-barb">
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
        <div className="w-[60%] mt-10 js-caption">
          <div className="text-white text-4xl leading-8">
            <ul className="list-decimal list-inside space-y-3 text-2xl ml-4">
              <li>Đột phá Nông nghiệp: Nghị quyết 10-NQ/TW (Khoán 10) (1988) Cho hộ gia đình là đơn vị kinh tế tự chủ. Từ đó chuyển từ thiếu lương thực sang xuất khẩu gạo (1989).</li>
              <li>TKiềm chế Lạm phát : Biện pháp thắt chặt chi tiêu và tiền tệ tăng cường huy động vốn qua công cụ lãi suất dương (cuối 1988). .</li>
              <li>Mở cửa Đối ngoại : Luật Đầu tư nước ngoài (1988) mở cửa thu hút vốn, công nghệ từ bên ngoài, phá vỡ thế bao vây cấm vận.</li>
            </ul>
          </div>
        </div>
      </div>
      {isOpen &&
        <ViewModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-4 h-[500px]">
            <h2 className="text-lg font-bold">Chi tiết</h2>
            <p className="mt-2">Nội dung chi tiết về lý do lựa chọn cải cách.</p>
          </div>
        </ViewModal>
      }
    </section>
  )
}

export default SectionChild4