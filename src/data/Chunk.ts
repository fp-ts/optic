/**
 * @since 1.0.0
 */
import type { Chunk } from "@effect/data/Chunk"
import * as C from "@effect/data/Chunk"
import * as E from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import type { Optional, PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the specified index of a `Chunk`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const index = <A>(i: number): Optional<Chunk<A>, A> =>
  Optic.optional(
    (s) =>
      pipe(
        s,
        C.get(i),
        O.match(
          () => E.left(new Error(`Missing index ${i}`)),
          E.right
        )
      ),
    (a) =>
      (s) =>
        pipe(
          C.replaceOption(i, a)(s),
          O.match(
            () => E.left(new Error(`Missing index ${i}`)),
            E.right
          )
        )
  )

/**
 * An optic that accesses the `Cons` case of a `Chunk`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<Chunk<A>, readonly [A, Chunk<A>]>
  <A, B>(): PolyPrism<Chunk<A>, Chunk<B>, readonly [A, Chunk<A>], readonly [B, Chunk<B>]>
} = <A>() =>
  Optic.prism<Chunk<A>, readonly [A, Chunk<A>]>(
    (s) =>
      pipe(
        C.tail(s),
        O.match(
          () => E.left(new Error("Expected a non empty Chunk")),
          (tail) => E.right([C.unsafeHead(s), tail])
        )
      ),
    ([head, tail]) => C.prepend(head)(tail)
  )

/**
 * @category constructors
 * @since 1.0.0
 */
export const head = <A>(): Optional<Chunk<A>, A> => cons<A>().at("0")

/**
 * @category constructors
 * @since 1.0.0
 */
export const tail = <A>(): Optional<Chunk<A>, Chunk<A>> => cons<A>().at("1")
