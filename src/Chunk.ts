/**
 * @since 1.0.0
 */
import type { Optional, PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"
import * as Chunk from "effect/Chunk"
import * as Either from "effect/Either"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"

/**
 * An optic that accesses the specified index of a `Chunk`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const index = <A>(i: number): Optional<Chunk.Chunk<A>, A> =>
  Optic.optional(
    (s) =>
      pipe(
        s,
        Chunk.get(i),
        Either.fromOption(() => new Error(`Missing index ${i}`))
      ),
    (a) =>
      (s) =>
        pipe(
          Chunk.replaceOption(i, a)(s),
          Either.fromOption(() => new Error(`Missing index ${i}`))
        )
  )

/**
 * An optic that accesses the `Cons` case of a `Chunk`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<Chunk.Chunk<A>, readonly [A, Chunk.Chunk<A>]>
  <A, B>(): PolyPrism<
    Chunk.Chunk<A>,
    Chunk.Chunk<B>,
    readonly [A, Chunk.Chunk<A>],
    readonly [B, Chunk.Chunk<B>]
  >
} = <A>() =>
  Optic.prism<Chunk.Chunk<A>, readonly [A, Chunk.Chunk<A>]>(
    (s) =>
      pipe(
        Chunk.tail(s),
        Option.match({
          onNone: () => Either.left(new Error("Expected a non empty Chunk")),
          onSome: (tail) => Either.right([Chunk.unsafeHead(s), tail])
        })
      ),
    ([head, tail]) => Chunk.prepend(head)(tail)
  )

/**
 * @category constructors
 * @since 1.0.0
 */
export const head = <A>(): Optional<Chunk.Chunk<A>, A> => cons<A>().at("0")

/**
 * @category constructors
 * @since 1.0.0
 */
export const tail = <A>(): Optional<Chunk.Chunk<A>, Chunk.Chunk<A>> => cons<A>().at("1")
