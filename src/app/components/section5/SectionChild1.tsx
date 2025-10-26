import React from 'react'

const SectionChild1 = () => {
  const topRef = React.useRef<HTMLDivElement | null>(null)
  const line1Ref = React.useRef<HTMLDivElement | null>(null)
  const line2Ref = React.useRef<HTMLDivElement | null>(null)
  const bottomRef = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    let ctx: any
    let mounted = true
    let observer: IntersectionObserver | null = null

    const elementToObserve = line1Ref.current

    if (elementToObserve) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (!entry || !entry.isIntersecting) return

          // when in view, dynamically import gsap and run animations once
          import('gsap')
            .then((mod) => {
              if (!mounted) return
              const gsap = (mod && (mod.gsap || mod.default)) || mod
              ctx = gsap.context(() => {
                gsap.set([topRef.current, line1Ref.current, line2Ref.current, bottomRef.current], {
                  autoAlpha: 0
                })

                // longer entrance for the top label
                gsap.fromTo(
                  topRef.current,
                  { y: -30, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 1.6, ease: 'power3.out' }
                )

                // slower, more pronounced pop for the big lines
                gsap.fromTo(
                  [line1Ref.current, line2Ref.current],
                  { y: 100, scale: 0.95, autoAlpha: 0 },
                  {
                    y: 0,
                    scale: 1,
                    autoAlpha: 1,
                    duration: 2.0,
                    ease: 'elastic.out(1,0.6)',
                    stagger: 0.18
                  }
                )

                // slower bottom reveal with increased delay
                gsap.fromTo(
                  bottomRef.current,
                  { y: 30, autoAlpha: 0 },
                  { y: 0, autoAlpha: 1, duration: 1.4, delay: 1.0, ease: 'power3.out' }
                )

                // gentler, longer looping breathe on big text
                gsap.to([line1Ref.current, line2Ref.current], {
                  scale: 1.02,
                  duration: 6,
                  yoyo: true,
                  repeat: -1,
                  ease: 'sine.inOut',
                  delay: 2.4
                })
              }, elementToObserve) // scope to observed element (optional)

              // once started, we don't need the observer anymore
              if (observer) {
                observer.disconnect()
                observer = null
              }
            })
            .catch(() => { })
        },
        { threshold: 0.35 }
      )

      observer.observe(elementToObserve)
    }

    return () => {
      mounted = false
      if (observer) observer.disconnect()
      if (ctx && ctx.revert) ctx.revert()
    }
  }, [])
  return (
    <div className="min-w-[80vw] w-full bg-[#e94b59] border-t border-black">
      <div className="relative h-screen flex flex-col items-center justify-center text-black">
        <div
          ref={topRef}
          className="absolute top-8 left-0 right-0 text-center text-xs md:text-sm uppercase tracking-widest font-bold transform -translate-y-8 opacity-0"
        >
          PERIOD 2
        </div>

        <div className="flex flex-col gap-8 items-center justify-center leading-[1.2] select-none">
          <div
            ref={line1Ref}
            className="text-[8rem] md:text-[14rem] lg:text-[9rem] font-extrabold leading-none transform translate-y-24 scale-95 opacity-0"
            aria-hidden
          >
            Nội Dung Và Cách Thức
          </div>

          <div
            ref={line2Ref}
            className="text-[8rem] md:text-[14rem] lg:text-[9rem] font-extrabold leading-none transform translate-y-24 scale-95 opacity-0"
            aria-hidden
          >
            Tiến Hành Cải Cách
          </div>
        </div>
      </div>
    </div>
  )
}

export default SectionChild1