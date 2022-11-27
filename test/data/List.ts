import type { List } from "@fp-ts/data/List"
import * as L from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ListOptic from "@fp-ts/optic/data/List"

describe("List", () => {
  it("cons", () => {
    const _cons = Optic.id<List<number>>()
      .compose(ListOptic.cons())

    expect(_cons.getOption(L.fromIterable([1, 2, 3]))).toEqual(
      O.some([1, L.fromIterable([2, 3])])
    )
    expect(_cons.getOption(L.nil())).toEqual(O.none)
    expect(_cons.encode([1, L.fromIterable([2, 3])])).toEqual(
      L.fromIterable([1, 2, 3])
    )
  })
})
