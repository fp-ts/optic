/**
 * @since 1.0.0
 */

import { pipe } from "@effect/data/Function"
import type { Option } from "@effect/data/Option"
import * as O from "@effect/data/Option"
import * as SM from "@effect/data/SortedMap"
import type { SortedMap } from "@effect/data/SortedMap"
import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"
import type { Index } from "@fp-ts/optic/typeclass/Index"
import { fromAt } from "@fp-ts/optic/typeclass/Index"

/**
 * @since 1.0.0
 */
export const getAt = <K, A>(): At<SortedMap<K, A>, K, Option<A>> => ({
  at: (k) =>
    Optic.lens(SM.get(k), (oa) =>
      (s) =>
        pipe(
          oa,
          O.match(
            () => pipe(s, SM.remove(k)),
            (a) => pipe(s, SM.set(k, a))
          )
        ))
})

/**
 * @since 1.0.0
 */
export const getIndex = <K, A>(): Index<SortedMap<K, A>, K, A> => fromAt(getAt())
