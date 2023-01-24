/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/core/Either"
import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
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
          () => E.left(new Error(`hasIndex(${i})`)),
          E.right
        )
      ),
    (a) =>
      (s) =>
        pipe(
          C.replaceOption(i, a)(s),
          O.match(
            () => E.left(new Error(`hasIndex(${i})`)),
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
          () => E.left(Error("isCons")),
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
