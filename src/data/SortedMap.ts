/**
 * @since 1.0.0
 */

import { pipe } from "@fp-ts/data/Function"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import * as SM from "@fp-ts/data/SortedMap"
import type { SortedMap } from "@fp-ts/data/SortedMap"
import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"

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
