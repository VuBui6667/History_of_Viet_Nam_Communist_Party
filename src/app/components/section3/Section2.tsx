import React from 'react'
import SectionChild2 from './SectionChild2'
import SectionChild1 from './SectionChild1'
import SectionChild3 from './SectionChild3'

const Section3 = () => {
  return (
    <section className="panel flex items-center h-screen text-white text-6xl font-bold border-t border-black/60 w-fit">
      {/* SECTION 2.1 */}
      <SectionChild1 />

      {/* SECTION 2.3 */}
      <SectionChild3 />

      {/* SECTION 2.2 */}
      <SectionChild2 />

    </section>
  )
}

export default Section3