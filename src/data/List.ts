/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import type { List } from "@fp-ts/data/List"
import * as L from "@fp-ts/data/List"
import type { PolyPrism, Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the `Cons` case of a `List`.
 *
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
