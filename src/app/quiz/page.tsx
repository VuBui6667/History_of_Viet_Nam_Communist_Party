"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Section1 from "../components/section1/Section1";
import Section2 from "../components/section2/Section2";
import Section3 from "../components/section3/Section2";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function ScrollHorizontalPage() {
  useEffect(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
    });

    const wrappers = gsap.utils.toArray<HTMLElement>(".horizontal-wrapper");
    if (!wrappers.length) {
      return () => {
        smoother?.kill?.();
      };
    }

    const tweens: gsap.core.Tween[] = [];

    wrappers.forEach((wrapper) => {
      const container = wrapper.querySelector<HTMLElement>(".horizontal-container");
      if (!container) return;

      const totalScroll = () => Math.max(container.scrollWidth - window.innerWidth, 0);

      const tween = gsap.to(container, {
        x: () => -totalScroll(),
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: () => `+=${totalScroll()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
      smoother?.kill?.();
    };
  }, []);

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        {/* SECTION 1 — vertical */}
        <Section1 />

        {/* HORIZONTAL GROUP 1 — Section 2 */}
        <div className="horizontal-wrapper relative h-screen overflow-hidden">
          <div className="horizontal-container flex h-screen">
            {/* Each child must be full viewport width (w-screen) so container width = sum of children */}
            <Section2 />
          </div>
        </div>

        {/* HORIZONTAL GROUP 2 — behaves the same (scroll horizontal inside this group) */}
        <div className="horizontal-wrapper relative h-screen overflow-hidden">
          <div className="horizontal-container flex h-screen">
            <Section3 />
          </div>
        </div>

        <section className="h-[100vh] flex items-center justify-center bg-gradient-to-br from-indigo-600 to-pink-500 text-white p-8">
          <div className="max-w-xl text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-4xl font-extrabold mb-2">Cảm ơn bạn!</h2>
            <p className="mb-6 text-lg leading-relaxed">
              Bạn đã hoàn thành phần nội dung. Chúc mừng và cảm ơn vì đã đồng hành cùng chúng tôi!
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90"
              >
                Quay lên đầu
              </button>

              <button
                onClick={() =>
                  navigator.share
                    ? navigator.share({
                      title: "Hoàn thành",
                      text: "Mình vừa hoàn thành phần nội dung!",
                      url: window.location.href,
                    })
                    : alert("Sao chép link: " + window.location.href)
                }
                className="border border-white/60 px-5 py-2 rounded-lg hover:bg-white/10"
              >
                Chia sẻ
              </button>
            </div>

            <p className="mt-6 text-sm opacity-90">— Trân trọng, VNR202 • Group 5 —</p>
          </div>
        </section>
      </div>
    </div>
  );
}
