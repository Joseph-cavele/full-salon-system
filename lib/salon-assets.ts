// Curated selections from /public/Assets — real salon photography.
// Grouped by the role each image plays on the marketing site so the hashed
// filenames stay out of JSX. (Watermarked / overlaid shots are intentionally
// excluded during curation.)
const asset = (file: string) => `/Assets/${file}`

export const salonImages = {
  /** Editorial hero portrait — long knotless braids. */
  hero: asset("8e79e5804a36e3969b4c148411d760ab.jpg"),

  /** Portrait accent used in the closing CTA band. */
  ctaPortrait: asset("6f1739833131b8596e9f259a47d16184.jpg"),

  /** Overlapping collage for the "why us" band. */
  collage: [
    asset("1e60d50b163af6c4acf12122730c6865.jpg"), // loc retwist, in the chair
    asset("9c4da6a37816c126b2dda8d8d62c9486.jpg"), // afro + sculpted beard
    asset("5d3f39333d17ffd5932ab7936a93e94c.jpg"), // coil texture, close up
  ],

  /** Mixed "recent work" gallery. */
  gallery: [
    { src: asset("23a95aa64290b8bac7bf047bfe12245c.jpg"), label: "Twists & Braids" },
    { src: asset("02ae5cbe906eb5a414d67e4c64fbc554.jpg"), label: "Curls & Fades" },
    { src: asset("0c0b1644a0cc29d0cd0db603f34d5b7f.jpg"), label: "Nail Artistry" },
    { src: asset("76b98164c809735eb05baded97d88d9a.jpg"), label: "Natural Cuts" },
    { src: asset("b8e7674c6ebad42e6a4f79bb3b5d7055.jpg"), label: "Barbering" },
    { src: asset("9b9bed10c73cbff86d8c17b3b2fc36f3.jpg"), label: "Nail Design" },
    { src: asset("15b587feda7162d924095f282f60059e.jpg"), label: "Grooming" },
    { src: asset("66bb64901b805bae731095695b0484e7.jpg"), label: "Press-On Sets" },
  ],
}
