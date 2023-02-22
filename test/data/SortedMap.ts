import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import * as SortedMap from "@effect/data/SortedMap"
import * as String from "@effect/data/String"
import * as Optic from "@fp-ts/optic"
import * as SortedMapOptic from "@fp-ts/optic/data/SortedMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"

describe("SortedMap", () => {
  it("getAt", () => {
    const At = SortedMapOptic.getAt<string, number>()
    const remove = AtOptic.remove(At)
    const empty = SortedMap.empty(String.Order)
    const make = SortedMap.make(String.Order)
    expect(pipe(empty, remove("a"))).toEqual(empty)
    expect(pipe(make(["b", 2]), remove("a"))).toEqual(make(["b", 2]))
    expect(pipe(make(["a", 1], ["b", 2]), remove("a"))).toEqual(make(["b", 2]))
  })

  it("getIndex", () => {
    const Index = SortedMapOptic.getIndex<string, number>()
    const _a = Index.index("a")
    const empty = SortedMap.empty(String.Order)
    const make = SortedMap.make(String.Order)
    expect(pipe(empty, Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(make(["b", 2]), Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(make(["a", 1], ["b", 2]), Optic.getOption(_a))).toEqual(O.some(1))
  })
})
