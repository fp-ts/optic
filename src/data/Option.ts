/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import { polyPrism, prism } from "@fp-ts/optic"

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
    (_): Option<A> => O.none
  )

/**
 * An optic that accesses the `Some` case of an `Option`.
 *
 * @since 1.0.0
 */
export const some: {
  <A>(): Prism<Option<A>, A>
  <A, B>(): PolyPrism<Option<A>, Option<B>, A, B>
} = <A, B>(): PolyPrism<Option<A>, Option<B>, A, B> =>
  polyPrism(
    O.match(
      () => E.left([Error("none did not satisfy isSome"), O.none]),
      (a) => E.right(a)
    ),
    (b) => O.some(b)
  )
