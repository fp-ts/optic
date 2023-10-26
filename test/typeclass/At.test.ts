import * as HashMapOptic from "@fp-ts/optic/data/HashMap"
import * as AtOptic from "@fp-ts/optic/typeclass/At"
import { pipe } from "effect/Function"
import * as HashMap from "effect/HashMap"
import { describe, expect, it } from "vitest"

describe("At", () => {
  it("remove", () => {
    const At = HashMapOptic.getAt<string, number>()
    const remove = AtOptic.remove(At)
    expect(pipe(HashMap.empty(), remove("a"))).toEqual(HashMap.empty())
    expect(pipe(HashMap.make(["b", 2]), remove("a"))).toEqual(HashMap.make(["b", 2]))
    expect(pipe(HashMap.make(["a", 1], ["b", 2]), remove("a"))).toEqual(HashMap.make(["b", 2]))
  })
})
