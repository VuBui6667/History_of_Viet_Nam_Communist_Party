import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const Section1: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const headingRef = useRef<HTMLDivElement | null>(null)
  const subRef = useRef<HTMLDivElement | null>(null)
  const chapterRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
  ]

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline()
    // small helper to create a typing tween that appends characters
    const type = (el: HTMLDivElement | null, text: string, duration = 1.2) => {
      if (!el) return
      el.textContent = ''
      const obj = { i: 0 }
      tl.to(obj, {
        i: text.length,
        duration,
        ease: 'none',
        onUpdate: () => {
          const n = Math.floor(obj.i)
          el.textContent = text.substr(0, n)
        },
      })
      // small pause after each typed piece
      tl.to({}, { duration: 0.15 })
    }

    // SAFELY read the final texts we want to animate
    type(headingRef.current, 'Công Cuộc Cải Cách Về Giá - Lương - Tiền', 2.2)
    type(
      subRef.current,
      'Vì sao công cuộc cải cách về giá - lương - tiền lại đưa nền kinh tế VN vào hỗn loạn? \n Bài học gì rút ra từ cuộc cải cách xương máu này?',
      1.8
    )

    const chapterTexts = [
      'Bối cảnh và lý do tiến hành cải cách',
      'Nội dung và cách thức tiến hành cải cách',
      'Hậu quả và nguyên nhân thất bại',
      'Bài học và ý nghĩa lịch sử',
    ]

    chapterRefs.forEach((r, i) => {
      // add slight stagger/duration increase so each chapter types after the previous
      type(r.current, chapterTexts[i], 0.9 + i * 0.2)
    })

    // Parallax scroll animations via ScrollTrigger
    if (sectionRef.current) {
      const baseTrigger = {
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      }

      // heading moves slower (parallax)
      if (headingRef.current) {
        gsap.to(headingRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: { ...baseTrigger },
        })
      }

      // sub moves slightly in opposite direction
      if (subRef.current) {
        gsap.to(subRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: { ...baseTrigger },
        })
      }

      // chapters each get slightly different parallax amounts
      chapterRefs.forEach((r, i) => {
        if (r.current) {
          gsap.to(r.current, {
            y: -30 - i * 12, // pixel offset; adjust to taste
            ease: 'none',
            scrollTrigger: { ...baseTrigger },
          })
        }
      })
    }

    return () => {
      tl.kill()
      // kill all scroll triggers created by this component
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="h-[110vh] min-h-screen bg-[#efe8db] text-[#0b0b0b] py-8 md:py-12 relative"
    >
      <header className="flex justify-between items-start mb-8 px-8 md:px-12">
        <div className="text-sm uppercase tracking-wider text-gray-600">VNR202 • Group 5</div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 items-start mb-12 px-8 md:px-12">
        <div className="lg:col-span-2">
          <div
            ref={headingRef}
            className="font-extrabold leading-[1] text-black text-[64px] md:text-[120px] whitespace-pre-wrap"
            aria-hidden
          />
        </div>

        <div className="lg:col-span-1 mt-8">
          <p
            ref={subRef}
            className="max-w-md text-right text-2xl text-gray-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 border-y border-black/60 absolute bottom-0 left-0 right-0 w-full">
        {[
          { label: '01', ref: chapterRefs[0], color: '#e94b59' },
          { label: '02', ref: chapterRefs[1], color: '#e94b59' },
          { label: '03', ref: chapterRefs[2], color: '#e94b59' },
          { label: '04', ref: chapterRefs[3], color: '#e94b59' },
        ].map((c, i) => (
          <div key={i} className="relative p-6 border border-black/30 min-h-[346px]" style={{ background: c.color }}>
            <div className="absolute top-4 left-4 text-lg font-bold">{c.label}</div>
            <div
              ref={c.ref}
              className="font-extrabold text-3xl md:text-4xl lg:text-5xl mt-10 text-align-justify leading-tight text-center"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Section1