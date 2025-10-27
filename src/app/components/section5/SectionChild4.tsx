import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { useInView } from "react-intersection-observer"
import cn from "@/utils"

const SectionChild3: React.FC = () => {
  const sectionRef1 = useRef<HTMLDivElement | null>(null)

  const sectionRef2 = useRef<HTMLDivElement | null>(null)

  const sectionRef3 = useRef<HTMLDivElement | null>(null)

  const { ref: triggerRef1, inView: inView1 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: triggerRef2, inView: inView2 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: triggerRef3, inView: inView3 } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    if (!sectionRef1.current || !inView1) return

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
    }, sectionRef1)

    return () => ctx.revert()
  }, [inView1])

  useEffect(() => {
    if (!sectionRef2.current || !inView2) return

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
    }, sectionRef2)

    return () => ctx.revert()
  }, [inView2])

  useEffect(() => {
    if (!sectionRef3.current || !inView3) return

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
    }, sectionRef3)

    return () => ctx.revert()
  }, [inView3])

  return (
    <section className="w-full min-w-[150vw] h-screen flex relative bg-[#0b0b0b]">
      {/* PANEL 1 */}
      <div ref={triggerRef1} />
      <div
        ref={sectionRef1}
        className={cn("relative z-[20] w-[50%] px-12 py-8 flex flex-col", inView1 ? "" : "opacity-0")}
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
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>Các Bộ, ngành và địa phương phải xây dựng lại bảng giá phù hợp với thực tế.</li>
                <li>Tuy nhiên, do chưa có sự thống nhất về giá đầu vào – đầu ra, nên việc thực hiện thiếu đồng bộ, méo mó, không triệt để.</li>
              </ul>
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Sai lầm trọng yếu:
              </span>
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>Giá vẫn bị can thiệp hành chính, không phản ánh đúng chi phí thực tế.</li>
                <li>Chính sách giá không theo tín hiệu thị trường, gây rối loạn cung – cầu, mất cân đối hàng hóa.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <img src="/images/arrow.gif" className="absolute w-20 h-auto left-[40vw] bottom-40 rotate-180" />
      <div ref={triggerRef2} />
      {/* PANEL 2 */}
      <div ref={sectionRef2} className="relative w-[50%] bg-green-900/40 px-12 py-8 flex-col">

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
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>Mức lương danh nghĩa tăng lên 100% so với kế hoạch ban đầu.</li>
                <li>Để đáp ứng nhu cầu chi trả, Nhà nước buộc phải in thêm một lượng lớn tiền, vượt quá khả năng cung ứng hàng hóa.</li>
              </ul>
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Sai lầm trọng yếu:
              </span>
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>In tiền để giải quyết lương và ngân sách mà không có hàng hóa đối ứng, gây ra lạm phát cao.</li>
                <li>Chính sách “bù giá vào lương” mất tác dụng nhanh chóng, đời sống người dân không được cải thiện thực chất.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <img src="/images/arrow.gif" className="absolute w-20 h-auto left-[90vw] bottom-40 rotate-180" />

      <div ref={triggerRef3} />
      {/* PANEL 3 */}
      <div ref={sectionRef3} className="relative w-[50%] bg-[#e94b59] px-12 py-8 flex-col">

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
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>Đổi tiền đột ngột vào ngày 14/9/1985, trong thời gian ngắn (gọi là “đổi tiền vội vàng”).</li>
                <li>Quy định hạn mức đổi tiền tối đa cho mỗi gia đình chỉ từ 1.500 – 2.000 đồng tiền mới.</li>
              </ul>
            </div>
            <div className="mb-4 inline-block font-light">
              <span className="inline-block font-bold mr-1">
                Sai lầm trọng yếu:
              </span>
              <ul className="list-disc list-inside space-y-2 text-xl mt-2">
                <li>Việc quản lý hành chính quá cứng nhắc trong đổi tiền gây khủng hoảng niềm tin trong dân chúng.</li>
                <li>Tiền mới nhanh chóng mất giá, lạm phát bùng nổ, niềm tin vào Nhà nước bị ảnh hưởng nghiêm trọng.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section >
  )
}

export default SectionChild3