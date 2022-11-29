import { Iso, Lens, Optional, PolyIso, PolyLens, PolyOptional, PolyPrism, PolyReversedPrism, Prism, reversedPrism, ReversedPrism } from "@fp-ts/optic"

interface S { s: string }
interface T { t: string }
interface A { a: string }
interface B { b: string }
interface C { c: string }
interface D { d: string }

declare const isoSA: Iso<S, A>
declare const lensSA: Lens<S, A>
declare const reversedPrismSA: ReversedPrism<S, A>
declare const prismSA: Prism<S, A>
declare const optionalSA: Optional<S, A>

declare const isoAB: Iso<A, B>
declare const lensAB: Lens<A, B>
declare const reversedPrismAB: ReversedPrism<A, B>
declare const prismAB: Prism<A, B>
declare const optionalAB: Optional<A, B>

// $ExpectType Iso<S, B>
isoSA.compose(isoAB)
// $ExpectType Lens<S, B>
isoSA.compose(lensAB)
// $ExpectType ReversedPrism<S, B>
isoSA.compose(reversedPrismAB)
// $ExpectType Prism<S, B>
isoSA.compose(prismAB)
// $ExpectType Optional<S, B>
isoSA.compose(optionalAB)

// $ExpectType Lens<S, B>
lensSA.compose(isoAB)
// $ExpectType Lens<S, B>
lensSA.compose(lensAB)
// $ExpectType ReversedPrism<S, B>
lensSA.compose(reversedPrismAB)
// $ExpectType Optional<S, B>
lensSA.compose(prismAB)
// $ExpectType Optional<S, B>
lensSA.compose(optionalAB)

// $ExpectType ReversedPrism<S, B>
reversedPrismSA.compose(isoAB)
// $ExpectType ReversedPrism<S, B>
reversedPrismSA.compose(lensAB)
// $ExpectType ReversedPrism<S, B>
reversedPrismSA.compose(reversedPrismAB)
// $ExpectType Optional<S, B>
reversedPrismSA.compose(prismAB)
// $ExpectType Optional<S, B>
reversedPrismSA.compose(optionalAB)

// $ExpectType Prism<S, B>
prismSA.compose(isoAB)
// $ExpectType Optional<S, B>
prismSA.compose(lensAB)
// $ExpectType Optional<S, B>
prismSA.compose(reversedPrismAB)
// $ExpectType Prism<S, B>
prismSA.compose(prismAB)
// $ExpectType Optional<S, B>
prismSA.compose(optionalAB)

// $ExpectType Optional<S, B>
optionalSA.compose(isoAB)
// $ExpectType Optional<S, B>
optionalSA.compose(lensAB)
// $ExpectType Optional<S, B>
optionalSA.compose(reversedPrismAB)
// $ExpectType Optional<S, B>
optionalSA.compose(prismAB)
// $ExpectType Optional<S, B>
optionalSA.compose(optionalAB)

declare const isoSTAB: PolyIso<S, T, A, B>
declare const lensSTAB: PolyLens<S, T, A, B>
declare const reversedPrismSTAB: PolyReversedPrism<S, T, A, B>
declare const prismSTAB: PolyPrism<S, T, A, B>
declare const optionaSTAB: PolyOptional<S, T, A, B>

declare const isoABCD: PolyIso<A, B, C, D>
declare const lensABCD: PolyLens<A, B, C, D>
declare const reversedPrismABCD: PolyReversedPrism<A, B, C, D>
declare const prismABCD: PolyPrism<A, B, C, D>
declare const optionalABCD: PolyOptional<A, B, C, D>

// $ExpectType PolyIso<S, T, C, D>
isoSTAB.compose(isoABCD)
// $ExpectType PolyLens<S, T, C, D>
isoSTAB.compose(lensABCD)
// $ExpectType PolyReversedPrism<S, T, C, D>
isoSTAB.compose(reversedPrismABCD)
// $ExpectType PolyPrism<S, T, C, D>
isoSTAB.compose(prismABCD)
// $ExpectType PolyOptional<S, T, C, D>
isoSTAB.compose(optionalABCD)

// $ExpectType PolyLens<S, T, C, D>
lensSTAB.compose(isoABCD)
// $ExpectType PolyLens<S, T, C, D>
lensSTAB.compose(lensABCD)
// $ExpectType PolyReversedPrism<S, T, C, D>
lensSTAB.compose(reversedPrismABCD)
// $ExpectType PolyOptional<S, T, C, D>
lensSTAB.compose(prismABCD)
// $ExpectType PolyOptional<S, T, C, D>
lensSTAB.compose(optionalABCD)

// $ExpectType PolyReversedPrism<S, T, C, D>
reversedPrismSTAB.compose(isoABCD)
// $ExpectType PolyReversedPrism<S, T, C, D>
reversedPrismSTAB.compose(lensABCD)
// $ExpectType PolyReversedPrism<S, T, C, D>
reversedPrismSTAB.compose(reversedPrismABCD)
// $ExpectType PolyOptional<S, T, C, D>
reversedPrismSTAB.compose(prismABCD)
// $ExpectType PolyOptional<S, T, C, D>
reversedPrismSTAB.compose(optionalABCD)

// $ExpectType PolyPrism<S, T, C, D>
prismSTAB.compose(isoABCD)
// $ExpectType PolyOptional<S, T, C, D>
prismSTAB.compose(lensABCD)
// $ExpectType PolyOptional<S, T, C, D>
prismSTAB.compose(reversedPrismABCD)
// $ExpectType PolyPrism<S, T, C, D>
prismSTAB.compose(prismABCD)
// $ExpectType PolyOptional<S, T, C, D>
prismSTAB.compose(optionalABCD)

// $ExpectType PolyOptional<S, T, C, D>
optionaSTAB.compose(isoABCD)
// $ExpectType PolyOptional<S, T, C, D>
optionaSTAB.compose(lensABCD)
// $ExpectType PolyOptional<S, T, C, D>
optionaSTAB.compose(reversedPrismABCD)
// $ExpectType PolyOptional<S, T, C, D>
optionaSTAB.compose(prismABCD)
// $ExpectType PolyOptional<S, T, C, D>
optionaSTAB.compose(optionalABCD)
