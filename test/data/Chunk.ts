import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ChunkOptic from "@fp-ts/optic/data/Chunk"

describe("Chunk", () => {
  it("cons", () => {
    const _cons = Optic.id<Chunk<number>>()
      .compose(ChunkOptic.cons())

    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_cons))).toEqual(
      O.some([1, C.fromIterable([2, 3])])
    )
    expect(pipe(C.empty, Optic.getOption(_cons))).toEqual(O.none)
    expect(pipe([1, C.fromIterable([2, 3])], Optic.encode(_cons))).toEqual(
      C.fromIterable([1, 2, 3])
    )
  })
})
