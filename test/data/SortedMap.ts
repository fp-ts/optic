import { pipe } from "@fp-ts/data/Function"
import * as SortedMap from "@fp-ts/data/SortedMap"
import * as String from "@fp-ts/data/String"
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
})
