/**
 * @since 1.0.0
 */

import type { Either } from "@fp-ts/data/Either"
import type { Optic } from "@fp-ts/optic/Optic"
import type { OpticFailure } from "@fp-ts/optic/OpticFailure"

/**
 * @since 1.0.0
 */
export interface PPrism<in S, out T, out A, in B>
  extends Optic<S, unknown, B, OpticFailure, never, A, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const pprism = <S, T, A, B>(
  decode: (s: S) => Either<readonly [OpticFailure, T], A>,
  set: (b: B) => Either<never, T>
): PPrism<S, T, A, B> => ({
  decode,
  encode: (b) => (_) => set(b)
})
