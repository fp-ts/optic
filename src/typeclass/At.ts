/**
 * @since 1.0.0
 */

import type { Lens } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import * as Option from "effect/Option"

/**
 * Typeclass that defines a `Lens` from an `S` to an `A` at an index `I`
 *
 * @since 1.0.0
 */
export interface At<in out S, in I, in out A> {
  readonly at: (i: I) => Lens<S, A>
}

/**
 * Delete a value associated with a key in a Map-like container
 *
 * @since 1.0.0
 */
export const remove = <S, I, A>(F: At<S, I, Option.Option<A>>) =>
  (i: I) => (s: S): S => Optic.replace(F.at(i))(Option.none())(s)
