function unsplash(id: string, width: number) {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`
}

export const stockPhotos = {
  hero: unsplash("1634449571010-02389ed0f9b0", 1200),
  salonInterior: unsplash("1521590832167-7bcbfaa6381f", 1200),
  gallery: [
    { src: unsplash("1605980766335-d3a41c7332a1", 600), label: "Balayage" },
    { src: unsplash("1623428455512-264b33ca8cec", 600), label: "Elegant Updo" },
    { src: unsplash("1568044852337-9bcc3378fc3c", 600), label: "Sleek & Straight" },
    { src: unsplash("1554519880-ffe46861d570", 600), label: "Textured Curls" },
    { src: unsplash("1503951914875-452162b0f3f1", 600), label: "Classic Fade" },
  ],
  stylistHeadshots: [
    unsplash("1569925444984-9e2e5fc3d1fb", 300),
    unsplash("1651684215020-f7a5b6610f23", 300),
    unsplash("1573496527892-904f897eb744", 300),
  ],
  // Fallback thumbnails per service category, used when a service has no image.
  serviceByCategory: {
    Hair: [
      unsplash("1605980766335-d3a41c7332a1", 400),
      unsplash("1568044852337-9bcc3378fc3c", 400),
      unsplash("1623428455512-264b33ca8cec", 400),
      unsplash("1554519880-ffe46861d570", 400),
      unsplash("1503951914875-452162b0f3f1", 400),
    ],
    Skin: [unsplash("1616394584738-fc6e612e71b9", 400)],
    Beauty: [unsplash("1636023730877-233b9237d4ec", 400)],
    Nail: [unsplash("1632345031435-8727f6897d53", 400)],
    Packages: [unsplash("1623428455512-264b33ca8cec", 400)],
  } as Record<string, string[]>,
}

/** Pick a stable fallback image for a service based on its category and index. */
export function serviceThumb(category: string | undefined, index: number) {
  const pool =
    stockPhotos.serviceByCategory[category ?? "Hair"] ??
    stockPhotos.serviceByCategory.Hair
  return pool[index % pool.length]
}
