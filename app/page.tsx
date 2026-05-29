import Script from 'next/script'
import Nav from '@/components/landing/Nav'
import Hero from '@/components/landing/Hero'
import Ticker from '@/components/landing/Ticker'
import HowItWorks from '@/components/landing/HowItWorks'
import Manifesto from '@/components/landing/Manifesto'
import Testimonial from '@/components/landing/Testimonial'
import FooterCTA from '@/components/landing/FooterCTA'
import SiteFooter from '@/components/landing/SiteFooter'

export default function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <HowItWorks />
      <Manifesto />
      <Testimonial />
      <FooterCTA />
      <SiteFooter />
      <Script id="scroll-reveal" strategy="afterInteractive">{`
        const obs = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
      `}</Script>
    </>
  )
}
