// Star coordinates live in a shared 2000×640 canvas/SVG space (see
// <ConstellationSky>, which lays the viewBox out so all five figures sit
// side by side and the whole thing scales responsively).
//
// `stars` is ordered as a sensible "walk" through the figure — that same
// order is reused to derive a smooth Catmull-Rom spine curve for the
// illustrated silhouette overlay (see `catmullRomPath` below), so the
// silhouette always relates coherently to the real star layout instead of
// being disconnected freehand art.

export function catmullRomPath(points) {
  if (points.length < 2) return ''
  const p = points
  let d = `M ${p[0].x} ${p[0].y} `
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[i + 2] ?? p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y} `
  }
  return d.trim()
}

export const CONSTELLATIONS = [
  {
    id: 'orion',
    nameEn: 'Orion',
    nameTr: 'Orion',
    epithetEn: 'The Hunter',
    epithetTr: 'Avcı',
    stars: [
      { id: 'bellatrix', x: 300, y: 130 },
      { id: 'betelgeuse', x: 160, y: 120 },
      { id: 'mintaka', x: 190, y: 300 },
      { id: 'alnilam', x: 225, y: 315 },
      { id: 'alnitak', x: 260, y: 330 },
      { id: 'rigel', x: 310, y: 495 },
      { id: 'saiph', x: 165, y: 480 },
    ],
    edges: [
      ['betelgeuse', 'bellatrix'],
      ['betelgeuse', 'mintaka'],
      ['bellatrix', 'alnitak'],
      ['mintaka', 'alnilam'],
      ['alnilam', 'alnitak'],
      ['mintaka', 'saiph'],
      ['alnitak', 'rigel'],
    ],
    mythEn:
      'A giant hunter of unmatched skill, Orion boasted he could slay every beast on earth. Offended, Gaia sent a scorpion to end him. Zeus placed him among the stars — but forever fleeing Scorpius, which still rises as Orion sets, so the two are never seen together.',
    mythTr:
      'Eşi benzeri olmayan bir avcı olan Orion, yeryüzündeki her canavarı öldürebileceğiyle övünürdü. Bundan rahatsız olan Gaia, onu sona erdirmesi için bir akrep gönderdi. Zeus onu yıldızlar arasına yerleştirdi — ama sonsuza dek Akrep takımyıldızından kaçarcasına; Akrep doğarken Orion hâlâ batar, bu yüzden ikisi asla birlikte görülmez.',
  },
  {
    id: 'pegasus',
    nameEn: 'Pegasus',
    nameTr: 'Pegasos',
    epithetEn: 'The Winged Horse',
    epithetTr: 'Kanatlı At',
    stars: [
      { id: 'enif', x: 580, y: 420 },
      { id: 'homam', x: 540, y: 380 },
      { id: 'markab', x: 470, y: 320 },
      { id: 'scheat', x: 470, y: 150 },
      { id: 'alpheratz', x: 720, y: 150 },
      { id: 'algenib', x: 720, y: 330 },
    ],
    edges: [
      ['markab', 'scheat'],
      ['scheat', 'alpheratz'],
      ['alpheratz', 'algenib'],
      ['algenib', 'markab'],
      ['markab', 'homam'],
      ['homam', 'enif'],
    ],
    mythEn:
      'Born from the blood of Medusa when Perseus struck off her head, the winged Pegasus later carried the hero Bellerophon into battle against the Chimera. When Bellerophon grew too proud and tried to fly to Olympus itself, Zeus sent a gadfly to unseat him — but Pegasus flew on, and the King of the Gods gave him a stable among the stars.',
    mythTr:
      "Perseus, Medusa'nın başını kestiğinde akan kanından doğan kanatlı Pegasos, sonradan kahraman Bellerophontes'i Khimera'ya karşı savaşa taşıdı. Bellerophontes kibirlenip bizzat Olympos'a uçmaya kalkışınca Zeus onu düşürmek için bir at sineği gönderdi — ama Pegasos uçmaya devam etti ve tanrıların kralı ona yıldızlar arasında bir ahır bağışladı.",
  },
  {
    id: 'cassiopeia',
    nameEn: 'Cassiopeia',
    nameTr: 'Kassiopeia',
    epithetEn: 'The Vain Queen',
    epithetTr: 'Kibirli Kraliçe',
    stars: [
      { id: 'caph', x: 880, y: 300 },
      { id: 'schedar', x: 950, y: 180 },
      { id: 'gamma', x: 1010, y: 260 },
      { id: 'ruchbah', x: 1070, y: 170 },
      { id: 'segin', x: 1130, y: 280 },
    ],
    edges: [
      ['caph', 'schedar'],
      ['schedar', 'gamma'],
      ['gamma', 'ruchbah'],
      ['ruchbah', 'segin'],
    ],
    mythEn:
      'Queen of Aethiopia, Cassiopeia boasted that her own beauty outshone that of the sea nymphs. Poseidon, angered on their behalf, sent a monster to ravage her coast, forcing her to chain her daughter Andromeda to a rock as sacrifice. Placed among the stars as punishment for her vanity, Cassiopeia is condemned to circle the celestial pole upside-down for half of every year.',
    mythTr:
      "Aethiopia Kraliçesi Kassiopeia, kendi güzelliğinin deniz perilerini bile geride bıraktığını söyleyerek övünmüştü. Onların adına öfkelenen Poseidon, kıyısını yağmalaması için bir canavar gönderdi ve kraliçe, kızı Andromeda'yı kurban olarak bir kayaya zincirlemek zorunda kaldı. Kibrinin cezası olarak yıldızlar arasına yerleştirilen Kassiopeia, her yılın yarısında baş aşağı bir şekilde göğün kutbunun etrafında dönmeye mahkûm edildi.",
  },
  {
    id: 'ursaMajor',
    nameEn: 'Ursa Major',
    nameTr: 'Büyük Ayı',
    epithetEn: 'The Great Bear',
    epithetTr: 'Büyük Ayı',
    stars: [
      { id: 'alkaid', x: 1540, y: 150 },
      { id: 'mizar', x: 1480, y: 190 },
      { id: 'alioth', x: 1420, y: 210 },
      { id: 'megrez', x: 1340, y: 220 },
      { id: 'dubhe', x: 1220, y: 180 },
      { id: 'merak', x: 1220, y: 280 },
      { id: 'phecda', x: 1320, y: 300 },
    ],
    edges: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'dubhe'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
    ],
    mythEn:
      'Callisto, a nymph loved by Zeus, was transformed into a bear by a jealous Hera. Years later her own son Arcas, out hunting, nearly killed the bear without knowing it was his mother. To prevent the tragedy, Zeus swept them both into the heavens — Callisto as the Great Bear, forever circling the pole she can never set below.',
    mythTr:
      "Zeus'un sevdiği bir peri olan Kallisto, kıskanç Hera tarafından bir ayıya dönüştürüldü. Yıllar sonra oğlu Arkas, ava çıktığında, onun annesi olduğunu bilmeden ayıyı öldürmenin eşiğine geldi. Bu trajediyi önlemek için Zeus ikisini de göğe yerleştirdi — Kallisto, asla kutbun altına batmayan Büyük Ayı olarak sonsuza dek döner.",
  },
  {
    id: 'draco',
    nameEn: 'Draco',
    nameTr: 'Draco',
    epithetEn: 'The Dragon',
    epithetTr: 'Ejderha',
    stars: [
      { id: 'eltanin', x: 1620, y: 150 },
      { id: 'rastaban', x: 1660, y: 180 },
      { id: 'grumium', x: 1700, y: 160 },
      { id: 'kappaDra', x: 1650, y: 260 },
      { id: 'alwaid', x: 1700, y: 320 },
      { id: 'draco6', x: 1760, y: 360 },
      { id: 'draco7', x: 1820, y: 340 },
      { id: 'thuban', x: 1880, y: 280 },
    ],
    edges: [
      ['eltanin', 'rastaban'],
      ['rastaban', 'grumium'],
      ['grumium', 'kappaDra'],
      ['kappaDra', 'alwaid'],
      ['alwaid', 'draco6'],
      ['draco6', 'draco7'],
      ['draco7', 'thuban'],
    ],
    mythEn:
      'Ladon, the hundred-headed serpent, coiled endlessly around the golden apple tree of the Hesperides, set to guard it by Hera herself. It fell only to Heracles, who slew it during his eleventh labor. In gratitude for its long, faithful watch, Hera lifted the dragon into the northern sky, where it still winds between the two bears.',
    mythTr:
      "Yüz başlı yılan Ladon, bizzat Hera tarafından bekçilik etmesi için görevlendirildiği Hesperidlerin altın elma ağacının etrafını durmaksızın sarardı. Yalnızca on birinci işini yerine getiren Herakles'e yenik düştü. Uzun ve sadık nöbeti için minnettar kalan Hera, ejderhayı kuzey göğüne yükseltti; orada hâlâ iki ayı arasında kıvrılır.",
  },
]
