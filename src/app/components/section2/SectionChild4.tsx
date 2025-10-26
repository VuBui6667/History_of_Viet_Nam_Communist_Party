import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"
// import { usePathname } from "next/navigation"
import ViewModal from "../ViewModal"

const SectionChild4: React.FC = () => {
  // const pathname = usePathname()
  const isQuiz = false
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
    <section ref={sectionRef} className="w-[100vw] min-w-[100vw] h-screen flex relative bg-black">
      {/* LEFT PANEL */}
      <div className={cn("relative w-full overflow-hidden px-12 py-8 flex flex-col to-[#e94b59]", inView ? "" : "opacity-0")} ref={triggerRef}>
        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-white font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Lý do lựa chọn cải cách
            <br />
            <span className={cn(isQuiz ? "text-red-500" : "text-amber-500")} onClick={() => {
              if (!isQuiz) return
              setIsOpen(true)
            }}>Giá – Lương – Tiền</span>
          </h1>

          {/* barbed wire decorative */}
          <div className="mt-6">
            <div className="flex items-center gap-2 text-white js-barb">
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
          <div className="text-white text-xl leading-8">
            <p className="mb-4">
              “Giá – Lương – Tiền” là ba trụ cột quan trọng nhất của cơ chế bao cấp. Nếu không thay đổi được nó, sẽ không thể đổi mới phần còn lại của nền kinh tế.
            </p>

            <p className="font-semibold mb-3">Mục tiêu cải cách lúc bấy giờ gồm:</p>

            <ol className="list-decimal list-inside space-y-3 text-base ml-4">
              <li>Xóa bỏ cơ chế bao cấp về giá và lương.</li>
              <li>Tính đủ chi phí vào giá thành, thực hiện cơ chế một giá, không còn giá giả tạo.</li>
              <li>Trả lương bằng tiền thật, có hàng hóa bảo đảm → khuyến khích người lao động sản xuất.</li>
              <li>Chuyển ngân hàng sang hạch toán kinh tế, xóa bao cấp tín dụng.</li>
              <li>Thừa nhận sản xuất hàng hóa và quy luật thị trường trong quản lý kinh tế quốc dân.</li>
            </ol>
          </div>
        </div>
      </div>
      {isOpen &&
        <ViewModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold">Chi tiết</h2>
            <p className="mt-2">Nội dung chi tiết về lý do lựa chọn cải cách.</p>
          </div>
        </ViewModal>
      }
    </section>
  )
}

export default SectionChild4