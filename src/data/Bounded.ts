/**
 * @since 1.0.0
 */
import type * as B from "@fp-ts/core/typeclass/Bounded"
import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export const min = <A>() =>
  Optic.lens<B.Bounded<A>, A>(
    (bound: B.Bounded<A>) => bound.minBound,
    (minBound: A) => <A>(bound: B.Bounded<A>) => ({ ...bound, minBound })
  )

/**
 * @since 1.0.0
 */
export const max = <A>() =>
  Optic.lens<B.Bounded<A>, A>(
    (bound: B.Bounded<A>) => bound.maxBound,
    (maxBound: A) => <A>(bound: B.Bounded<A>) => ({ ...bound, maxBound })
  )
