/**
 * @since 1.0.0
 */

import type { NonEmptyReadonlyArray } from "@effect/data/ReadonlyArray"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"
import type { Iso, PolyIso } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

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
    (s) => [ReadonlyArray.headNonEmpty(s), ReadonlyArray.tailNonEmpty(s)],
    ([head, tail]) => ReadonlyArray.prepend(head)(tail)
  )
