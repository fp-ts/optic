/**
 * @since 1.0.0
 */

import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import type { Lens } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * Typeclass that defines a `Lens` from an `S` to an `A` at an index `I`
 *
 * @since 1.0.0
 */
export interface At<in out S, in I, A> {
  readonly at: (i: I) => Lens<S, A>
}

/**
 * Delete a value associated with a key in a Map-like container
 *
 * @since 1.0.0
 */
export const remove = <S, I, A>(F: At<S, I, Option<A>>) =>
  (i: I) => (s: S): S => Optic.replace(F.at(i))(O.none)(s)
