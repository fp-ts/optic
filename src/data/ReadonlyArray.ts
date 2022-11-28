/**
 * @since 1.0.0
 */

import type { NonEmptyReadonlyArray } from "@fp-ts/data/ReadonlyArray"
import * as RA from "@fp-ts/data/ReadonlyArray"
import type { Iso, PolyIso } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import type { Index } from "@fp-ts/optic/typeclass/Index"

/**
 * @since 1.0.0
 */
export const getIndex = <A>(): Index<ReadonlyArray<A>, number, A> => ({
  index: Optic.index
})

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
    (s) => [RA.headNonEmpty(s), RA.tailNonEmpty(s)],
    ([head, tail]) => RA.prepend(head)(tail)
  )
