/**
 * @since 1.0.0
 */
import type { Either } from "@effect/data/Either"
import * as E from "@effect/data/Either"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: {
  <E, A>(): Prism<Either<E, A>, A>
  <E, A, B>(): PolyPrism<Either<E, A>, Either<E, B>, A, B>
} = <E, A>() =>
  Optic.prism<Either<E, A>, A>(
    E.mapLeft(() => new Error("Expected a Right")),
    E.right
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: {
  <E, A>(): Prism<Either<E, A>, E>
  <E, A, B>(): PolyPrism<Either<E, A>, Either<B, A>, E, B>
} = <E, A>() =>
  Optic.prism<Either<E, A>, E>(
    E.match(
      E.right,
      () => E.left(new Error("Expected a Left"))
    ),
    E.left
  )
