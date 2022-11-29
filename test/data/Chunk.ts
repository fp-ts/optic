import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ChunkOptic from "@fp-ts/optic/data/Chunk"

describe("Chunk", () => {
  it("index", () => {
    const _index1 = Optic.id<Chunk<number>>().compose(ChunkOptic.index(1))

    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_index1))).toEqual(O.some(2))
    expect(pipe(C.fromIterable([1]), Optic.getOption(_index1))).toEqual(O.none)
    expect(pipe(C.fromIterable([1]), _index1.getOptic)).toEqual(
      E.left([new Error("hasIndex(1)"), C.fromIterable([1])])
    )

    expect(pipe(C.fromIterable([1, 2, 3]), Optic.replace(_index1)(4))).toEqual(
      C.fromIterable([1, 4, 3])
    )
    expect(pipe(C.fromIterable([1]), Optic.replace(_index1)(4))).toEqual(C.fromIterable([1]))
  })

  it("cons", () => {
    const _cons = Optic.id<Chunk<number>>()
      .compose(ChunkOptic.cons())

    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_cons))).toEqual(
      O.some([1, C.fromIterable([2, 3])])
    )
    expect(pipe(C.empty, Optic.getOption(_cons))).toEqual(O.none)
    expect(pipe(C.empty, _cons.getOptic)).toEqual(E.left([new Error("isCons"), C.empty]))
    expect(pipe([1, C.fromIterable([2, 3])], Optic.encode(_cons))).toEqual(
      C.fromIterable([1, 2, 3])
    )
  })
})
