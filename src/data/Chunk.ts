/**
 * @since 1.0.0
 */
import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import { polyPrism } from "@fp-ts/optic"

/**
 * An optic that accesses the `Cons` case of a `Chunk`.
 *
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<Chunk<A>, readonly [A, Chunk<A>]>
  <A, B>(): PolyPrism<Chunk<A>, Chunk<B>, readonly [A, Chunk<A>], readonly [B, Chunk<B>]>
} = <A, B>(): PolyPrism<Chunk<A>, Chunk<B>, readonly [A, Chunk<A>], readonly [B, Chunk<B>]> =>
  polyPrism(
    (s) =>
      pipe(
        C.tail(s),
        O.match(
          () => E.left([Error(`Nil did not satisfy isCons`), C.empty]),
          (tail) => E.right([C.unsafeHead(s), tail])
        )
      ),
    ([head, tail]): Chunk<B> => C.prepend(head)(tail)
  )
