import React from 'react'

function Hero({ targetRef, color, title, description, children, isBig }) {
  return (
    <section className="ds-hero" ref={targetRef}>
      <div className="ds-hero-content flex flex-col text-center">
        <div className="max-w-md">
          <h1
            className={`${isBig ? 'text-3xl' : 'text-xl'} font-bold ${color === 'secondary' ? 'text-secondary' : 'text-primary'}`}
          >
            {title}
          </h1>
          <p className="py-3">{description}</p>
        </div>
        {children}
      </div>
    </section>
  )
}

export default Hero
