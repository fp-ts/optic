/**
 * @since 1.0.0
 */

import * as E from "@fp-ts/core/Either"
import { pipe } from "@fp-ts/core/Function"
import type { Option } from "@fp-ts/core/Option"
import type { Optional } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"

/**
 * Typeclass that defines a `Lens` from an `S` to an `A` at an index `I`
 *
 * @since 1.0.0
 */
export interface Index<in out S, in I, in out A> {
  readonly index: (i: I) => Optional<S, A>
}

/**
 * @since 1.0.0
 */
export const fromAt = <S, I, A>(F: At<S, I, Option<A>>): Index<S, I, A> => ({
  index: (i) => {
    const some = Optic.some<A>()
    return F.at(i).compose(Optic.prism<Option<A>, A>(
      (s) =>
        pipe(
          some.getOptic(s),
          E.mapLeft(() => new Error(`Missing key/index ${JSON.stringify(i)}`))
        ),
      Optic.encode(some)
    ))
  }
})
