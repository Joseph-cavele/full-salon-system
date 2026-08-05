import { serviceCatalog } from "./salon-services"

/* ══════════════════════════════════════════════════════════════════════
   PROMOTIONAL OFFERS — this is a public pricing claim, so read this
   before changing it.

   Nothing here invents a price. `OFFER_SERVICES` names services from the
   real price list in salon-services.ts, and the sale price is *computed*
   from the published one — so the struck-through "was" figure is the price
   the salon actually charges, not an inflated number that makes the
   discount look bigger than it is. Change the discount or the service list
   and both figures follow automatically.

   BEFORE THIS GOES PUBLIC: set `OFFER_VALID_UNTIL`. An open-ended "50% off"
   with no end date is a standing commitment to that price, and it is the
   kind of thing a customer can reasonably hold the salon to months later.
   It is `null` by default and the UI simply omits the line rather than
   printing a date nobody chose — an invented deadline would be worse than
   no deadline at all.
   ══════════════════════════════════════════════════════════════════════ */

export const OFFER_DISCOUNT_PERCENT = 50

/**
 * When the promotion ends, e.g. "31 August 2026". Left `null` until the
 * salon decides — the offers section hides its validity line while unset.
 */
export const OFFER_VALID_UNTIL: string | null = null

/**
 * Any conditions that apply, e.g. "New clients only. Cannot be combined
 * with other offers." Hidden while `null`.
 */
export const OFFER_TERMS: string | null = null

/**
 * Which services are on offer. Each name must match a service in
 * `serviceCategories` exactly, and that service must have a photograph —
 * both are enforced below, at module load, so a typo fails the build
 * instead of quietly shipping an offers section with a card missing.
 */
const OFFER_SERVICES = [
  "Dreadlocks Installation",
  "Long Braids",
  "Wig Installation",
]

export type Offer = {
  name: string
  /** The published price, straight from the price list. */
  price: string
  /** The published price with the discount applied. */
  salePrice: string
  description: string
  image: string
  alt: string
}

/** Matches the "R1,000" / "1,000" grouping the price list already uses. */
const withCommas = (value: number) =>
  value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

/**
 * Applies the discount to every Rand figure in a price string, so ranges
 * ("R1,000 – R1,500") come back as ranges ("R500 – R750") rather than
 * collapsing to a single number.
 */
export function applyDiscount(price: string, percent = OFFER_DISCOUNT_PERCENT) {
  return price.replace(/R\s?([\d,]+)/g, (_match, amount: string) => {
    const value = Number(amount.replace(/,/g, ""))
    return `R${withCommas(Math.round((value * (100 - percent)) / 100))}`
  })
}

const catalogItems = serviceCatalog.flatMap((category) => category.items)

export const offers: Offer[] = OFFER_SERVICES.map((name) => {
  const item = catalogItems.find((candidate) => candidate.name === name)

  /* Loud on purpose. These two throws run at build time, and a promotion
     that silently loses a card — or renders one with no picture — is a
     pricing bug in front of customers. Better to stop the build. */
  if (!item) {
    throw new Error(
      `salon-offers: no service named "${name}" in the price list. ` +
        `Valid names: ${catalogItems.map((i) => i.name).join(", ")}`
    )
  }

  if (!item.image || !item.description) {
    throw new Error(
      `salon-offers: "${name}" has no photograph or description, so it cannot ` +
        `be an offer card. Add it to featuredServices in salon-services.ts first.`
    )
  }

  return {
    name: item.name,
    price: item.price,
    salePrice: applyDiscount(item.price),
    description: item.description,
    image: item.image,
    alt: item.alt ?? "",
  }
})
