import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SwapNote from "../SwapNote";
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
      const isScored = answerType === "D";
      const data = await onSubmitQuiz({
        username,
        quizId: 2,
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
            <h2 className="text-2xl font-bold mb-4">Sai lầm nghiêm trọng nhất trong cách thức tiến hành cuộc tổng điều chỉnh giá – lương – tiền năm 1985 là gì, mà trực tiếp dẫn đến lạm phát phi mã và hỗn loạn kinh tế?</h2>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSubmitQuiz("A")}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                A. Chủ trương xóa bỏ cơ chế hai giá, vì không tính toán hết được sự chênh lệch lớn giữa giá Nhà nước và giá thị trường.
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("B")}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                B. Quy định mức tăng lương quá thấp so với đà tăng giá vật tư đầu vào, khiến đời sống công nhân viên chức không đảm bảo.
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("C")}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                C. Quyết định hạn mức đổi tiền tối đa cho mỗi gia đình, gây thiệt hại lớn cho những hộ có tiền tiết kiệm
              </button>

              <button
                type="button"
                onClick={() => handleSubmitQuiz("D")}
                disabled={isLoading}
                className="w-full text-left px-4 py-3 bg-white rounded shadow hover:bg-gray-100"
              >
                D. Vội vàng đổi tiền và in thêm tiền lớn để bù giá vào lương, do đó vi phạm nguyên tắc cơ bản là tiền tệ phát hành phải có hàng hóa đối ứng.
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
          style={{ backgroundImage: "url('/images/section5.2.png')", willChange: "transform" }}
        />

        {isQuiz &&
          <img
            src="/images/circle.gif"
            className="absolute bottom-[200px] left-[100px] z-[20] pointer-events-none w-80"
          />
        }

        {isQuiz &&
          <div className="absolute w-[200px] h-[200px] bottom-[160px] left-[140px] z-[999]" onClick={() => setIsOpen(true)} />
        }

        <div className="absolute z-[99] w-[92%] max-w-[1100px] text-center left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
          <h1
            ref={titleRef}
            className="mt-4 font-extrabold leading-[1.2] text-[clamp(36px,8vw,110px)] tracking-[-0.08em] uppercase text-[#f2eadf] relative max-w-[1100px] drop-shadow-[0_6px_18px_rgba(0,0,0,0.7)]"
            style={{ willChange: "transform" }}
          >
            Ba trụ cột của
            <br />
            chính sách
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
      <div className="w-[100vw] h-screen flex items-center justify-center bg-green-900/40 relative">
        <img src="/images/hand.gif" className="absolute top-12 right-20" />
        <div className="flex flex-1">
          <p className="text-xl w-[300px] min-w-[300px]">{`"`}Mục tiêu cốt lõi của cải cách là nhằm xóa bỏ cơ chế tập trung quan liêu bao cấp về giá cả, tiền lương và tiền tệ, để chuyển sang cơ chế hạch toán kinh doanh xã hội chủ nghĩa.{`"`}</p>
          <img src="/images/arrow.gif" className="mx-auto rotate-180" />
        </div>
        <SwapNote
          titles={["Về Giá Cả", "Về Lương bổng", "Về Tiền Tệ"]}
          notes={[
            "1. Xóa bỏ cơ chế hai giá: Chuyển sang thực hiện chế độ một giá trong toàn bộ hệ thống kinh tế quốc dân. \n2. Giá tính đủ chi phí: Xác định lại giá cả các mặt hàng theo nguyên tắc giá phải tính đủ chi phí sản xuất, kinh doanh hợp lý, đảm bảo doanh nghiệp có lãi và có tích lũy.",
            "1. Bù giá vào lương: Thực hiện tăng lương để bù đắp vào phần giá cả mới được xác định, nhằm đảm bảo người ăn lương có thể sống chủ yếu bằng tiền lương (tái sản xuất sức lao động). \n2. Cải cách thang bảng lương: Điều chỉnh lại thang bảng lương cho công nhân, viên chức và lực lượng vũ trang.",
            "1. Ổn định lưu thông tiền tệ: Thu hồi tiền cũ và phát hành tiền mới để đáp ứng nhu cầu thanh toán của giá mới và lương mới. \n2. Đổi tiền: Chủ trương đổi tiền với tỉ lệ: 10 đồng tiền cũ đổi lấy 1 đồng tiền mới."
          ]}
        />
      </div>
    </section>
  );
};

export default SectionChild2;
