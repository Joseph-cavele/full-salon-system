// The salon's real price list, in Rand.
//
// Hardcoded on purpose: these are the marketing page's published prices and
// they change rarely. The `Service` collection (lib/models/Service.ts, read via
// the cached features/services/server/get-services.ts) drives the *booking*
// flow instead. If the two ever need to agree, this file is the one to delete
// — not the other way round.

export type ServiceItem = {
  name: string
  /** Display string, ranges included — pricing clarity beats a single number. */
  price: string
}

export type ServiceCategory = {
  title: string
  items: ServiceItem[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    title: "Dreadlocks Services",
    items: [
      { name: "Dreadlocks Installation", price: "R1,000 – R1,500" },
      { name: "Starting Dreadlocks (Crochet Method)", price: "R1,000" },
      { name: "Wash & Crochet Dreadlocks", price: "R550 – R800" },
      { name: "Dreadlocks Wash, Twist & Style", price: "R350 – R450" },
      { name: "Bleaching Half Locks", price: "R350" },
      { name: "Dreadlocks Detox", price: "R250" },
      { name: "Black Dye Only", price: "R200" },
      { name: "Dreadlocks Wash Only", price: "R100" },
    ],
  },
  {
    title: "Beauty & Hair Services",
    items: [
      { name: "Long Braids", price: "R800 – R1,000" },
      { name: "Pixie Cut (First Time)", price: "R550" },
      { name: "Short Braids", price: "R500 – R650" },
      { name: "Wig Installation", price: "R400" },
      { name: "Straight Up", price: "R350" },
      { name: "Straight Back", price: "R300" },
      { name: "Dark & Lovely Relaxer", price: "R250" },
      { name: "Wig Removal", price: "R250" },
      { name: "Hair Cut & Dye", price: "R150" },
      { name: "Hair Cut Only", price: "R60" },
      { name: "Hair Wash Only", price: "R50" },
    ],
  },
]

export type FeaturedService = {
  name: string
  from: string
  description: string
  image: string
  alt: string
  /**
   * Aggregate score out of 5, and how many reviews it came from.
   *
   * Both are deliberately unset. The card renders its rating row only when
   * they are present, so the design's star line appears the moment there are
   * real reviews behind it and stays hidden until then — a score a customer
   * reads as other people's experience has to be other people's experience.
   * Set both together; one without the other renders nothing.
   */
  rating?: number
  reviewCount?: number
}

/** URL segment for a service's detail page. */
export const serviceSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

/**
 * The six that lead the section — three locs, three beauty & hair, so the
 * grid shows the full range rather than stacking one category.
 *
 * Every image here is deliberately absent from `galleryItems` below: the same
 * photo appearing as both a service card and a gallery tile reads as a thin
 * library rather than a curated one.
 */
export const featuredServices: FeaturedService[] = [
  {
    name: "Dreadlocks Installation",
    from: "From R1,000",
    description:
      "Starting your locs from scratch with the crochet method, sectioned and installed to grow evenly for years.",
    image: "/Assets/1e60d50b163af6c4acf12122730c6865.jpg",
    alt: "Stylist installing locs for a client in the chair",
  },
  {
    name: "Dreadlocks Detox",
    from: "R250",
    description:
      "A deep clarifying soak that strips product build-up and residue, leaving locs lighter and the scalp fresh.",
    image: "/Assets/5d3f39333d17ffd5932ab7936a93e94c.jpg",
    alt: "Close-up of clean, well-formed loc texture",
  },
  {
    name: "Long Braids",
    from: "From R800",
    description:
      "Knotless braids installed with even tension, sized and parted to sit comfortably for weeks.",
    image: "/Assets/e58c67cde794d63ac80d12159571bfcd.jpg",
    alt: "Feed-in braids gathered into a long braided bun",
  },
  {
    name: "Short Braids",
    from: "From R500",
    description:
      "Shoulder-length braids with curled ends — lighter on the scalp and quicker to install than a full set.",
    image: "/Assets/23a95aa64290b8bac7bf047bfe12245c.jpg",
    alt: "Shoulder-length braids finished with curled ends",
  },
  {
    name: "Pixie Cut",
    from: "From R550",
    description:
      "A sharp, low-maintenance cut shaped to your face and hairline, finished and styled in the chair.",
    image: "/Assets/76b98164c809735eb05baded97d88d9a.jpg",
    alt: "Finished natural short cut",
  },
  {
    name: "Wig Installation",
    from: "R400",
    description:
      "Secure, natural-looking installation with the hairline blended and the unit styled before you leave.",
    image: "/Assets/e912566638f34e2477dd703b48d238ab.jpg",
    alt: "Finished lace-front wig install styled in soft waves",
  },
]

/* ── Catalogue, for /services ──────────────────────────────────────────
   The two lists above answer different questions — `serviceCategories` is
   every service and its price, `featuredServices` is the six that have a
   photograph and a written description. The services page needs both at
   once: a card per service, richer where there is something to show.

   Joined here rather than in the page so the price list stays the single
   source of truth for *what is offered*. A service is on the page because
   it is in `serviceCategories`; attaching a photo is the only thing the
   featured list can do. Add a service to the price list and it appears on
   /services with a monogram until a photo exists for it. */

const FEATURED_ALIASES: Record<string, string> = {
  // The price list carries the qualifier, the featured entry doesn't. Aliased
  // rather than renaming either, since both names are correct in their place.
  "Pixie Cut (First Time)": "Pixie Cut",
}

const featuredByName = new Map(featuredServices.map((s) => [s.name, s]))

/* Photographs for the priced services that aren't in `featuredServices`.
   Keyed by the exact `serviceCategories` name.

   EVERY ENTRY HERE WAS OPENED AND LOOKED AT before being written down. The
   filenames in /public/Assets are content hashes — they carry no hint of what
   the picture shows, so choosing one by filename is pure guesswork, and a
   guess that lands a braids photo on the relaxer card is worse than no photo.
   The alt text below describes what is actually in each frame.

   Services deliberately absent, because nothing in the library was verifiably
   the right subject: "Hair Wash Only" and "Wig Removal". They keep their
   monogram until a real photo exists. A monogram is honest; a stand-in photo
   of something else is not. */
const CATALOG_PHOTOS: Record<string, { image: string; alt: string }> = {
  "Starting Dreadlocks (Crochet Method)": {
    image: "/Assets/0571f3e2b011cd0964d0b8261fab1735.jpg",
    alt: "Freshly started locs with clean, evenly spaced parts across the crown",
  },
  "Wash & Crochet Dreadlocks": {
    image: "/Assets/1b4710e79fbaa3275a07b96f877c29f4.jpg",
    alt: "Back of the head showing locs crocheted on a neat square grid",
  },
  "Dreadlocks Wash, Twist & Style": {
    image: "/Assets/835a3953a62b9bb539b8bd55e799a5ab.jpg",
    alt: "Shoulder-length locs twisted and finished with curled ends",
  },
  "Bleaching Half Locks": {
    image: "/Assets/15e1b70af00dafeb4f1d678bd2a7263b.jpg",
    alt: "Locs gathered up top with the lengths lightened to blonde",
  },
  "Black Dye Only": {
    image: "/Assets/5584e77ef2165d55f960b026a2cb452b.jpg",
    alt: "Deep black locs in a chin-length bob, freshly retwisted",
  },
  "Dreadlocks Wash Only": {
    image: "/Assets/19dc228ae41a347d697445ad3049a910.jpg",
    alt: "Locs soaking in a basin of lathered water during a wash",
  },
  "Straight Up": {
    image: "/Assets/68387beaa9b2292329c3f381e248e390.jpg",
    alt: "Cornrows braided upward into a patterned crown",
  },
  "Straight Back": {
    image: "/Assets/8e79e5804a36e3969b4c148411d760ab.jpg",
    alt: "Hair cornrowed straight back into evenly parted lengths",
  },
  "Dark & Lovely Relaxer": {
    image: "/Assets/2a25a0e7be900948e2d265050d2aff5f.jpg",
    alt: "Stylist sectioning and applying relaxer to a client's hair in the salon",
  },
  "Hair Cut & Dye": {
    image: "/Assets/7d136aaa81720ac2adcacbd977d35afe.jpg",
    alt: "Tapered cut coloured bright red with a shaved side design",
  },
  "Hair Cut Only": {
    image: "/Assets/40102959944e9d096009f8c4d8ffb54d.jpg",
    alt: "Client in the barber cape with a freshly shaped cut and line-up",
  },
}

export type CatalogItem = ServiceItem & {
  description?: string
  image?: string
  alt?: string
}

export type CatalogCategory = {
  title: string
  items: CatalogItem[]
}

export const serviceCatalog: CatalogCategory[] = serviceCategories.map(
  (category) => ({
    title: category.title,
    items: category.items.map((item) => {
      const featured = featuredByName.get(FEATURED_ALIASES[item.name] ?? item.name)

      if (featured) {
        return {
          ...item,
          description: featured.description,
          image: featured.image,
          alt: featured.alt,
        }
      }

      /* A checked photograph but no written copy — the card falls back to
         showing the price alone, which it already handles. */
      const photo = CATALOG_PHOTOS[item.name]
      return photo ? { ...item, image: photo.image, alt: photo.alt } : item
    }),
  })
)

/** Recent work, for the gallery grid. No overlap with the cards above. */
export const galleryItems = [
  { src: "/Assets/9c4da6a37816c126b2dda8d8d62c9486.jpg", label: "Cuts & Beards" },
  { src: "/Assets/0c0b1644a0cc29d0cd0db603f34d5b7f.jpg", label: "Nail Artistry" },
  { src: "/Assets/b8e7674c6ebad42e6a4f79bb3b5d7055.jpg", label: "Barbering" },
  { src: "/Assets/9b9bed10c73cbff86d8c17b3b2fc36f3.jpg", label: "Nail Design" },
  { src: "/Assets/15b587feda7162d924095f282f60059e.jpg", label: "Grooming" },
  { src: "/Assets/66bb64901b805bae731095695b0484e7.jpg", label: "Press-On Sets" },
]
