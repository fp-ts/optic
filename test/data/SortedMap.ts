import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import * as String from "@fp-ts/core/String"
import * as SortedMap from "@fp-ts/data/SortedMap"
import * as Optic from "@fp-ts/optic"
import * as SortedMapOptic from "@fp-ts/optic/data/SortedMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"

describe("SortedMap", () => {
  it.skip("getAt", () => {
    const At = SortedMapOptic.getAt<string, number>()
    const remove = AtOptic.remove(At)
    const empty = SortedMap.empty(String.Order)
    const make = SortedMap.make(String.Order)
    expect(pipe(empty, remove("a"))).toEqual(empty)
    expect(pipe(make(["b", 2]), remove("a"))).toEqual(make(["b", 2]))
    expect(pipe(make(["a", 1], ["b", 2]), remove("a"))).toEqual(make(["b", 2]))
  })

  it.skip("getIndex", () => {
    const Index = SortedMapOptic.getIndex<string, number>()
    const _a = Index.index("a")
    const empty = SortedMap.empty(String.Order)
    const make = SortedMap.make(String.Order)
    expect(pipe(empty, Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(make(["b", 2]), Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(make(["a", 1], ["b", 2]), Optic.getOption(_a))).toEqual(O.some(1))
  })
})
