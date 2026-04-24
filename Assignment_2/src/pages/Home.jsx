import React from "react"

function Home() {
  return (
    <main>
      <Hero />
      <div id="icon">
        <img src="/images/home_page.jpg" alt="Icon" />
      </div>
    </main>
  )
}

const Hero = () => (
  <section className="hero">
    <div className="hero__content">
      <h1 className="hero__title">Rental Search</h1>
      <p className="hero__subtitle">
        Welcome to the Rental Search portal. Click on Properties to see
        the available listings, or choose Filters to narrow down your search.
      </p>
    </div>
  </section>
)

export default Home