import { pipe } from "@effect/data/Function"
import * as Optic from "@fp-ts/optic"
import * as ReadonlyArrayOptic from "@fp-ts/optic/data/ReadonlyArray"

describe("ReadonlyArray", () => {
  it("consNonEmpty", () => {
    const iso = ReadonlyArrayOptic.consNonEmpty<number>()
    expect(pipe([1], Optic.get(iso))).toEqual([1, []])
    expect(pipe([1, [2, 3]], Optic.encode(iso))).toEqual([1, 2, 3])
  })
})
