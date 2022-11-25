/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import { polyPrism } from "@fp-ts/optic"

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: {
  <A, B>(): Prism<Either<A, B>, B>
  <A, B, C>(): PolyPrism<Either<A, B>, Either<A, C>, B, C>
} = <A, B, C>(): PolyPrism<Either<A, B>, Either<A, C>, B, C> =>
  polyPrism(
    E.match(
      (a) => E.left([Error(`left(${a}) did not satisfy isRight`), E.left(a)]),
      (b) => E.right(b)
    ),
    (c): Either<A, C> => E.right(c)
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: {
  <A, B>(): Prism<Either<A, B>, A>
  <A, B, C>(): PolyPrism<Either<A, B>, Either<C, B>, A, C>
} = <A, B, C>(): PolyPrism<Either<A, B>, Either<C, B>, A, C> =>
  polyPrism(
    E.match(
      (a) => E.right(a),
      (b) => E.left([Error(`right(${b}) did not satisfy isLeft`), E.right(b)])
    ),
    (c): Either<C, B> => E.left(c)
  )
