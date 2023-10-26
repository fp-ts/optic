import * as Optic from "@fp-ts/optic"
import * as SortedMapOptic from "@fp-ts/optic/data/SortedMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"
import { pipe } from "effect/Function"
import * as O from "effect/Option"
import * as SortedMap from "effect/SortedMap"
import * as String from "effect/String"
import { describe, expect, it } from "vitest"

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
