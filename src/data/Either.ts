/**
 * @since 1.0.0
 */
import type { PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import * as Either from "effect/Either"

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: {
  <A, E>(): Prism<Either.Either<A, E>, A>
  <A, E, B>(): PolyPrism<Either.Either<A, E>, Either.Either<B, E>, A, B>
} = <A, E>() =>
  Optic.prism<Either.Either<A, E>, A>(
    Either.mapLeft(() => new Error("Expected a Right")),
    Either.right
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: {
  <A, E>(): Prism<Either.Either<A, E>, E>
  <A, E, B>(): PolyPrism<Either.Either<A, E>, Either.Either<A, B>, E, B>
} = <A, E>() =>
  Optic.prism<Either.Either<A, E>, E>(
    Either.match({
      onLeft: Either.right,
      onRight: () => Either.left(new Error("Expected a Left"))
    }),
    Either.left
  )
