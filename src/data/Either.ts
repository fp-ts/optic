/**
 * @since 1.0.0
 */
import * as Either from "@effect/data/Either"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: {
  <E, A>(): Prism<Either.Either<E, A>, A>
  <E, A, B>(): PolyPrism<Either.Either<E, A>, Either.Either<E, B>, A, B>
} = <E, A>() =>
  Optic.prism<Either.Either<E, A>, A>(
    Either.mapLeft(() => new Error("Expected a Right")),
    Either.right
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: {
  <E, A>(): Prism<Either.Either<E, A>, E>
  <E, A, B>(): PolyPrism<Either.Either<E, A>, Either.Either<B, A>, E, B>
} = <E, A>() =>
  Optic.prism<Either.Either<E, A>, E>(
    Either.match({
      onLeft: Either.right,
      onRight: () => Either.left(new Error("Expected a Left"))
    }),
    Either.left
  )
