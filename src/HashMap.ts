/**
 * @since 1.0.0
 */

import * as Optic from "@fp-ts/optic"
import type { At } from "@fp-ts/optic/typeclass/At"
import type { Index } from "@fp-ts/optic/typeclass/Index"
import { fromAt } from "@fp-ts/optic/typeclass/Index"
import { pipe } from "effect/Function"
import * as HashMap from "effect/HashMap"
import * as Option from "effect/Option"

/**
 * @since 1.0.0
 */
export const getAt = <K, A>(): At<HashMap.HashMap<K, A>, K, Option.Option<A>> => ({
  at: (k) =>
    Optic.lens(HashMap.get(k), (oa) =>
      (s) =>
        pipe(
          oa,
          Option.match({
            onNone: () => pipe(s, HashMap.remove(k)),
            onSome: (a) => pipe(s, HashMap.set(k, a))
          })
        ))
})

/**
 * @since 1.0.0
 */
export const getIndex = <K, A>(): Index<HashMap.HashMap<K, A>, K, A> => fromAt(getAt())
