import { pipe } from "@fp-ts/data/Function"
import type { List } from "@fp-ts/data/List"
import * as L from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ListOptic from "@fp-ts/optic/data/List"

describe("List", () => {
  it("consList", () => {
    const _cons = Optic.id<List<number>>()
      .compose(ListOptic.cons())

    expect(pipe(L.fromIterable([1, 2, 3]), Optic.getOption(_cons))).toEqual(
      O.some([1, L.fromIterable([2, 3])])
    )
    expect(pipe(L.nil(), Optic.getOption(_cons))).toEqual(O.none)
    expect(pipe([1, L.fromIterable([2, 3])], Optic.encode(_cons))).toEqual(
      L.fromIterable([1, 2, 3])
    )
  })
})
