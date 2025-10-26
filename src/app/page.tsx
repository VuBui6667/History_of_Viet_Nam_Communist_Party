"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Section1 from "./components/section1/Section1";
import Section5 from "./components/section5/Section5";
import Section2 from "./components/section2/Section2";
import Section3 from "./components/section3/Section2";
import Section4 from "./components/section4/Section4";

// const Section2 = dynamic(() => import('./components/section2/Section2'));
// const Section3 = dynamic(() => import('./components/section3/Section2'));
// const Section4 = dynamic(() => import('./components/section4/Section4'));

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

        {/* HORIZONTAL GROUP 1 — Section 5 */}
        <div className="horizontal-wrapper relative h-screen overflow-hidden">
          <div className="horizontal-container flex h-screen">
            {/* Each child must be full viewport width (w-screen) so container width = sum of children */}
            <Section5 />
          </div>
        </div>

        {/* HORIZONTAL GROUP 2 — behaves the same (scroll horizontal inside this group) */}
        <div className="horizontal-wrapper relative h-screen overflow-hidden">
          <div className="horizontal-container flex h-screen">
            <Section3 />
          </div>
        </div>

        {/* HORIZONTAL GROUP 3 — behaves the same (scroll horizontal inside this group) */}
        <div className="horizontal-wrapper relative h-screen overflow-hidden">
          <div className="horizontal-container flex h-screen">
            <Section4 />
          </div>
        </div>



        {/* FINAL SECTION — vertical */}
        <section className="relative h-screen">
          {/* Background Pattern */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#e94b59_100%)]"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4">
            <div className="max-w-3xl text-center">
              <h1 className="mb-8 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl text-black">
                <span className="text-[#e94b59]">Hoàn Thành!</span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-700">
                Bạn đã hoàn thành học phần. Chúc mừng và cảm ơn vì đã đồng hành cùng chúng tôi!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="rounded-lg px-6 py-3 font-medium bg-[#e94b59] text-white hover:bg-red-600" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                  Học lại
                </button>
                <button className="rounded-lg border px-6 py-3 font-medium border-slate-200 bg-white text-slate-900 hover:bg-slate-50" onClick={() =>
                  navigator.share
                    ? navigator.share({
                      title: "Hoàn thành",
                      text: "Mình vừa hoàn thành phần nội dung!",
                      url: window.location.href,
                    })
                    : alert("Sao chép link: " + window.location.href)
                }>
                  Chia sẻ
                </button>
              </div>
            </div>
            <p className="mt-6 text-sm opacity-90">— Trân trọng, VNR202 • Group 5 —</p>
          </div>
        </section>
      </div>
    </div>
  );
}
