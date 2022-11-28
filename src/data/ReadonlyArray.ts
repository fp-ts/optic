/**
 * @since 1.0.0
 */

import { pipe } from "@fp-ts/data/Function"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import * as RA from "@fp-ts/data/ReadonlyArray"
import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"
import type { Index } from "@fp-ts/optic/typeclass/Index"

/**
 * @since 1.0.0
 */
export const getAt = <A>(): At<ReadonlyArray<A>, number, Option<A>> => ({
  at: (i) =>
    Optic.lens(RA.get(i), (oa) =>
      (s) =>
        pipe(
          oa,
          O.match(
            () => pipe(s, RA.deleteAt(i), O.getOrElse(() => s)),
            (a) => pipe(s, RA.updateAt(i, a), O.getOrElse(() => s))
          )
        ))
})

/**
 * @since 1.0.0
 */
export const getIndex = <A>(): Index<ReadonlyArray<A>, number, A> => ({
  index: Optic.index
})
