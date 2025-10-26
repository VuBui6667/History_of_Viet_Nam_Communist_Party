import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SwapNote from "../SwapNote";
import { usePathname } from "next/navigation";
import ViewModal from "../ViewModal";

const SectionChild2: React.FC = () => {
  const pathname = usePathname()
  const isQuiz = pathname === '/quiz'
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const yearRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const scribbleRef = useRef<SVGPathElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v));

    const onScroll = () => {
      if (!sectionRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = sectionRef.current!.getBoundingClientRect();
          const sectionCenterX = rect.left + rect.width / 2;
          const viewportCenterX = window.innerWidth / 2;
          const progress = clamp((sectionCenterX - viewportCenterX) / (window.innerWidth / 2));

          // multipliers increased for visible effect
          const bgX = progress * 80;
          const titleX = progress * 160;
          const yearX = progress * 100;
          const scribbleX = progress * 110;
          const scribbleRot = progress * 10;

          if (bgRef.current) {
            gsap.to(bgRef.current, { x: bgX, ease: "power3.out", overwrite: true, duration: 0.6 });
          }
          if (titleRef.current) {
            gsap.to(titleRef.current, { x: titleX, ease: "power3.out", overwrite: true, duration: 0.6 });
          }
          if (yearRef.current) {
            gsap.to(yearRef.current, { x: yearX, ease: "power3.out", overwrite: true, duration: 0.6 });
          }
          if (scribbleRef.current) {
            gsap.to(scribbleRef.current, {
              x: scribbleX,
              rotation: scribbleRot,
              transformOrigin: "50% 50%",
              ease: "power3.out",
              overwrite: true,
              duration: 0.6,
            });
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gsap.killTweensOf([bgRef.current, titleRef.current, yearRef.current, scribbleRef.current]);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-w-[150vw] w-full min-h-screen flex bg-black"
    >
      {isOpen &&
        <ViewModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Quiz Time!"
        >
          <div className="p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Sự kiện đổi tiền trong cuộc cải cách &quot;giá - lương - tiền&quot; năm 1985, được minh họa qua hình ảnh, đã trực tiếp vi phạm Bài học xương máu nào, dẫn đến hậu quả lạm phát phi mã và hỗn loạn kinh tế?</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                A. Bài học về việc phải kết hợp hài hòa kế hoạch với thị trường.
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                B. Bài học về việc phải tôn trọng quy luật kinh tế khách quan và giải phóng sản xuất.
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                C. Bài học về việc phải thực hiện cải cách một cách đồng bộ và có bước đi thận trọng.
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                D. Bài học về việc kiềm chế lạm phát phải là ưu tiên hàng đầu bằng công cụ kinh tế.
              </button>
            </div>
          </div>
        </ViewModal>
      }
      <div className="relative w-[100vw] flex items-center bg-gradient-to-r from-[#e94b59] to-green-900/40">
        <div
          ref={bgRef}
          role="presentation"
          aria-hidden={true}
          className="absolute inset-0 bg-cover bg-center z-[10] filter brightness-75 contrast-75 pointer-events-none"
          style={{ backgroundImage: "url('/images/section4.2.webp')", willChange: "transform" }}
        />

        {isQuiz &&
          <img
            src="/images/arrow.gif"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 z-[20] pointer-events-none"
          />
        }

        {isQuiz &&
          <div className="absolute w-[600px] h-[60px] bottom-0 left-1/2 transform -translate-x-1/2 z-[20]" onClick={() => setIsOpen(true)} />
        }

        <div className="absolute z-[99] w-[92%] max-w-[1100px] text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <div className="mb-2">
            <div
              ref={yearRef}
              className="text-2xl font-bold tracking-wide opacity-95"
              style={{ willChange: "transform" }}
            >
              1985
            </div>
          </div>

          <h1
            ref={titleRef}
            className="mt-4 font-extrabold leading-[1.2] text-[clamp(36px,8vw,110px)] tracking-[-0.08em] uppercase text-[#f2eadf] relative max-w-[1100px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
            style={{ willChange: "transform" }}
          >
            BÀI HỌC XƯƠNG MÁU TỪ THẤT BẠI CẢI CÁCH
            <br />
            GIÁ - LƯƠNG - TIỀN
            <span
              className="block absolute left-1/2 -translate-x-1/2 bottom-[-18px] w-[86%] h-[36px] pointer-events-none"
              aria-hidden
            >
              <svg viewBox="0 0 400 40" preserveAspectRatio="none" className="w-full h-full">
                <path
                  ref={scribbleRef}
                  d="M10 20 C50 10, 90 30, 130 18 C170 6, 210 30, 250 18 C290 6, 330 30, 390 20"
                  stroke="#e24b5a"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  style={{ willChange: "transform" }}
                />
              </svg>
            </span>
          </h1>
        </div>
      </div>
      <div className="w-[50vw] h-screen flex items-center justify-center bg-green-900/40">
        <SwapNote
          notes={["Tôn trọng Quy luật Kinh tế Khách quan: Không áp đặt hành chính không thể chỉ \"kiểm soát tiền\" mà phải giải quyết gốc rễ là thiếu hàng hóa và giải phóng sản xuất.", "Cải cách phải Đồng bộ và Thận trọng: Thiếu chuẩn bị dẫn đến thất bại phải có lộ trình rõ ràng, thực hiện đồng bộ giữa các lĩnh vực và không được vội vàng.", "Ưu tiên Kiềm chế Lạm phát: Kiểm soát Tiền tệ không in tiền để \"bù giá vào lương\". Phải sử dụng hiệu quả các công cụ kinh tế vĩ mô như lãi suất để kiểm soát lượng tiền lưu thông và ổn định giá cả.", "Kết hợp hài hòa Kế hoạch và Thị trường: Không duy ý chí cần thừa nhận và vận dụng các quy luật của kinh tế hàng hóa, không đầu tư tràn lan, chỉ dựa vào ý chí chủ quan."]}
        />
      </div>
    </section>
  );
};

export default SectionChild2;
