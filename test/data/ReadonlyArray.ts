import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ReadonlyArrayOptic from "@fp-ts/optic/data/ReadonlyArray"

describe("ReadonlyArray", () => {
  it("getIndex", () => {
    const Index = ReadonlyArrayOptic.getIndex<number>()
    const _0 = Index.index(0)
    expect(pipe([], Optic.getOption(_0))).toEqual(O.none)
    expect(pipe([], _0.getOptic)).toEqual(E.left([new Error("hasIndex(0)"), []]))
    expect(pipe([1, 2, 3], Optic.getOption(_0))).toEqual(O.some(1))
  })

  it("consNonEmpty", () => {
    const iso = ReadonlyArrayOptic.consNonEmpty<number>()
    expect(pipe([1], Optic.get(iso))).toEqual([1, []])
    expect(pipe([1, [2, 3]], Optic.encode(iso))).toEqual([1, 2, 3])
  })
})
