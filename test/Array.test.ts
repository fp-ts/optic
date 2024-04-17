import * as Optic from "@fp-ts/optic"
import * as ArrayOptic from "@fp-ts/optic/Array"
import { pipe } from "effect/Function"
import { describe, expect, it } from "vitest"

describe("Array", () => {
  it("consNonEmpty", () => {
    const iso = ArrayOptic.consNonEmpty<number>()
    expect(pipe([1], Optic.get(iso))).toEqual([1, []])
    expect(pipe([1, [2, 3]], Optic.encode(iso))).toEqual([1, 2, 3])
  })
})
