/**
 * @since 1.0.0
 */

import type { Iso, PolyIso } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import type { NonEmptyReadonlyArray } from "effect/Array"
import * as Array from "effect/Array"

/**
 * An optic that accesses the `Cons` case of a `NonEmptyReadonlyArray`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const consNonEmpty: {
  <A>(): Iso<NonEmptyReadonlyArray<A>, readonly [A, ReadonlyArray<A>]>
  <A, B>(): PolyIso<
    NonEmptyReadonlyArray<A>,
    NonEmptyReadonlyArray<B>,
    readonly [A, ReadonlyArray<A>],
    readonly [B, ReadonlyArray<B>]
  >
} = <A>() =>
  Optic.iso<NonEmptyReadonlyArray<A>, readonly [A, ReadonlyArray<A>]>(
    (s) => [Array.headNonEmpty(s), Array.tailNonEmpty(s)],
    ([head, tail]) => Array.prepend(head)(tail)
  )
