import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ChunkOptic from "@fp-ts/optic/data/Chunk"

describe("Chunk", () => {
  it("cons", () => {
    const _cons = Optic.id<Chunk<number>>()
      .compose(ChunkOptic.cons())

    expect(_cons.getOption(C.fromIterable([1, 2, 3]))).toEqual(
      O.some([1, C.fromIterable([2, 3])])
    )
    expect(_cons.getOption(C.empty)).toEqual(O.none)
    expect(_cons.encode([1, C.fromIterable([2, 3])])).toEqual(
      C.fromIterable([1, 2, 3])
    )
  })
})
