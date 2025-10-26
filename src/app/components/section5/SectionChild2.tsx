import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useInView } from 'react-intersection-observer'
import { usePathname } from 'next/navigation'
import cn from '@/utils'

const SectionChild2: React.FC = () => {
  const pathname = usePathname()
  const isQuiz = pathname === '/quiz'

  const containerRef = useRef<HTMLDivElement | null>(null)
  const h1Ref = useRef<HTMLHeadingElement | null>(null)
  const scribbleRef = useRef<SVGSVGElement | null>(null)
  const imagesRef = useRef<Array<HTMLElement | null>>([])
  const h2Ref = useRef<HTMLHeadingElement | null>(null)
  const accentRef = useRef<SVGSVGElement | null>(null)

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  // combine refs for inView detection and container

  useEffect(() => {
    if (!inView) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // overall container fade/scale in
      tl.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
      })

      // H1 reveal: split lines feel by staggering characters/lines
      tl.from(
        h1Ref.current,
        {
          y: 40,
          opacity: 0,
          duration: 0.9,
          skewY: 2,
        },
        '-=0.4'
      )

      // decorative scribble: quick pop+rotate
      tl.from(
        scribbleRef.current,
        {
          opacity: 0,
          scale: 0.6,
          rotate: -10,
          transformOrigin: '50% 50%',
          duration: 0.7,
        },
        '-=0.6'
      )

      // image thumbnails: staggered pop + slight rotation
      tl.from(
        imagesRef.current,
        {
          scale: 0.85,
          y: 20,
          opacity: 0,
          rotate: 2,
          transformOrigin: '50% 50%',
          duration: 0.7,
          stagger: 0.12,
        },
        '-=0.6'
      )

      // large bottom heading
      tl.from(
        h2Ref.current,
        {
          y: 30,
          opacity: 0,
          duration: 0.9,
        },
        '-=0.5'
      )

      // small red accent w/ bounce
      tl.fromTo(
        accentRef.current,
        { y: 10, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'bounce.out' },
        '-=0.5'
      )

      return () => {
        tl.kill()
      }
    }, containerRef)

    return () => ctx.revert()
  }, [inView])

  // images seeds for map + ref assignment
  const seeds = [
    { src: 'https://picsum.photos/seed/pen1/360/240', alt: 'historic illustration 1' },
    { src: 'https://picsum.photos/seed/pen2/360/240', alt: 'historic illustration 2' },
    { src: 'https://picsum.photos/seed/pen3/360/240', alt: 'historic interior' },
  ]

  return (
    <div className="min-w-[90vw] w-full bg-[#f1eada] h-full">
      <div
        ref={containerRef}
        className={`relative h-full flex flex-col items-center justify-center text-black p-8 ${inView ? '' : 'opacity-0'}`}
      >
        {/* main hero heading */}
        <h1
          ref={h1Ref}
          className="text-[3.5rem] md:text-[6rem] lg:text-[6rem] font-extrabold leading-none text-center -tracking-tighter select-none"
        >
          Bối cảnh kinh tế - xã hội
          <br />
          trước cải cách
        </h1>

        {/* decorative scribble top-right */}
        <svg
          ref={scribbleRef}
          className="absolute top-10 right-12 w-16 h-12 text-[#e94b59] opacity-90"
          viewBox="0 0 100 60"
          fill="none"
        >
          <path d="M5 40 C20 10, 40 10, 60 30 S90 50, 95 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* three image thumbnails */}
        <div className="flex gap-6 my-8 items-center justify-center">
          {seeds.map((s, i) => (
            <figure
              key={s.src}
              ref={(el: any) => (imagesRef.current[i] = el)}
              className="w-36 md:w-56 bg-white/90 border border-black/10 shadow-sm"
            >
              <img src={s.src} alt={s.alt} className="w-full h-auto object-cover" />
            </figure>
          ))}
        </div>
        <div ref={inViewRef} />

        {/* large bottom heading */}
        <h2
          ref={h2Ref}
          className="mt-6 text-[2.5rem] font-extrabold leading-[1.4] text-center select-none"
        >
          Sau năm 1975, Việt Nam áp dụng mô hình kinh tế kế hoạch hóa tập trung bao cấp, trong đó Nhà nước kiểm soát giá cả, tiền lương và phân phối hàng hóa. Hàng tiêu dùng được cấp phát bằng
          <span className={cn(isQuiz ? "text-red-500" : "text-inherit")}> tem phiếu</span>
          , tiền lương không phản ánh giá trị thực do giá cả thấp và khan hiếm hàng hóa.
        </h2>

        {/* small red accent near bottom text */}
        <svg
          ref={accentRef}
          className="absolute bottom-20 left-3 w-10 h-10 text-[#e94b59]"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path d="M3 12c4 6 10 6 18 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

export default SectionChild2