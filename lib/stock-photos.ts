// All photography is served locally from /public (Pexels shots of real salon work).
export const photos = {
  cornrows: "/pexels-amir-abbaspoor-748889438-19872868.jpg",
  vanityMirror: "/pexels-artbovich-7750122.jpg",
  salonFloor: "/pexels-artbovich-7750131.jpg",
  pedicureLounge: "/pexels-atikah-4967906.jpg",
  luxeInterior: "/pexels-atikah-4974566.jpg",
  definedCurls: "/pexels-bruce-taylor-322737340-28935716.jpg",
  sleekBun: "/pexels-claytonsgallary-30276780.jpg",
  colourService: "/pexels-cottonbro-3993323.jpg",
  boxBraids: "/pexels-cottonbro-7190007.jpg",
  glamMakeup: "/pexels-el-gringo-photo-116752370-36288139.jpg",
  naturalGlow: "/pexels-gabriella-ally-3664539-13733669.jpg",
  fauxLocs: "/pexels-heyy-kazz-705792-31682625.jpg",
  silkPress: "/pexels-junnysema-16826323.jpg",
  gelManicure: "/pexels-mariia-belinska-1093383493-30294773.jpg",
  washBasin: "/pexels-oleksandra-23349900.jpg",
  washLather: "/pexels-oleksandra-23349905.jpg",
  nailArt: "/pexels-oswal-darks-523820192-16363470.jpg",
  barberFade: "/pexels-th2city-2035227.jpg",
}

export const stockPhotos = {
  hero: photos.cornrows,
  salonInterior: photos.vanityMirror,
  interiorWide: photos.luxeInterior,
  gallery: [
    { src: photos.boxBraids, label: "Box Braids" },
    { src: photos.fauxLocs, label: "Faux Locs" },
    { src: photos.silkPress, label: "Silk Press" },
    { src: photos.definedCurls, label: "Defined Curls" },
    { src: photos.sleekBun, label: "Sleek & Sculpted" },
  ],
  stylistHeadshots: [photos.definedCurls, photos.glamMakeup, photos.naturalGlow],
  // Fallback thumbnails per service category, used when a service has no image.
  // Keys must match SERVICE_CATEGORIES in features/services/schema.ts. A
  // category with no entry here falls through to the default pool below
  // rather than rendering a broken image, so a mismatch degrades quietly —
  // check here first if a service tile shows the wrong kind of hair.
  serviceByCategory: {
    Dreadlocks: [photos.fauxLocs, photos.definedCurls, photos.washBasin],
    Braids: [photos.boxBraids, photos.cornrows],
    "Cuts & Styling": [photos.barberFade, photos.silkPress, photos.sleekBun],
    Treatments: [photos.washLather, photos.colourService],
    Wigs: [photos.sleekBun, photos.silkPress],
  } as Record<string, string[]>,
}

/** Pick a stable fallback image for a service based on its category and index. */
export function serviceThumb(category: string | undefined, index: number) {
  const pool =
    (category ? stockPhotos.serviceByCategory[category] : undefined) ??
    stockPhotos.serviceByCategory.Dreadlocks
  return pool[index % pool.length]
}
