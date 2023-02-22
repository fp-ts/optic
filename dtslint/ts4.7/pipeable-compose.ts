import { pipe } from "@effect/data/Function"
import type { Iso, Lens, Optional, PolyIso, PolyLens, PolyOptional, PolyPrism, Prism } from "@fp-ts/optic"

interface S { s: string }
interface A { a: string }
interface B { b: string }

declare const optionalSA: Optional<S, A>

declare const optionalAB: Optional<A, B>

// Iso
declare function compose<A, B>(that: Iso<A, B>): <S>(self: Iso<S, A>) => Iso<S, B>
declare function compose<A, B, C, D>(
  that: PolyIso<A, B, C, D>
): <S, T>(this: PolyIso<S, T, A, B>) => PolyIso<S, T, C, D>
declare function compose<A, B>(that: Prism<A, B>): <S>(self: Iso<S, A>) => Prism<S, B>
declare function compose<A, B, C, D>(
  that: PolyPrism<A, B, C, D>
): <S, T>(this: PolyIso<S, T, A, B>) => PolyPrism<S, T, C, D>
declare function compose<A, B>(that: Lens<A, B>): <S>(self: Iso<S, A>) => Lens<S, B>
declare function compose<A, B, C, D>(
  that: PolyLens<A, B, C, D>
): <S, T>(this: PolyIso<S, T, A, B>) => PolyLens<S, T, C, D>
declare function compose<A, B>(that: Optional<A, B>): <S>(self: Iso<S, A>) => Optional<S, B>
declare function compose<A, B, C, D>(
  that: PolyOptional<A, B, C, D>
): <S, T>(this: PolyIso<S, T, A, B>) => PolyOptional<S, T, C, D>
// Lens
declare function compose<A, B>(that: Lens<A, B>): <S>(self: Lens<S, A>) => Lens<S, B>
declare function compose<A, B, C, D>(
  that: PolyLens<A, B, C, D>
): <S, T>(this: PolyLens<S, T, A, B>) => PolyLens<S, T, C, D>
declare function compose<A, B>(that: Optional<A, B>): <S>(self: Lens<S, A>) => Optional<S, B>
declare function compose<A, B, C, D>(
  that: PolyOptional<A, B, C, D>
): <S, T>(this: PolyLens<S, T, A, B>) => PolyOptional<S, T, C, D>
// Prism
declare function compose<A, B>(that: Prism<A, B>): <S>(self: Prism<S, A>) => Prism<S, B>
declare function compose<A, B, C, D>(
  that: PolyPrism<A, B, C, D>
): <S, T>(this: PolyPrism<S, T, A, B>) => PolyPrism<S, T, C, D>
declare function compose<A, B>(that: Optional<A, B>): <S>(self: Prism<S, A>) => Optional<S, B>
declare function compose<A, B, C, D>(
  that: PolyOptional<A, B, C, D>
): <S, T>(self: PolyPrism<S, T, A, B>) => PolyOptional<S, T, C, D>
// Optional
declare function compose<A, B>(
  that: Optional<A, B>
): <S>(self: Optional<S, A>) => Optional<S, B>
declare function compose<A, B, C, D>(
  that: PolyOptional<A, B, C, D>
): <S, T>(self: PolyOptional<S, T, A, B>) => PolyOptional<S, T, C, D>

// $ExpectError
pipe(optionalSA, compose(optionalAB))
