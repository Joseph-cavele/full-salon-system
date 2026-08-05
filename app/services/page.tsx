import type { Metadata } from "next"

import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import { SiteOffers } from "@/components/site/site-offers"
import { SiteServiceCards } from "@/components/site/site-service-cards"
import { SiteServicesCatalog } from "@/components/site/site-services-catalog"
import { SiteServicesHero } from "@/components/site/site-services-hero"

export const metadata: Metadata = {
  title: "Services & Prices | Patrick Dreadlocks & Beauty",
  description:
    "Every service we offer and what it costs — locs, braids, cuts and wig work in Kempton Park. No hidden pricing.",
}

/**
 * Laid out to match the reference design: carousel hero, then the centred
 * "Our Services List" heading over a 3×2 grid of medallion cards, then the
 * footer.
 *
 * Two sections sit below that the reference has no equivalent for — the
 * discount cards, and the full nineteen-service price list. Both were asked
 * for separately and neither displaces anything from the reference layout,
 * so they follow it rather than interrupt it.
 */
export default function ServicesPage() {
  return (
    <div className="flex flex-1 flex-col bg-rose-ground text-rose-ink selection:bg-rose-accent selection:text-rose-surface">
      <SiteHeader active="Services" />

      <SiteServicesHero />
      <SiteServiceCards />

      <SiteOffers />

      <section className="pb-16 sm:pb-20">
        <SiteServicesCatalog />
      </section>

      <SiteFooter />
    </div>
  )
}
