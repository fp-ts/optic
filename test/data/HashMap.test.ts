import * as Optic from "@fp-ts/optic"
import * as HashMapOptic from "@fp-ts/optic/data/HashMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"
import { Either, Equal, HashMap, Option, pipe } from "effect"
import { describe, expect, it } from "vitest"

describe("HashMap", () => {
  it("getAt", () => {
    const At = HashMapOptic.getAt<string, number>()
    const remove = AtOptic.remove(At)
    expect(pipe(HashMap.empty(), remove("a"))).toEqual(HashMap.empty())
    expect(pipe(HashMap.make(["b", 2]), remove("a"))).toEqual(HashMap.make(["b", 2]))
    expect(pipe(HashMap.make(["a", 1], ["b", 2]), remove("a"))).toEqual(HashMap.make(["b", 2]))
  })

  it("getIndex", () => {
    const Index = HashMapOptic.getIndex<string, number>()
    const _a = Index.index("a")
    expect(pipe(HashMap.empty(), Optic.getOption(_a))).toEqual(Option.none())
    expect(pipe(HashMap.make(["b", 2]), Optic.getOption(_a))).toEqual(Option.none())
    expect(pipe(HashMap.make(["b", 2]), _a.getOptic)).toEqual(
      Either.left([new Error(`Missing key/index "a"`), HashMap.make(["b", 2])])
    )
    expect(pipe(HashMap.make(["a", 1], ["b", 2]), Optic.getOption(_a))).toEqual(Option.some(1))

    expect(
      Equal.equals(
        pipe(HashMap.make(["b", 2]), _a.setOptic(1)),
        Either.right(HashMap.make(["a", 1], ["b", 2]))
      )
    ).toBe(true)
  })
})
