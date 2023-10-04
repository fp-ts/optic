import * as Optic from "@fp-ts/optic"
import * as HashMapOptic from "@fp-ts/optic/data/HashMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"
import * as E from "effect/Either"
import { pipe } from "effect/Function"
import * as HashMap from "effect/HashMap"
import * as O from "effect/Option"

describe("HaskMap", () => {
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
    expect(pipe(HashMap.empty(), Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(HashMap.make(["b", 2]), Optic.getOption(_a))).toEqual(O.none())
    expect(pipe(HashMap.make(["b", 2]), _a.getOptic)).toEqual(
      E.left([new Error(`Missing key/index "a"`), HashMap.make(["b", 2])])
    )
    expect(pipe(HashMap.make(["a", 1], ["b", 2]), Optic.getOption(_a))).toEqual(O.some(1))

    expect(pipe(HashMap.make(["b", 2]), _a.setOptic(1))).toEqual(
      E.right(HashMap.make(["a", 1], ["b", 2]))
    )
  })
})
