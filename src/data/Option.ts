/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import type { Prism } from "@fp-ts/optic"
import { prism } from "@fp-ts/optic"

/**
 * An optic that accesses the `None` case of an `Option`.
 *
 * @since 1.0.0
 */
export const none = <A>(): Prism<Option<A>, void> =>
  prism(
    O.match(
      () => E.right<void>(undefined),
      (a) => E.left(Error(`some(${a}) did not satisfy isNone`))
    ),
    (): Option<A> => O.none
  )
