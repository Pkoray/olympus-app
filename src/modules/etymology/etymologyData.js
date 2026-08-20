// Polytonic Ancient Greek orthography + linguistic root breakdowns for every
// character in the pantheon. Where scholarship is genuinely settled we give
// a Proto-Indo-European root; where it isn't (many hero and monster names
// are pre-Greek or disputed), the gloss says so honestly rather than
// inventing a false certainty. A character without an entry here simply
// doesn't render the <GreekWord> module (see CharacterPage.jsx /
// GodCard.jsx) — the same graceful-fallback pattern the app already uses
// for missing statue art.
//
// `morphemes` breaks compound names into their component roots (e.g.
// Prometheus = "pro-" + "-mētheus") so the etymology tooltip can highlight
// each fragment individually; simple names get a single morpheme spanning
// the whole word.

export const ETYMOLOGY = {
  chaos: {
    polytonic: 'Χάος',
    translit: 'Cháos',
    morphemes: [
      { gr: 'Χάος', pie: '*ǵʰeh₂w-', gloss: 'to gape, yawn open — "the vast gap"' },
    ],
  },
  gaia: {
    polytonic: 'Γαῖα',
    translit: 'Gaîa',
    morphemes: [{ gr: 'Γαῖα', pie: '*dʰǵʰem-', gloss: 'earth, ground' }],
  },
  nyx: {
    polytonic: 'Νύξ',
    translit: 'Nýx',
    morphemes: [{ gr: 'Νύξ', pie: '*nókʷts', gloss: 'night' }],
  },
  cronus: {
    polytonic: 'Κρόνος',
    translit: 'Krónos',
    morphemes: [
      { gr: 'Κρόνος', pie: '*ḱrno-', gloss: 'disputed — popularly folk-linked to χρόνος "time"' },
    ],
  },
  rhea: {
    polytonic: 'Ῥέα',
    translit: 'Rhéa',
    morphemes: [{ gr: 'Ῥέα', pie: '*srew-', gloss: 'to flow — "the flowing one"' }],
  },
  oceanus: {
    polytonic: 'Ὠκεανός',
    translit: 'Ōkeanós',
    morphemes: [{ gr: 'Ὠκεανός', pie: 'pre-Greek', gloss: 'the great world-encircling river' }],
  },
  atlas: {
    polytonic: 'Ἄτλας',
    translit: 'Átlas',
    morphemes: [{ gr: 'Ἄτλας', pie: '*telh₂-', gloss: 'to bear, endure, uphold' }],
  },
  prometheus: {
    polytonic: 'Προμηθεύς',
    translit: 'Promētheús',
    morphemes: [
      { gr: 'Προ-', pie: '*per-', gloss: 'before, forward' },
      { gr: 'μηθεύς', pie: '*men-', gloss: 'to think — together, "forethought"' },
    ],
  },
  zeus: {
    polytonic: 'Ζεύς',
    translit: 'Zeús',
    morphemes: [{ gr: 'Ζεύς', pie: '*dyḗus', gloss: 'to shine — the bright sky-god' }],
  },
  hera: {
    polytonic: 'Ἥρα',
    translit: 'Hḗra',
    morphemes: [{ gr: 'Ἥρα', pie: '*yeh₁-', gloss: 'disputed — perhaps "protectress" or "season/ripe one"' }],
  },
  poseidon: {
    polytonic: 'Ποσειδῶν',
    translit: 'Poseidôn',
    morphemes: [
      { gr: 'Πόσι-', pie: '*pótis', gloss: 'lord, husband' },
      { gr: 'δῶν', pie: '*dāwōn', gloss: 'earth (Mycenaean da-) — "lord of the earth/waters"' },
    ],
  },
  hades: {
    polytonic: 'ᾍδης',
    translit: 'Hā́idēs',
    morphemes: [{ gr: 'Ἀ-ϝιδής', pie: '*n̥-wid-', gloss: 'not + to see — "the unseen one"' }],
  },
  athena: {
    polytonic: 'Ἀθηνᾶ',
    translit: 'Athēnâ',
    morphemes: [{ gr: 'Ἀθηνᾶ', pie: 'pre-Greek', gloss: "of unknown origin — bound to the city's own name" }],
  },
  apollo: {
    polytonic: 'Ἀπόλλων',
    translit: 'Apóllōn',
    morphemes: [{ gr: 'Ἀπόλλων', pie: '*apelo-', gloss: 'disputed — linked to an assembly / "he who drives away"' }],
  },
  artemis: {
    polytonic: 'Ἄρτεμις',
    translit: 'Ártemis',
    morphemes: [{ gr: 'Ἄρτεμις', pie: '*h₂erǵ-', gloss: 'disputed — perhaps "bright, safe" or "bear goddess"' }],
  },
  ares: {
    polytonic: 'Ἄρης',
    translit: 'Árēs',
    morphemes: [{ gr: 'Ἄρης', pie: '*h₂erh₃-', gloss: 'to harm, destroy — "ruin, war"' }],
  },
  hermes: {
    polytonic: 'Ἑρμῆς',
    translit: 'Hermês',
    morphemes: [{ gr: 'Ἑρμῆς', pie: 'from ἕρμα', gloss: '"stone-heap, boundary marker" — god of the roadside cairn' }],
  },
  dionysus: {
    polytonic: 'Διόνυσος',
    translit: 'Diónysos',
    morphemes: [
      { gr: 'Διο-', pie: '*dyḗus', gloss: 'of Zeus' },
      { gr: 'νυσος', pie: 'Nysa', gloss: 'Mount Nysa, where the infant god was raised' },
    ],
  },
  hephaestus: {
    polytonic: 'Ἥφαιστος',
    translit: 'Hḗphaistos',
    morphemes: [{ gr: 'Ἥφαιστος', pie: 'pre-Greek', gloss: 'of unknown origin — god of the forge-fire' }],
  },
  aphrodite: {
    polytonic: 'Ἀφροδίτη',
    translit: 'Aphrodítē',
    morphemes: [{ gr: 'ἀφρός', pie: '*sph₂oi-', gloss: 'sea-foam — "she who rose from the foam"' }],
  },
  heracles: {
    polytonic: 'Ἡρακλῆς',
    translit: 'Hēraklês',
    morphemes: [
      { gr: 'Ἥρα-', pie: 'Hḗrā', gloss: 'the goddess Hera' },
      { gr: 'κλέος', pie: '*ḱléwos', gloss: 'glory, fame — "the glory of Hera"' },
    ],
  },
  perseus: {
    polytonic: 'Περσεύς',
    translit: 'Perseús',
    morphemes: [{ gr: 'πέρθειν', pie: '*perth₂-', gloss: 'to sack, destroy — "the destroyer"' }],
  },
  medusa: {
    polytonic: 'Μέδουσα',
    translit: 'Médousa',
    morphemes: [{ gr: 'μέδειν', pie: '*med-', gloss: 'to rule, protect — "the guardian, the queen"' }],
  },
  hecate: {
    polytonic: 'Ἑκάτη',
    translit: 'Hekátē',
    morphemes: [{ gr: 'Ἑκάτη', pie: '*swek-', gloss: 'far-reaching, worker from afar — "she who has power"' }],
  },
  sisyphus: {
    polytonic: 'Σίσυφος',
    translit: 'Sísyphos',
    morphemes: [{ gr: 'Σίσυφος', pie: 'pre-Greek', gloss: 'of uncertain origin — perhaps an intensive reduplication meaning "the very wise/cunning one"' }],
  },
  persephone: {
    polytonic: 'Περσεφόνη',
    translit: 'Persephónē',
    morphemes: [{ gr: 'Περσεφόνη', pie: 'pre-Greek', gloss: 'of disputed origin — later folk-linked to "bringer of destruction"' }],
  },
  demeter: {
    polytonic: 'Δημήτηρ',
    translit: 'Dēmḗtēr',
    morphemes: [
      { gr: 'Δᾶ-', pie: '*dʰǵʰem-', gloss: 'earth (Doric dā)' },
      { gr: 'μήτηρ', pie: '*méh₂tēr', gloss: 'mother — together, "Earth Mother"' },
    ],
  },
  hestia: {
    polytonic: 'Ἑστία',
    translit: 'Hestía',
    morphemes: [{ gr: 'Ἑστία', pie: '*wes-', gloss: 'to dwell, burn — "hearth, the burning home"' }],
  },
  pan: {
    polytonic: 'Πάν',
    translit: 'Pán',
    morphemes: [{ gr: 'Πάν', pie: '*peh₂-', gloss: 'to guard, pasture — "the herdsman" (later folk-linked to πᾶν "all")' }],
  },
  orpheus: {
    polytonic: 'Ὀρφεύς',
    translit: 'Orpheús',
    morphemes: [{ gr: 'Ὀρφεύς', pie: '*h₃rbʰ-', gloss: 'to change status, be bereft — "he who loses"' }],
  },
  typhon: {
    polytonic: 'Τυφῶν',
    translit: 'Typhôn',
    morphemes: [{ gr: 'τῦφος', pie: '*dʰuh₂bʰ-', gloss: 'smoke, whirlwind — the monster of storm and volcanic fume' }],
  },
  tantalus: {
    polytonic: 'Τάνταλος',
    translit: 'Tántalos',
    morphemes: [{ gr: 'ταλάσσαι', pie: '*telh₂-', gloss: 'to bear, suffer — fittingly, "the one who endures/totters"' }],
  },
  cassandra: {
    polytonic: 'Κασσάνδρα',
    translit: 'Kassándra',
    morphemes: [
      { gr: 'κεκασ-', pie: '*ḱed-', gloss: 'to excel, shine' },
      { gr: '-άνδρα', pie: '*h₂nḗr', gloss: 'man — "she who outshines men"' },
    ],
  },
  pandora: {
    polytonic: 'Πανδώρα',
    translit: 'Pandṓra',
    morphemes: [
      { gr: 'πᾶν', pie: '*peh₂-', gloss: 'all' },
      { gr: 'δῶρον', pie: '*deh₃-', gloss: 'gift — together, "the all-gifted one"' },
    ],
  },
  medea: {
    polytonic: 'Μήδεια',
    translit: 'Mḗdeia',
    morphemes: [{ gr: 'μήδεα', pie: '*med-', gloss: 'plans, cunning — "the cunning one"' }],
  },
  circe: {
    polytonic: 'Κίρκη',
    translit: 'Kírkē',
    morphemes: [{ gr: 'κίρκος', pie: 'pre-Greek', gloss: 'hawk/falcon — "the bird of prey"' }],
  },
  ariadne: {
    polytonic: 'Ἀριάδνη',
    translit: 'Ariádnē',
    morphemes: [
      { gr: 'ἀρι-', pie: '*h₂erh₁-', gloss: 'very, utterly (intensive prefix)' },
      { gr: '-άδνη', pie: 'pre-Greek', gloss: 'holy one — "the utterly holy/pure"' },
    ],
  },
  eros: {
    polytonic: 'Ἔρως',
    translit: 'Érōs',
    morphemes: [{ gr: 'ἔρος', pie: '*h₁erh₂-', gloss: 'to desire, love passionately' }],
  },

  // ── further primordials & underworld figures ──
  erebus: {
    polytonic: 'Ἔρεβος',
    translit: 'Érebos',
    morphemes: [{ gr: 'Ἔρεβος', pie: '*h₁regʷos', gloss: 'darkness (cf. Sanskrit rajas, Gothic riqis) — the shadow between earth and Hades' }],
  },
  tartarus: {
    polytonic: 'Τάρταρος',
    translit: 'Tártaros',
    morphemes: [{ gr: 'Τάρταρος', pie: 'pre-Greek', gloss: 'of uncertain, non-Indo-European origin — an expressive, reduplicated name for a pit deeper than Hades' }],
  },
  charon: {
    polytonic: 'Χάρων',
    translit: 'Chárōn',
    morphemes: [{ gr: 'χαροπός', pie: '*ǵʰer-', gloss: 'to gleam, glow — "grim/flashing-eyed one," the ferryman\'s fierce gaze' }],
  },
  thanatos: {
    polytonic: 'Θάνατος',
    translit: 'Thánatos',
    morphemes: [{ gr: 'θνῄσκω', pie: '*dʰwenh₂-', gloss: 'to vanish, die — death itself, twin of Hypnos' }],
  },
  hypnos: {
    polytonic: 'Ὕπνος',
    translit: 'Hýpnos',
    morphemes: [{ gr: 'Ὕπνος', pie: '*swep-no-', gloss: 'sleep (cf. Latin somnus, Sanskrit svápna)' }],
  },
  morpheus: {
    polytonic: 'Μορφεύς',
    translit: 'Morpheús',
    morphemes: [{ gr: 'μορφή', pie: 'pre-Greek', gloss: 'shape, form — "the shaper," who molds dreams into human likeness' }],
  },
  moirai: {
    polytonic: 'Μοῖραι',
    translit: 'Moîrai',
    morphemes: [{ gr: 'μοῖρα', pie: '*(s)mer-', gloss: 'to allot, assign a share — "the apportioners"' }],
  },
  nemesis: {
    polytonic: 'Νέμεσις',
    translit: 'Némesis',
    morphemes: [{ gr: 'νέμειν', pie: '*nem-', gloss: 'to distribute, dispense what is due — righteous retribution' }],
  },
  epimetheus: {
    polytonic: 'Ἐπιμηθεύς',
    translit: 'Epimētheús',
    morphemes: [
      { gr: 'Ἐπι-', pie: '*h₁epi', gloss: 'after, upon' },
      { gr: 'μηθεύς', pie: '*men-', gloss: 'to think — together, "afterthought," the mirror of his brother Prometheus' },
    ],
  },

  // ── heroes ──
  theseus: {
    polytonic: 'Θησεύς',
    translit: 'Thēseús',
    morphemes: [{ gr: 'τίθημι', pie: '*dʰeh₁-', gloss: 'to put, set in place — "he who institutes," the founder-king who unified Athens' }],
  },
  achilles: {
    polytonic: 'Ἀχιλλεύς',
    translit: 'Achilleús',
    morphemes: [
      { gr: 'ἄχος', pie: '*h₂egʰ-', gloss: 'grief, distress' },
      { gr: 'λαός', pie: 'pre-Greek', gloss: 'host, army, people — a proposed reading (Nagy): "grief of the host"' },
    ],
  },
  odysseus: {
    polytonic: 'Ὀδυσσεύς',
    translit: 'Odysseús',
    morphemes: [{ gr: 'ὀδύσσομαι', pie: 'uncertain', gloss: 'to be angered at, to hate — Homer\'s own folk etymology: "the one who suffers/causes wrath"' }],
  },
  daedalus: {
    polytonic: 'Δαίδαλος',
    translit: 'Daídalos',
    morphemes: [{ gr: 'δαιδάλλειν', pie: 'expressive reduplication', gloss: 'to work cunningly, fashion skillfully — root of δαίδαλον, "an intricate work"' }],
  },
  icarus: {
    polytonic: 'Ἴκαρος',
    translit: 'Íkaros',
    morphemes: [{ gr: 'Ἴκαρος', pie: 'pre-Greek', gloss: 'of uncertain origin — bound up with Icaria and the Icarian Sea, though which named which is unclear' }],
  },
  jason: {
    polytonic: 'Ἰάσων',
    translit: 'Iásōn',
    morphemes: [{ gr: 'ἰάομαι', pie: '*h₁yeh₂-', gloss: 'to heal — "the healer," raised and tutored by the centaur Chiron' }],
  },
  bellerophon: {
    polytonic: 'Βελλεροφόντης',
    translit: 'Bellerophóntēs',
    morphemes: [
      { gr: 'Βελλερο-', pie: 'uncertain', gloss: 'traditionally "Belleros," a shadowy Corinthian figure he was said to have slain' },
      { gr: '-φόντης', pie: '*gʷʰen-', gloss: 'to strike, slay — together, "slayer of Belleros"' },
    ],
  },
  atalanta: {
    polytonic: 'Ἀταλάντη',
    translit: 'Atalántē',
    morphemes: [{ gr: 'ἀτάλαντος', pie: '*telh₂-', gloss: 'to lift, weigh, bear — "of equal weight [to men]," the same root as Atlas' }],
  },
  oedipus: {
    polytonic: 'Οἰδίπους',
    translit: 'Oidípous',
    morphemes: [
      { gr: 'οἰδ-', pie: 'uncertain', gloss: 'to swell' },
      { gr: 'πούς', pie: '*pṓds', gloss: 'foot — together, "swollen-foot," from his pierced infant ankles' },
    ],
  },
  psyche: {
    polytonic: 'Ψυχή',
    translit: 'Psychḗ',
    morphemes: [{ gr: 'ψύχω', pie: '*bʰes-', gloss: 'to breathe, blow — "breath, soul, life"; the same word also means "butterfly" in Greek' }],
  },
  asclepius: {
    polytonic: 'Ἀσκληπιός',
    translit: 'Asklēpiós',
    morphemes: [{ gr: 'Ἀσκληπιός', pie: 'pre-Greek', gloss: 'of uncertain, likely pre-Greek origin — no secure Indo-European root is attested for the healer-god\'s name' }],
  },

  // ── monsters ──
  minotaur: {
    polytonic: 'Μινώταυρος',
    translit: 'Minṓtauros',
    morphemes: [
      { gr: 'Μίνως', pie: 'pre-Greek', gloss: 'King Minos of Crete' },
      { gr: 'ταῦρος', pie: '*táwros', gloss: 'bull — together, "the Bull of Minos"' },
    ],
  },
  cerberus: {
    polytonic: 'Κέρβερος',
    translit: 'Kérberos',
    morphemes: [{ gr: 'Κέρβερος', pie: '*ḱerberos', gloss: 'spotted, speckled (cf. Sanskrit karbura) — an Indo-European name shared with Yama\'s hounds in Vedic myth' }],
  },
  chimera: {
    polytonic: 'Χίμαιρα',
    translit: 'Chímaira',
    morphemes: [{ gr: 'χίμαρος', pie: '*ǵʰey-mn-', gloss: 'winter — literally "she-goat that has survived a winter, a yearling"' }],
  },
  hydra: {
    polytonic: 'Ὕδρα',
    translit: 'Hýdra',
    morphemes: [{ gr: 'ὕδωρ', pie: '*wódr̥', gloss: 'water — "the water-serpent"' }],
  },
  sirens: {
    polytonic: 'Σειρῆνες',
    translit: 'Seirênes',
    morphemes: [{ gr: 'σειρά', pie: 'pre-Greek', gloss: 'of disputed origin — one proposal ties it to "cord, chain," those who bind listeners with song' }],
  },
  sphinx: {
    polytonic: 'Σφίγξ',
    translit: 'Sphínx',
    morphemes: [{ gr: 'σφίγγειν', pie: '*speh₁ng-', gloss: 'to squeeze, strangle — "the strangler," true to how she killed' }],
  },
}
