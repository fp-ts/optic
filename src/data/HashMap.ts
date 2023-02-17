/**
 * @since 1.0.0
 */

import type { HashMap } from "@effect/data/HashMap"
import * as HM from "@effect/data/HashMap"
import { pipe } from "@fp-ts/core/Function"
import type { Option } from "@fp-ts/core/Option"
import * as O from "@fp-ts/core/Option"
import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"
import type { Index } from "@fp-ts/optic/typeclass/Index"
import { fromAt } from "@fp-ts/optic/typeclass/Index"

/**
 * @since 1.0.0
 */
export const getAt = <K, A>(): At<HashMap<K, A>, K, Option<A>> => ({
  at: (k) =>
    Optic.lens(HM.get(k), (oa) =>
      (s) =>
        pipe(
          oa,
          O.match(
            () => pipe(s, HM.remove(k)),
            (a) => pipe(s, HM.set(k, a))
          )
        ))
})

/**
 * @since 1.0.0
 */
export const getIndex = <K, A>(): Index<HashMap<K, A>, K, A> => fromAt(getAt())
