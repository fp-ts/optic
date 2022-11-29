/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import type { List } from "@fp-ts/data/List"
import * as L from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import type { Optional, PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the specified index of a `List`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const index = <A>(i: number): Optional<List<A>, A> =>
  Optic.optional(
    (s) =>
      pipe(
        s,
        L.get(i),
        O.match(
          () => E.left(new Error(`hasIndex(${i})`)),
          E.right
        )
      ),
    (a) =>
      (s) =>
        pipe(
          L.replaceOption(i, a)(s),
          O.match(
            () => E.left(new Error(`hasIndex(${i})`)),
            E.right
          )
        )
  )

/**
 * An optic that accesses the `Cons` case of a `List`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<List<A>, readonly [A, List<A>]>
  <A, B>(): PolyPrism<List<A>, List<B>, readonly [A, List<A>], readonly [B, List<B>]>
} = <A>() =>
  Optic.prism<List<A>, readonly [A, List<A>]>(
    (s) =>
      L.isCons(s) ?
        E.right([s.head, s.tail]) :
        E.left(Error("isCons")),
    ([head, tail]) => L.cons(head, tail)
  )

/**
 * @category constructors
 * @since 1.0.0
 */
export const head = <A>(): Optional<List<A>, A> => cons<A>().at("0")

/**
 * @category constructors
 * @since 1.0.0
 */
export const tail = <A>(): Optional<List<A>, List<A>> => cons<A>().at("1")
