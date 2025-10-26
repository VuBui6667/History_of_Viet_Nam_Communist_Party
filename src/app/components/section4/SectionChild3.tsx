import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { usePathname } from "next/navigation";
import ViewModal from "../ViewModal";
import { onSubmitQuiz } from "@/lib/utils";
import { toast } from "react-toastify";

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

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmitQuiz = async (answerType: string) => {
    if (isLoading) return;
    setIsLoading(true);

    const toastId = toast.loading("Đang gửi câu trả lời...");

    try {
      const username = localStorage.getItem("username") || "Guest";
      const isScored = answerType === "A";
      const data = await onSubmitQuiz({
        username,
        quizId: 5,
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
            <h2 className="text-2xl font-bold mb-4">Thất bại của cuộc cải cách &quot;giá - lương - tiền&quot; năm 1985 (biểu hiện qua sự kiện đổi tiền hỗn loạn) được xem là nguyên nhân trực tiếp và quyết định nhất thúc đẩy Đại hội VI (12/1986) phải thông qua chủ trương cốt lõi nào của Đường lối Đổi Mới?</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSubmitQuiz("A")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                A. Chấm dứt cơ chế tập trung quan liêu bao cấp, chuyển sang phát triển kinh tế hàng hóa nhiều thành phần.
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("B")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                B. Phải đặt mục tiêu xây dựng nền quốc phòng toàn dân gắn liền với an ninh nhân dân.
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("C")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                C. Phát triển nông nghiệp là mặt trận hàng đầu và áp dụng Khoán 10 trong nông nghiệp.
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("D")}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                D. Đẩy mạnh công tác xây dựng Đảng vững mạnh về chính trị, tư tưởng và tổ chức.
              </button>
            </div>
          </div>
        </ViewModal>
      }
      <div className="relative w-[100vw] flex items-center bg-gradient-to-r from-green-900/40 to-green-900/40">
        <div
          ref={bgRef}
          role="presentation"
          aria-hidden={true}
          className="absolute inset-0 bg-cover bg-center z-[10] filter brightness-75 contrast-75 pointer-events-none"
          style={{ backgroundImage: "url('/images/section4.3.webp')", willChange: "transform" }}
        />

        {isQuiz &&
          <img
            src="/images/circle.gif"
            className="absolute top-24 right-24 z-[20] pointer-events-none"
          />
        }

        {isQuiz &&
          <div className="absolute w-[300px] h-[60px] top-[120px] right-[140px] z-[20]" onClick={() => setIsOpen(true)} />
        }

        <div className="absolute z-[99] w-[92%] max-w-[1100px] text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <div className="mb-2">
            <div
              ref={yearRef}
              className="text-2xl font-bold tracking-wide opacity-95"
              style={{ willChange: "transform" }}
            >
              ĐẠI HỘI VI (12/1986)
            </div>
          </div>

          <h1
            ref={titleRef}
            className="mt-4 font-extrabold leading-[1.2] text-[clamp(36px,8vw,110px)] tracking-[-0.08em] uppercase text-[#f2eadf] relative max-w-[1100px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
            style={{ willChange: "transform" }}
          >
            KHỞI XƯỚNG ĐƯỜNG LỐI
            <br />
            ĐỔI MỚI TOÀN DIỆN
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
      <div className="w-[50vw] h-screen flex items-center justify-center bg-green-900/40 relative">
        <img src="/images/hand.gif" className="absolute top-12 right-20" />
        <div className="max-w-[40rem] px-8 py-12 text-[#f2eadf]">
          <ul className="list-disc list-inside space-y-4 text-2xl leading-relaxed">
            <li className="font-semibold">Tự phê bình nghiêm túc: nhìn thẳng vào sự thật, chỉ rõ những sai lầm chủ quan, duy ý chí kéo dài (1975-1986).</li>
            <li>Chấm dứt cơ chế bao cấp: xóa bỏ cơ chế tập trung quan liêu hành chính bao cấp.</li>
            <li>Chuyển sang kinh tế hàng hóa nhiều thành phần: vận hành theo cơ chế thị trường có sự quản lý của Nhà nước.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default SectionChild2;
