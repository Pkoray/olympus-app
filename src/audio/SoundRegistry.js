// Modular soundscape registry for the Web Audio spatial engine.
//
// Every texture here — Zeus's thunder, Poseidon's swells, a bronze coin
// clink — is synthesized on the fly from oscillators, filters and generated
// noise buffers. No external audio files are fetched or bundled: this keeps
// the app dependency-free, licence-free, and instant to load, while still
// giving each entity a genuinely distinct sonic identity (see the mood note
// above each engine below). `AudioContext.jsx` owns the single AudioContext
// instance and calls into this registry to build/cleanup voices and one-shot
// effects; nothing here creates its own AudioContext.

const noiseCache = new WeakMap()

function getNoiseBuffer(ac, color = 'white', seconds = 4) {
  let cache = noiseCache.get(ac)
  if (!cache) {
    cache = {}
    noiseCache.set(ac, cache)
  }
  if (cache[color]) return cache[color]

  const length = Math.floor(ac.sampleRate * seconds)
  const buffer = ac.createBuffer(1, length, ac.sampleRate)
  const data = buffer.getChannelData(0)

  if (color === 'brown') {
    let last = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
  } else if (color === 'pink') {
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.969 * b2 + white * 0.153852
      b3 = 0.8665 * b3 + white * 0.3104856
      b4 = 0.55 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.016898
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      b6 = white * 0.115926
      data[i] = pink * 0.11
    }
  } else {
    for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1
  }

  cache[color] = buffer
  return buffer
}

function makeNoiseSource(ac, color, destination) {
  const src = ac.createBufferSource()
  src.buffer = getNoiseBuffer(ac, color)
  src.loop = true
  src.connect(destination)
  src.start()
  return src
}

function cleanupOnEnded(...nodes) {
  nodes[0].onended = () => nodes.forEach((n) => { try { n.disconnect() } catch { /* noop */ } })
}

// ─────────────────────────── ambient voice engines ───────────────────────────

/** Default warm pad — the original procedural chord+LFO voice used by every
 *  entity that doesn't have a bespoke engine below. */
function buildDrone(ac, out, profile) {
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  // Raised well above the stored profile value and de-resonated (lower Q):
  // at the original 250–900Hz cutoffs this pad read as dull/muffled. This
  // keeps each character's tonal identity (still driven by `profile.filter`)
  // while letting enough high end through to sound clear.
  filter.frequency.value = (profile.filter ?? 900) * 1.6
  filter.Q.value = 0.5
  filter.connect(out)

  const nodes = [filter]
  ;(profile.chord ?? [1, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = profile.type ?? 'sine'
    osc.frequency.value = (profile.base ?? 110) * ratio
    osc.detune.value = i === 0 ? 0 : i % 2 === 0 ? 6 : -6
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.9 : 0.45
    osc.connect(g)
    g.connect(filter)
    osc.start()
    nodes.push(osc, g)
  })

  // A very quiet high overtone for "air" — without it, low-Q lowpass pads
  // can still read as boxy even after brightening the main cutoff.
  const air = ac.createOscillator()
  air.type = 'sine'
  air.frequency.value = (profile.base ?? 110) * 4
  const airGain = ac.createGain()
  airGain.gain.value = 0.05
  air.connect(airGain)
  airGain.connect(out)
  air.start()
  nodes.push(air, airGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.07
  const lfoGain = ac.createGain()
  lfoGain.gain.value = profile.lfoDepth ?? 140
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Titans (Cronus, Atlas): deep seismic earth rumble + grinding ancient stone. */
function buildRumble(ac, out, profile) {
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = profile.filter ?? 220
  filter.Q.value = 0.4
  filter.connect(out)
  const nodes = [filter, makeNoiseSource(ac, 'brown', filter)]

  const sub = ac.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = profile.base ?? 40
  const subGain = ac.createGain()
  subGain.gain.value = 0.55
  sub.connect(subGain)
  subGain.connect(filter)
  sub.start()
  nodes.push(sub, subGain)

  const grind = ac.createOscillator()
  grind.type = 'sawtooth'
  grind.frequency.value = (profile.base ?? 40) * 2.01
  const grindFilter = ac.createBiquadFilter()
  grindFilter.type = 'bandpass'
  grindFilter.frequency.value = 180
  grindFilter.Q.value = 6
  const grindGain = ac.createGain()
  grindGain.gain.value = 0.16
  grind.connect(grindFilter)
  grindFilter.connect(grindGain)
  grindGain.connect(filter)
  grind.start()
  nodes.push(grind, grindFilter, grindGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.05
  const lfoGain = ac.createGain()
  lfoGain.gain.value = profile.lfoDepth ?? 60
  lfo.connect(lfoGain)
  lfoGain.connect(filter.frequency)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Nyx: ethereal cosmic void drone + a subtle whispering night breeze. */
function buildVoid(ac, out, profile) {
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = profile.filter ?? 260
  droneFilter.connect(out)
  const nodes = [droneFilter]

  ;[1, 2.003, 3.01].forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 44) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.7 : 0.2
    osc.connect(g)
    g.connect(droneFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const breeze = ac.createBiquadFilter()
  breeze.type = 'bandpass'
  breeze.frequency.value = 1400
  breeze.Q.value = 0.6
  const breezeGain = ac.createGain()
  breezeGain.gain.value = 0.045
  breeze.connect(breezeGain)
  breezeGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', breeze), breeze, breezeGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.045
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.04
  lfo.connect(lfoGain)
  lfoGain.connect(breezeGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Zeus: a genuine recurring lightning strike — sharp crack + rolling
 *  thunder tail — over a quiet atmospheric hum, so the strike itself (not
 *  the background pad) is the dominant, recognizable sound. */
function buildThunder(ac, out, profile) {
  const nodes = []
  const hum = ac.createOscillator()
  hum.type = 'sawtooth'
  hum.frequency.value = profile.base ?? 82
  const humFilter = ac.createBiquadFilter()
  humFilter.type = 'lowpass'
  humFilter.frequency.value = profile.filter ?? 500
  const humGain = ac.createGain()
  humGain.gain.value = 0.14
  hum.connect(humFilter)
  humFilter.connect(humGain)
  humGain.connect(out)
  hum.start()
  nodes.push(hum, humFilter, humGain)

  const rumbleFilter = ac.createBiquadFilter()
  rumbleFilter.type = 'lowpass'
  rumbleFilter.frequency.value = 260
  const rumbleGain = ac.createGain()
  rumbleGain.gain.value = 0.22
  rumbleFilter.connect(rumbleGain)
  rumbleGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'brown', rumbleFilter), rumbleFilter, rumbleGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.09
  const lfoGain = ac.createGain()
  lfoGain.gain.value = profile.lfoDepth ? profile.lfoDepth / 1000 : 0.3
  lfo.connect(lfoGain)
  lfoGain.connect(rumbleGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  const strikeTimer = setInterval(() => {
    if (Math.random() > 0.75) return
    const t0 = ac.currentTime + Math.random() * 0.3

    // The strike: an instant bright crack.
    const crack = ac.createBufferSource()
    crack.buffer = getNoiseBuffer(ac, 'white')
    const cf = ac.createBiquadFilter()
    cf.type = 'highpass'
    cf.frequency.value = 1400
    const cg = ac.createGain()
    cg.gain.setValueAtTime(0.0001, t0)
    cg.gain.exponentialRampToValueAtTime(0.5, t0 + 0.006)
    cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16)
    crack.connect(cf)
    cf.connect(cg)
    cg.connect(out)
    crack.start(t0)
    crack.stop(t0 + 0.2)
    cleanupOnEnded(crack, cf, cg)

    // The rolling thunder that follows a beat later.
    const t1 = t0 + 0.12
    const tail = ac.createBufferSource()
    tail.buffer = getNoiseBuffer(ac, 'brown')
    const tf = ac.createBiquadFilter()
    tf.type = 'lowpass'
    tf.frequency.value = 240
    const tg = ac.createGain()
    tg.gain.setValueAtTime(0.0001, t1)
    tg.gain.exponentialRampToValueAtTime(0.5, t1 + 0.3)
    tg.gain.exponentialRampToValueAtTime(0.0001, t1 + 2.4)
    tail.connect(tf)
    tf.connect(tg)
    tg.connect(out)
    tail.start(t1)
    tail.stop(t1 + 2.5)
    cleanupOnEnded(tail, tf, tg)
  }, 4200)
  nodes.push({ stop: () => clearInterval(strikeTimer) })

  return nodes
}

/** Poseidon: deep ocean swells that periodically crest and break — a real
 *  recurring wave crash, not just a static hum. */
function buildOcean(ac, out, profile) {
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = profile.filter ?? 500
  filter.Q.value = 1.2
  const swellGain = ac.createGain()
  swellGain.gain.value = 0.5
  filter.connect(swellGain)
  swellGain.connect(out)
  const nodes = [filter, swellGain, makeNoiseSource(ac, 'brown', filter)]

  const sub = ac.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = profile.base ?? 60
  const subGain = ac.createGain()
  subGain.gain.value = 0.24
  sub.connect(subGain)
  subGain.connect(out)
  sub.start()
  nodes.push(sub, subGain)

  const lfoRate = profile.lfoRate ?? 0.1
  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = lfoRate
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.45
  lfo.connect(lfoGain)
  lfoGain.connect(swellGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  const shimmerFilter = ac.createBiquadFilter()
  shimmerFilter.type = 'bandpass'
  shimmerFilter.frequency.value = 1100
  shimmerFilter.Q.value = 8
  const shimmerGain = ac.createGain()
  shimmerGain.gain.value = 0.03
  shimmerFilter.connect(shimmerGain)
  shimmerGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', shimmerFilter), shimmerFilter, shimmerGain)

  // A foaming crash roughly once per swell cycle — the wave actually breaking.
  const crashPeriodMs = Math.max(2500, Math.round(1000 / lfoRate))
  const crashTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.05
    const foam = ac.createBufferSource()
    foam.buffer = getNoiseBuffer(ac, 'white')
    const ff = ac.createBiquadFilter()
    ff.type = 'bandpass'
    ff.frequency.value = 1600
    ff.Q.value = 0.5
    const fg = ac.createGain()
    fg.gain.setValueAtTime(0.0001, t0)
    fg.gain.exponentialRampToValueAtTime(0.3, t0 + 0.35)
    fg.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.5)
    foam.connect(ff)
    ff.connect(fg)
    fg.connect(out)
    foam.start(t0)
    foam.stop(t0 + 1.6)
    cleanupOnEnded(foam, ff, fg)
  }, crashPeriodMs)
  nodes.push({ stop: () => clearInterval(crashTimer) })

  return nodes
}

/** Hades: subterranean hollow cavern wind + a low-frequency drone. */
function buildCavern(ac, out, profile) {
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = profile.filter ?? 220
  droneFilter.connect(out)
  const nodes = [droneFilter]

  ;[1, 1.5].forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 41) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.75 : 0.22
    osc.connect(g)
    g.connect(droneFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const windFilter = ac.createBiquadFilter()
  windFilter.type = 'bandpass'
  windFilter.frequency.value = 320
  windFilter.Q.value = 0.9
  const windGain = ac.createGain()
  windGain.gain.value = 0.15
  windFilter.connect(windGain)
  windGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', windFilter), windFilter, windGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.025
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.08
  lfo.connect(lfoGain)
  lfoGain.connect(windGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Dionysus: festive lute pad, gentle pouring liquid, and rhythmic chalice clinks. */
function buildFestive(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = profile.filter ?? 900
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.25, 1.5]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = (profile.base ?? 98) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.32 : 0.15
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const pourFilter = ac.createBiquadFilter()
  pourFilter.type = 'bandpass'
  pourFilter.frequency.value = 2200
  pourFilter.Q.value = 0.7
  const pourGain = ac.createGain()
  pourGain.gain.value = 0.025
  pourFilter.connect(pourGain)
  pourGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', pourFilter), pourFilter, pourGain)

  const chalicePitches = [523.25, 659.25, 783.99, 1046.5]
  const luteChord = [329.63, 415.3, 493.88]
  let step = 0
  const timer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    if (step % 3 === 0) {
      luteChord.forEach((f, i) => {
        const osc = ac.createOscillator()
        osc.type = 'triangle'
        osc.frequency.value = f
        const g = ac.createGain()
        const tt = t0 + i * 0.03
        g.gain.setValueAtTime(0.0001, tt)
        g.gain.exponentialRampToValueAtTime(0.13, tt + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, tt + 1.1)
        osc.connect(g)
        g.connect(out)
        osc.start(tt)
        osc.stop(tt + 1.2)
        cleanupOnEnded(osc, g)
      })
    } else {
      const f = chalicePitches[Math.floor(Math.random() * chalicePitches.length)]
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ac.createGain()
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 0.4)
      cleanupOnEnded(osc, g)
    }
    step++
  }, 1400)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Athena: distant temple chimes + crisp parchment fluttering. */
function buildTemple(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = profile.filter ?? 1100
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5, 1.875]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 110) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.38 : 0.13
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const flutterFilter = ac.createBiquadFilter()
  flutterFilter.type = 'highpass'
  flutterFilter.frequency.value = 3200
  const flutterGain = ac.createGain()
  flutterGain.gain.value = 0.018
  flutterFilter.connect(flutterGain)
  flutterGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'white', flutterFilter), flutterFilter, flutterGain)

  const chimePitches = [1046.5, 1318.5, 1568, 2093]
  const timer = setInterval(() => {
    if (Math.random() > 0.7) return
    const f = chimePitches[Math.floor(Math.random() * chimePitches.length)]
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = f
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.09, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.6)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 1.7)
    cleanupOnEnded(osc, g)
  }, 2200)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Ares: low marching war drums, distant metallic resonance, and a
 *  recurring rallying war-cry (a brassy, aggressive horn stinger — the
 *  closest a synthesized voice can get to a shouting soldier). */
function buildWar(ac, out, profile) {
  const droneOsc = ac.createOscillator()
  droneOsc.type = 'square'
  droneOsc.frequency.value = profile.base ?? 73
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = profile.filter ?? 300
  const droneGain = ac.createGain()
  droneGain.gain.value = 0.13
  droneOsc.connect(droneFilter)
  droneFilter.connect(droneGain)
  droneGain.connect(out)
  droneOsc.start()
  const nodes = [droneOsc, droneFilter, droneGain]

  const drumTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(120, t0)
    osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.15)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.35, t0)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.28)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.3)
    cleanupOnEnded(osc, g)
  }, 820)
  nodes.push({ stop: () => clearInterval(drumTimer) })

  const metalTimer = setInterval(() => {
    if (Math.random() > 0.4) return
    const t0 = ac.currentTime + 0.02
    const freq = 1800 + Math.random() * 500
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value = 12
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.08, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6)
    osc.connect(bp)
    bp.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.7)
    cleanupOnEnded(osc, bp, g)
  }, 1640)
  nodes.push({ stop: () => clearInterval(metalTimer) })

  const cryTimer = setInterval(() => {
    if (Math.random() > 0.5) return
    const t0 = ac.currentTime + 0.02
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 850
    bp.Q.value = 1.6
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.28, t0 + 0.12)
    g.gain.setValueAtTime(0.28, t0 + 0.38)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.75)
    bp.connect(g)
    g.connect(out)
    const cryOscs = [1, 1.005, 2].map((ratio) => {
      const osc = ac.createOscillator()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(210 * ratio, t0)
      osc.frequency.exponentialRampToValueAtTime(330 * ratio, t0 + 0.16)
      osc.frequency.exponentialRampToValueAtTime(280 * ratio, t0 + 0.5)
      osc.connect(bp)
      osc.start(t0)
      osc.stop(t0 + 0.8)
      return osc
    })
    cryOscs[0].onended = () => {
      cryOscs.forEach((osc) => { try { osc.disconnect() } catch { /* noop */ } })
      bp.disconnect()
      g.disconnect()
    }
  }, 6200)
  nodes.push({ stop: () => clearInterval(cryTimer) })

  return nodes
}

/** Icarus: high-altitude rushing wind + subtle solar crackle. */
function buildWindHigh(ac, out, profile) {
  const windFilter = ac.createBiquadFilter()
  windFilter.type = 'highpass'
  windFilter.frequency.value = profile.filter ?? 1400
  const windGain = ac.createGain()
  windGain.gain.value = 0.2
  windFilter.connect(windGain)
  windGain.connect(out)
  const nodes = [windFilter, windGain, makeNoiseSource(ac, 'white', windFilter)]

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.35
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.06
  lfo.connect(lfoGain)
  lfoGain.connect(windGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  const hum = ac.createOscillator()
  hum.type = 'sine'
  hum.frequency.value = profile.base ?? 180
  const humGain = ac.createGain()
  humGain.gain.value = 0.045
  hum.connect(humGain)
  humGain.connect(out)
  hum.start()
  nodes.push(hum, humGain)

  const crackleTimer = setInterval(() => {
    if (Math.random() > 0.3) return
    const t0 = ac.currentTime + 0.01
    const src = ac.createBufferSource()
    src.buffer = getNoiseBuffer(ac, 'white')
    const bp = ac.createBiquadFilter()
    bp.type = 'highpass'
    bp.frequency.value = 5000
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)
    src.connect(bp)
    bp.connect(g)
    g.connect(out)
    src.start(t0)
    src.stop(t0 + 0.1)
    cleanupOnEnded(src, bp, g)
  }, 900)
  nodes.push({ stop: () => clearInterval(crackleTimer) })

  return nodes
}

/** Minotaur: echoing deep labyrinth footsteps + crackling torch fire. */
function buildLabyrinth(ac, out, profile) {
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = profile.filter ?? 260
  droneFilter.connect(out)
  const drone = ac.createOscillator()
  drone.type = 'sawtooth'
  drone.frequency.value = profile.base ?? 39
  const droneGain = ac.createGain()
  droneGain.gain.value = 0.28
  drone.connect(droneGain)
  droneGain.connect(droneFilter)
  drone.start()
  const nodes = [drone, droneGain, droneFilter]

  const fireFilter = ac.createBiquadFilter()
  fireFilter.type = 'bandpass'
  fireFilter.frequency.value = 1600
  fireFilter.Q.value = 0.8
  const fireGain = ac.createGain()
  fireGain.gain.value = 0.045
  fireFilter.connect(fireGain)
  fireGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', fireFilter), fireFilter, fireGain)

  let stepIndex = 0
  const footTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    ;[0, stepIndex % 2 === 0 ? 0.18 : 0].forEach((d, i) => {
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(90, t0 + d)
      osc.frequency.exponentialRampToValueAtTime(50, t0 + d + 0.12)
      const g = ac.createGain()
      g.gain.setValueAtTime(i === 0 ? 0.26 : 0.16, t0 + d)
      g.gain.exponentialRampToValueAtTime(0.001, t0 + d + 0.25)
      osc.connect(g)
      g.connect(out)
      osc.start(t0 + d)
      osc.stop(t0 + d + 0.3)
      cleanupOnEnded(osc, g)
    })
    stepIndex++
  }, 1100)
  nodes.push({ stop: () => clearInterval(footTimer) })

  return nodes
}

/** Styx: cold, gently rippling water + a faint, distant oar-creak. */
function buildStyx(ac, out, profile) {
  const filter = ac.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = profile.filter ?? 900
  filter.Q.value = 0.5
  const rippleGain = ac.createGain()
  rippleGain.gain.value = 0.18
  filter.connect(rippleGain)
  rippleGain.connect(out)
  const nodes = [filter, rippleGain, makeNoiseSource(ac, 'pink', filter)]

  const sub = ac.createOscillator()
  sub.type = 'sine'
  sub.frequency.value = profile.base ?? 52
  const subGain = ac.createGain()
  subGain.gain.value = 0.22
  sub.connect(subGain)
  subGain.connect(out)
  sub.start()
  nodes.push(sub, subGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = profile.lfoRate ?? 0.22
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.12
  lfo.connect(lfoGain)
  lfoGain.connect(rippleGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Elysian Fields: a warm, serene major pad with sparse, gentle harp plucks. */
function buildElysian(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = profile.filter ?? 1400
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.25, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = (profile.base ?? 220) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.3 : 0.12
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const harpNotes = [523.25, 659.25, 783.99, 987.77, 1046.5]
  const timer = setInterval(() => {
    if (Math.random() > 0.55) return
    const f = harpNotes[Math.floor(Math.random() * harpNotes.length)]
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = f
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 1.5)
    cleanupOnEnded(osc, g)
  }, 1900)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Artemis: a bow drawn taut and released — creaking tension into a sharp,
 *  resonant twang — over a light forest-air bed. */
function buildBowstring(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 1200) * 1.3
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 220) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.13 : 0.05
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const airFilter = ac.createBiquadFilter()
  airFilter.type = 'bandpass'
  airFilter.frequency.value = 2000
  airFilter.Q.value = 0.5
  const airGain = ac.createGain()
  airGain.gain.value = 0.02
  airFilter.connect(airGain)
  airGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', airFilter), airFilter, airGain)

  const timer = setInterval(() => {
    const t0 = ac.currentTime + 0.05

    // Draw: rising creak of tension.
    const draw = ac.createBufferSource()
    draw.buffer = getNoiseBuffer(ac, 'white')
    const df = ac.createBiquadFilter()
    df.type = 'bandpass'
    df.Q.value = 6
    df.frequency.setValueAtTime(300, t0)
    df.frequency.exponentialRampToValueAtTime(1400, t0 + 0.85)
    const dg = ac.createGain()
    dg.gain.setValueAtTime(0.0001, t0)
    dg.gain.exponentialRampToValueAtTime(0.05, t0 + 0.85)
    dg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.95)
    draw.connect(df)
    df.connect(dg)
    dg.connect(out)
    draw.start(t0)
    draw.stop(t0 + 1)
    cleanupOnEnded(draw, df, dg)

    // Release: the twang.
    const t1 = t0 + 0.9
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(900, t1)
    osc.frequency.exponentialRampToValueAtTime(220, t1 + 0.35)
    const tw = ac.createBiquadFilter()
    tw.type = 'bandpass'
    tw.frequency.value = 700
    tw.Q.value = 10
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t1)
    g.gain.exponentialRampToValueAtTime(0.38, t1 + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.5)
    osc.connect(tw)
    tw.connect(g)
    g.connect(out)
    osc.start(t1)
    osc.stop(t1 + 0.55)
    cleanupOnEnded(osc, tw, g)
  }, 3600)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Gaia: warm earthy pad + clusters of bright, cheerful birdsong. */
function buildBirdsong(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 650) * 1.5
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = (profile.base ?? 82) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.26 : 0.1
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const rustleFilter = ac.createBiquadFilter()
  rustleFilter.type = 'highpass'
  rustleFilter.frequency.value = 2500
  const rustleGain = ac.createGain()
  rustleGain.gain.value = 0.018
  rustleFilter.connect(rustleGain)
  rustleGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', rustleFilter), rustleFilter, rustleGain)

  const chirp = (t0, baseFreq) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, t0)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, t0 + 0.06)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, t0 + 0.12)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.11, t0 + 0.015)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.14)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.16)
    cleanupOnEnded(osc, g)
  }

  const timer = setInterval(() => {
    if (Math.random() > 0.6) return
    const base = 1800 + Math.random() * 1400
    const count = 2 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      chirp(ac.currentTime + 0.03 + i * 0.16, base * (0.9 + Math.random() * 0.3))
    }
  }, 2400)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Minotaur: heavy, rhythmic bull breathing — a rising inhale into a
 *  guttural snorting exhale — over a low ominous drone. */
function buildBullBreath(ac, out, profile) {
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = (profile.filter ?? 260) * 1.3
  droneFilter.connect(out)
  const drone = ac.createOscillator()
  drone.type = 'sawtooth'
  drone.frequency.value = profile.base ?? 39
  const droneGain = ac.createGain()
  droneGain.gain.value = 0.15
  drone.connect(droneGain)
  droneGain.connect(droneFilter)
  drone.start()
  const nodes = [drone, droneGain, droneFilter]

  const breathFilter = ac.createBiquadFilter()
  breathFilter.type = 'bandpass'
  breathFilter.Q.value = 1.2
  breathFilter.frequency.value = 180
  const breathGain = ac.createGain()
  breathGain.gain.value = 0.0001
  breathFilter.connect(breathGain)
  breathGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'brown', breathFilter), breathFilter, breathGain)

  const cycle = () => {
    const t0 = ac.currentTime
    // Inhale: rising formant, swelling volume.
    breathFilter.frequency.cancelScheduledValues(t0)
    breathFilter.frequency.setValueAtTime(180, t0)
    breathFilter.frequency.exponentialRampToValueAtTime(420, t0 + 0.8)
    breathGain.gain.cancelScheduledValues(t0)
    breathGain.gain.setValueAtTime(Math.max(breathGain.gain.value, 0.0001), t0)
    breathGain.gain.exponentialRampToValueAtTime(0.2, t0 + 0.8)

    // Exhale / snort: falling formant with a sharp final burst.
    const t1 = t0 + 0.85
    breathFilter.frequency.setValueAtTime(420, t1)
    breathFilter.frequency.exponentialRampToValueAtTime(110, t1 + 0.55)
    breathGain.gain.setValueAtTime(0.2, t1)
    breathGain.gain.exponentialRampToValueAtTime(0.4, t1 + 0.1)
    breathGain.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.65)
  }
  cycle()
  const timer = setInterval(cycle, 3000)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Thanatos: a slow, deep funeral bell tolling in the distance, over near
 *  silence — peaceful, unhurried death rather than violence. */
function buildDeathToll(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 260) * 1.4
  padFilter.connect(out)
  const pad = ac.createOscillator()
  pad.type = 'sine'
  pad.frequency.value = profile.base ?? 36
  const padGain = ac.createGain()
  padGain.gain.value = 0.1
  pad.connect(padGain)
  padGain.connect(padFilter)
  pad.start()
  const nodes = [pad, padGain, padFilter]

  const tollTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    const partials = [1, 2.4, 3.9]
    partials.forEach((ratio, i) => {
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = 220 * ratio
      const g = ac.createGain()
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(i === 0 ? 0.32 : 0.1, t0 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 3.2 - i * 0.4)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 3.3)
      cleanupOnEnded(osc, g)
    })
  }, 5200)
  nodes.push({ stop: () => clearInterval(tollTimer) })

  return nodes
}

/** Hypnos: a slow rocking pad with a gentle, heartbeat-slow sub-bass pulse —
 *  the feeling of drifting toward sleep. */
function buildLullaby(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 380) * 1.4
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 40) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.3 : 0.11
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const pulse = ac.createOscillator()
  pulse.type = 'sine'
  pulse.frequency.value = (profile.base ?? 40) / 2
  const pulseGain = ac.createGain()
  pulseGain.gain.value = 0.0001
  pulse.connect(pulseGain)
  pulseGain.connect(out)
  pulse.start()
  nodes.push(pulse, pulseGain)

  const lfo = ac.createOscillator()
  lfo.type = 'sine'
  lfo.frequency.value = 0.35 // ~21 slow "breaths" per minute
  const lfoGain = ac.createGain()
  lfoGain.gain.value = 0.14
  lfo.connect(lfoGain)
  lfoGain.connect(pulseGain.gain)
  lfo.start()
  nodes.push(lfo, lfoGain)

  return nodes
}

/** Morpheus: a pad that never quite settles — pitch and tone drifting
 *  slowly, as if the sound itself is shapeshifting. */
function buildDreamShift(ac, out, profile) {
  const filter = ac.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = (profile.filter ?? 420) * 1.4
  filter.connect(out)
  const nodes = [filter]

  const voices = (profile.chord ?? [1, 1.5, 2]).map((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = (profile.base ?? 52) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.28 : 0.12
    osc.connect(g)
    g.connect(filter)
    osc.start()
    nodes.push(osc, g)
    return osc
  })

  // Each voice drifts on its own slow, independent random-ish cycle.
  voices.forEach((osc, i) => {
    const drift = ac.createOscillator()
    drift.type = 'sine'
    drift.frequency.value = 0.02 + i * 0.013
    const driftGain = ac.createGain()
    driftGain.gain.value = 6 + i * 3
    drift.connect(driftGain)
    driftGain.connect(osc.detune)
    drift.start()
    nodes.push(drift, driftGain)
  })

  return nodes
}

/** The Moirai: a rhythmic spinning-wheel whirr — thread being spun and
 *  measured — under a sustained, eerie three-note chord (one per sister). */
function buildSpindle(ac, out, profile) {
  const chordFilter = ac.createBiquadFilter()
  chordFilter.type = 'lowpass'
  chordFilter.frequency.value = (profile.filter ?? 300) * 1.4
  chordFilter.connect(out)
  const nodes = [chordFilter]

  ;(profile.chord ?? [1, 1.05, 1.6]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 48) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.26 : 0.12
    osc.connect(g)
    g.connect(chordFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const whirrFilter = ac.createBiquadFilter()
  whirrFilter.type = 'bandpass'
  whirrFilter.frequency.value = 900
  whirrFilter.Q.value = 3
  const whirrGain = ac.createGain()
  whirrGain.gain.value = 0.05
  whirrFilter.connect(whirrGain)
  whirrGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'pink', whirrFilter), whirrFilter, whirrGain)

  const tickTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.01
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = 1400
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.004)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.1)
    cleanupOnEnded(osc, g)
  }, 480)
  nodes.push({ stop: () => clearInterval(tickTimer) })

  return nodes
}

/** Epimetheus: a soft chime followed by its own delayed echo — thought
 *  always arriving one beat too late. */
function buildEcho(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 550) * 1.4
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.25, 1.5]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = (profile.base ?? 60) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.14 : 0.06
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const chime = (t0, freq, gainAmt) => {
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(gainAmt, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 1)
    cleanupOnEnded(osc, g)
  }

  const timer = setInterval(() => {
    const freq = 660 + Math.random() * 220
    const t0 = ac.currentTime + 0.02
    chime(t0, freq, 0.12)
    chime(t0 + 0.42, freq, 0.06) // the "afterthought" echo
  }, 3400)
  nodes.push({ stop: () => clearInterval(timer) })

  return nodes
}

/** Pan: a wandering panpipe melody over rustling wild undergrowth, with a
 *  rare startling dissonant sting (the origin of "panic"). */
function buildPanpipes(ac, out, profile) {
  const rustleFilter = ac.createBiquadFilter()
  rustleFilter.type = 'bandpass'
  rustleFilter.frequency.value = 1200
  rustleFilter.Q.value = 0.6
  const rustleGain = ac.createGain()
  rustleGain.gain.value = 0.035
  rustleFilter.connect(rustleGain)
  rustleGain.connect(out)
  const nodes = [makeNoiseSource(ac, 'pink', rustleFilter), rustleFilter, rustleGain]

  const scale = [1, 9 / 8, 5 / 4, 3 / 2, 5 / 3] // pentatonic ratios
  const base = profile.base ?? 440
  const pipe = (t0, ratio) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = base * ratio
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.05)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.6)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.65)
    cleanupOnEnded(osc, g)
  }

  const melodyTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    pipe(t0, scale[Math.floor(Math.random() * scale.length)])
  }, 900)
  nodes.push({ stop: () => clearInterval(melodyTimer) })

  const panicTimer = setInterval(() => {
    if (Math.random() > 0.2) return
    const t0 = ac.currentTime + 0.02
    ;[1, 1.06].forEach((ratio) => {
      const osc = ac.createOscillator()
      osc.type = 'square'
      osc.frequency.value = base * 1.5 * ratio
      const g = ac.createGain()
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 0.35)
      cleanupOnEnded(osc, g)
    })
  }, 7000)
  nodes.push({ stop: () => clearInterval(panicTimer) })

  return nodes
}

/** Eros: a soft two-beat heartbeat pulse with an occasional bright,
 *  affectionate little pluck — an arrow finding its mark. */
function buildLoveArrow(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 900) * 1.3
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 165) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.16 : 0.06
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const heartbeat = (t0, gainAmt) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, t0)
    osc.frequency.exponentialRampToValueAtTime(45, t0 + 0.12)
    const g = ac.createGain()
    g.gain.setValueAtTime(gainAmt, t0)
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.22)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.25)
    cleanupOnEnded(osc, g)
  }
  const beatTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    heartbeat(t0, 0.22)
    heartbeat(t0 + 0.24, 0.15)
  }, 1500)
  nodes.push({ stop: () => clearInterval(beatTimer) })

  const arrowTimer = setInterval(() => {
    if (Math.random() > 0.4) return
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(1600, t0)
    osc.frequency.exponentialRampToValueAtTime(1000, t0 + 0.2)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.1, t0 + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.4)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.45)
    cleanupOnEnded(osc, g)
  }, 3200)
  nodes.push({ stop: () => clearInterval(arrowTimer) })

  return nodes
}

/** Tantalus: a phrase that rises toward resolution and is yanked away just
 *  short of it, over a faint receding water-drip — reaching, never having. */
function buildUnreachable(ac, out, profile) {
  const droneFilter = ac.createBiquadFilter()
  droneFilter.type = 'lowpass'
  droneFilter.frequency.value = (profile.filter ?? 260) * 1.3
  droneFilter.connect(out)
  const drone = ac.createOscillator()
  drone.type = 'sawtooth'
  drone.frequency.value = profile.base ?? 44
  const droneGain = ac.createGain()
  droneGain.gain.value = 0.14
  drone.connect(droneGain)
  droneGain.connect(droneFilter)
  drone.start()
  const nodes = [drone, droneGain, droneFilter]

  const dripTimer = setInterval(() => {
    if (Math.random() > 0.5) return
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(1200, t0)
    osc.frequency.exponentialRampToValueAtTime(400, t0 + 0.15)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.06, t0 + 0.005)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2)
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 0.22)
    cleanupOnEnded(osc, g)
  }, 2600)
  nodes.push({ stop: () => clearInterval(dripTimer) })

  const reachTimer = setInterval(() => {
    const t0 = ac.currentTime + 0.02
    const osc = ac.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, t0)
    osc.frequency.exponentialRampToValueAtTime(420, t0 + 1.6)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.15, t0 + 1.4)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.75) // cut off just before resolving
    osc.connect(g)
    g.connect(out)
    osc.start(t0)
    osc.stop(t0 + 1.8)
    cleanupOnEnded(osc, g)
  }, 4600)
  nodes.push({ stop: () => clearInterval(reachTimer) })

  return nodes
}

/** Cassandra: a high, wavering keening tone — a warning cried out — over a
 *  faint, unheeding murmur of a crowd that never turns to listen. */
function buildUnheeded(ac, out, profile) {
  const murmurFilter = ac.createBiquadFilter()
  murmurFilter.type = 'bandpass'
  murmurFilter.frequency.value = 500
  murmurFilter.Q.value = 0.5
  const murmurGain = ac.createGain()
  murmurGain.gain.value = 0.04
  murmurFilter.connect(murmurGain)
  murmurGain.connect(out)
  const nodes = [makeNoiseSource(ac, 'pink', murmurFilter), murmurFilter, murmurGain]

  const keen = ac.createOscillator()
  keen.type = 'sine'
  keen.frequency.value = profile.base ?? 500
  const keenGain = ac.createGain()
  keenGain.gain.value = 0.09
  keen.connect(keenGain)
  keenGain.connect(out)
  keen.start()
  nodes.push(keen, keenGain)

  const vibrato = ac.createOscillator()
  vibrato.type = 'sine'
  vibrato.frequency.value = 4.5
  const vibratoGain = ac.createGain()
  vibratoGain.gain.value = 12
  vibrato.connect(vibratoGain)
  vibratoGain.connect(keen.frequency)
  vibrato.start()
  nodes.push(vibrato, vibratoGain)

  const swell = ac.createOscillator()
  swell.type = 'sine'
  swell.frequency.value = profile.lfoRate ?? 0.06
  const swellGain = ac.createGain()
  swellGain.gain.value = 0.06
  swell.connect(swellGain)
  swellGain.connect(keenGain.gain)
  swell.start()
  nodes.push(swell, swellGain)

  return nodes
}

/** Psyche: an airy, high shimmering pad with the soft rapid tremolo of
 *  butterfly wings passing close by. */
function buildButterfly(ac, out, profile) {
  const padFilter = ac.createBiquadFilter()
  padFilter.type = 'lowpass'
  padFilter.frequency.value = (profile.filter ?? 1300) * 1.3
  padFilter.connect(out)
  const nodes = [padFilter]

  ;(profile.chord ?? [1, 1.5, 2]).forEach((ratio, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = (profile.base ?? 175) * ratio
    const g = ac.createGain()
    g.gain.value = i === 0 ? 0.16 : 0.06
    osc.connect(g)
    g.connect(padFilter)
    osc.start()
    nodes.push(osc, g)
  })

  const flutterFilter = ac.createBiquadFilter()
  flutterFilter.type = 'bandpass'
  flutterFilter.frequency.value = 2200
  flutterFilter.Q.value = 1
  const flutterGain = ac.createGain()
  flutterGain.gain.value = 0.0001
  flutterFilter.connect(flutterGain)
  flutterGain.connect(out)
  nodes.push(makeNoiseSource(ac, 'white', flutterFilter), flutterFilter, flutterGain)

  const wingbeat = ac.createOscillator()
  wingbeat.type = 'sine'
  wingbeat.frequency.value = 9 // ~9 flutters/sec
  const wingbeatGain = ac.createGain()
  wingbeatGain.gain.value = 0.03
  wingbeat.connect(wingbeatGain)
  wingbeatGain.connect(flutterGain.gain)
  wingbeat.start()
  nodes.push(wingbeat, wingbeatGain)

  const passByTimer = setInterval(() => {
    flutterGain.gain.setTargetAtTime(0.05, ac.currentTime, 0.3)
    setTimeout(() => flutterGain.gain.setTargetAtTime(0.0001, ac.currentTime, 0.6), 900)
  }, 4800)
  nodes.push({ stop: () => clearInterval(passByTimer) })

  return nodes
}

export const AMBIENT_ENGINES = {
  drone: buildDrone,
  rumble: buildRumble,
  void: buildVoid,
  thunder: buildThunder,
  ocean: buildOcean,
  cavern: buildCavern,
  festive: buildFestive,
  temple: buildTemple,
  war: buildWar,
  windHigh: buildWindHigh,
  labyrinth: buildLabyrinth,
  styx: buildStyx,
  elysian: buildElysian,
  bowstring: buildBowstring,
  birdsong: buildBirdsong,
  bullBreath: buildBullBreath,
  deathToll: buildDeathToll,
  lullaby: buildLullaby,
  dreamShift: buildDreamShift,
  spindle: buildSpindle,
  echo: buildEcho,
  panpipes: buildPanpipes,
  loveArrow: buildLoveArrow,
  unreachable: buildUnreachable,
  unheeded: buildUnheeded,
  butterfly: buildButterfly,
}

// ────────────────────────────── UI micro-SFX ──────────────────────────────

export const SFX_ENGINES = {
  /** Card drag / carousel snap: a soft stone-on-stone sliding swoosh. */
  cardSnap(ac, out) {
    const noise = ac.createBufferSource()
    noise.buffer = getNoiseBuffer(ac, 'white')
    const bp = ac.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.2
    bp.frequency.setValueAtTime(1800, ac.currentTime)
    bp.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.35)
    const g = ac.createGain()
    g.gain.setValueAtTime(0.001, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.4, ac.currentTime + 0.03)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4)
    noise.connect(bp)
    bp.connect(g)
    g.connect(out)
    noise.start()
    noise.stop(ac.currentTime + 0.4)
    cleanupOnEnded(noise, bp, g)
  },

  /** Lineage-tree node click: an ancient bronze coin clink. */
  nodeClick(ac, out) {
    ;[1200, 1800].forEach((f, i) => {
      const osc = ac.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      const g = ac.createGain()
      const t0 = ac.currentTime + i * 0.03
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.32, t0 + 0.01)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 0.3)
      cleanupOnEnded(osc, g)
    })
  },

  /** Theme / language switch: a gentle harp pluck chord. */
  themeSwitch(ac, out) {
    ;[392, 494, 587, 784].forEach((f, i) => {
      const osc = ac.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      const g = ac.createGain()
      const t0 = ac.currentTime + i * 0.05
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.9)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 0.95)
      cleanupOnEnded(osc, g)
    })
  },

  /** Constellation completed: a shimmering ascending arpeggio. */
  starChime(ac, out) {
    ;[783.99, 987.77, 1174.66, 1567.98].forEach((f, i) => {
      const osc = ac.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      const g = ac.createGain()
      const t0 = ac.currentTime + i * 0.09
      g.gain.setValueAtTime(0.0001, t0)
      g.gain.exponentialRampToValueAtTime(0.16, t0 + 0.015)
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.3)
      osc.connect(g)
      g.connect(out)
      osc.start(t0)
      osc.stop(t0 + 1.4)
      cleanupOnEnded(osc, g)
    })
  },

  /** Entity immersive takeover open: a soft rising whoosh. */
  takeoverOpen(ac, out) {
    const noise = ac.createBufferSource()
    noise.buffer = getNoiseBuffer(ac, 'white')
    const hp = ac.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 600
    const g = ac.createGain()
    g.gain.setValueAtTime(0.0001, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.22, ac.currentTime + 0.5)
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.9)
    noise.connect(hp)
    hp.connect(g)
    g.connect(out)
    noise.start()
    noise.stop(ac.currentTime + 0.9)
    cleanupOnEnded(noise, hp, g)
  },
}
