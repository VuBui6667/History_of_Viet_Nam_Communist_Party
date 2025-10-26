import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"
import Image from "next/image"
import { usePathname } from "next/navigation"
import ViewModal from "../ViewModal"
import MoneyCard3D from "../MoneyCard3D"
import { onSubmitQuiz } from "@/lib/utils"
import { toast } from "react-toastify"

const SectionChild3: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const leftRef = useRef<HTMLDivElement | null>(null)

  const { ref: showRef, inView: inViewToShow } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const [isOpen, setIsOpen] = useState(false)

  const pathname = usePathname()
  const isQuiz = pathname === '/quiz'

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

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitQuiz = async (answerType: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const toastId = toast.loading("Đang gửi câu trả lời...");

    try {
      const username = localStorage.getItem("username") || "Guest";
      const isScored = answerType === "B";
      const data = await onSubmitQuiz({
        username,
        quizId: 3,
        isScored,
      });

      // close the loading toast before showing the result toast
      toast.dismiss(toastId);

      if (data.error) {
        toast.error(`Có lỗi xảy ra: ${data.error}`);
      } else {
        if (isScored) {
          toast.success("Chúc mừng! Bạn đã trả lời đúng câu hỏi.");
        } else {
          toast.warning("Rất tiếc! Câu trả lời của bạn chưa chính xác.");
        }
      }

      setIsOpen(false);
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section ref={sectionRef} className="h-screen flex relative">
      {/* LEFT PANEL */}
      <div ref={showRef} />
      <div
        ref={leftRef}
        className={cn("relative z-[20] w-[50vw] min-w-[50vw] px-12 py-8 flex flex-col bg-[#f1eada]", inView ? "" : "opacity-0")}
      >
        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-black font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Nguyên nhân chính
            <br />
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
          <div className="text-black text-xl leading-8">
            <ul className="list-disc list-inside space-y-3 text-lg">
              <li>Không chuẩn bị đồng bộ giữa đổi tiền, tăng lương và thả giá</li>
              <li>Thiếu công cụ kiềm chế lạm phát</li>
              <li>Thiếu cơ chế phát triển kinh tế nhiều thành phần</li>
            </ul>
          </div >
        </div>

        <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
          {isQuiz &&
            <Image src="/images/arrow.gif" width={40} height={40} alt="arrow" style={{
              position: "absolute",
              animation: "bounce 2s infinite",
              right: -40,
              top: -40,
            }} />
          }
          <Image
            src="/images/section3.2.webp"
            alt="decorative"
            width={400}
            height={100}
            style={{
              border: isQuiz ? "4px solid #c64b4b" : "none",
            }}
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="relative w-[100vw] min-w-[100vw] px-12 py-8 flex-col bg-[#e94b59]" ref={triggerRef}>

        {/* Big title */}
        <div className="mt-4">
          <h1
            className="js-title text-[#efe6d0] font-extrabold leading-[1.2] tracking-tight"
            style={{ fontSize: "clamp(3rem, 7vw, 8.5rem)" }}
          >
            Hậu quả
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
          <div className="text-[#efe6d0] text-xl leading-8">
            <ul className="list-disc list-inside space-y-3 text-base">
              <li>Siêu lạm phát: 774% năm 1986, đồng tiền mất giá nghiêm trọng</li>
              <li>Thị trường hỗn loạn: Giá cả leo thang, cung hàng khan hiếm</li>
              <li>Đời sống khó khăn: Thu nhập thực giảm, thiếu thốn vật chất</li>
              <li>Sản xuất đình đốn: Doanh nghiệp quốc doanh thiếu vốn, vật tư</li>
              <li>Niềm tin suy giảm: Dân chúng lo lắng, mất niềm tin vào chính sách</li>
              <li>Thúc đẩy Đổi mới 1986: Cơ chế bao cấp bộc lộ bế tắc hoàn toàn</li>
            </ul>
          </div>
        </div>
        {inViewToShow &&
          <div className="absolute top-20 right-40 w-[500px] h-[500px] z-[99]">
            <MoneyCard3D frontImage="/images/money_1.webp" backImage="/images/money_2.webp" />
          </div>
        }
      </div>
      {isOpen &&
        <ViewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Quiz Time!"
        >
          <Image
            src="/images/section3.2.webp"
            alt="decorative"
            width={300}
            height={100}
            style={{
              margin: "0 auto"
            }}
          />
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Đây là Hội nghị nào của Đảng Cộng sản Việt Nam?</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSubmitQuiz("A")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                A. Hội nghị Trung ương 6 khóa IV
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("B")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                B. Hội nghị Trung ương 8 khóa V
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("C")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                C. Đại hội đại biểu toàn quốc lần thứ VI
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("D")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                D. Hội nghị Trung ương 5 khóa VII
              </button>
            </div>
          </div>
        </ViewModal>
      }
    </section >
  )
}

export default SectionChild3