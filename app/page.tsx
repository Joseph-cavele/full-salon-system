import { SiteFooter } from "@/components/site/site-footer"
import { SiteGallery } from "@/components/site/site-gallery"
import { SiteHeader } from "@/components/site/site-header"
import { SiteHero } from "@/components/site/site-hero"
import { SiteAbout } from "@/components/site/site-about"
import { SiteContact } from "@/components/site/site-contact"
import { SiteServices } from "@/components/site/site-services"
import { SiteTestimonials } from "@/components/site/site-testimonials"
import { SiteWhyUs } from "@/components/site/site-why-us"

/**
 * Section-by-section rebuild. Done: navbar, hero, services, about, why us,
 * gallery, testimonials. Backgrounds alternate deliberately — rose-ground,
 * white, pink gradient, white, rose-ground — so each section reads as its own
 * band without a divider.
 */
export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-rose-ground text-rose-ink selection:bg-rose-accent selection:text-rose-surface">
      <SiteHeader active="Home" logoHref="/login" />

      <SiteHero />
      <SiteServices />
      <SiteAbout />
      <SiteWhyUs />
      <SiteGallery />
      <SiteTestimonials />
      <SiteContact />

      <SiteFooter />
    </div>
  )
}
