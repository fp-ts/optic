import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ReadonlyArrayOptic from "@fp-ts/optic/data/ReadonlyArray"

describe("ReadonlyArray", () => {
  it("getAt", () => {
    const At = ReadonlyArrayOptic.getAt<number>()
    const _0 = At.at(0)
    expect(pipe([], Optic.get(_0))).toEqual(O.none)
    expect(pipe([1, 2, 3], Optic.get(_0))).toEqual(O.some(1))

    expect(pipe([], Optic.replace(_0)(O.some(4)))).toEqual([])
    expect(pipe([1, 2, 3], Optic.replace(_0)(O.some(4)))).toEqual([4, 2, 3])
    expect(pipe([1, 2, 3], Optic.replace(_0)(O.none))).toEqual([2, 3])
  })

  it("getIndex", () => {
    const Index = ReadonlyArrayOptic.getIndex<number>()
    const _0 = Index.index(0)
    expect(pipe([], Optic.getOption(_0))).toEqual(O.none)
    expect(pipe([1, 2, 3], Optic.getOption(_0))).toEqual(O.some(1))
  })
})
