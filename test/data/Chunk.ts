import * as E from "@fp-ts/core/Either"
import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import type { Chunk } from "@fp-ts/data/Chunk"
import * as C from "@fp-ts/data/Chunk"
import * as Optic from "@fp-ts/optic"
import * as ChunkOptic from "@fp-ts/optic/data/Chunk"

describe("Chunk", () => {
  it("index", () => {
    const _index1 = Optic.id<Chunk<number>>().compose(ChunkOptic.index(1))

    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_index1))).toEqual(O.some(2))
    expect(pipe(C.fromIterable([1]), Optic.getOption(_index1))).toEqual(O.none())
    expect(pipe(C.fromIterable([1]), _index1.getOptic)).toEqual(
      E.left([new Error("Missing index 1"), C.fromIterable([1])])
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
    expect(pipe(C.empty(), Optic.getOption(_cons))).toEqual(O.none())
    expect(pipe(C.empty(), _cons.getOptic)).toEqual(
      E.left([new Error("Expected a non empty Chunk"), C.empty()])
    )
    expect(pipe([1, C.fromIterable([2, 3])], Optic.encode(_cons))).toEqual(
      C.fromIterable([1, 2, 3])
    )
  })

  it("head", () => {
    const _head = Optic.id<Chunk<number>>()
      .compose(ChunkOptic.head())
    expect(pipe(C.empty(), Optic.getOption(_head))).toEqual(O.none())
    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_head))).toEqual(O.some(1))
    expect(pipe(C.empty(), _head.getOptic)).toEqual(
      E.left([new Error("Expected a non empty Chunk"), C.empty()])
    )
    expect(pipe(C.empty(), Optic.replace(_head)(3))).toEqual(C.empty())
    expect(pipe(C.fromIterable([1, 2]), Optic.replace(_head)(3))).toEqual(C.fromIterable([3, 2]))
  })

  it("tail", () => {
    const _tail = Optic.id<Chunk<number>>()
      .compose(ChunkOptic.tail())
    expect(pipe(C.empty(), Optic.getOption(_tail))).toEqual(O.none())
    expect(pipe(C.fromIterable([1]), Optic.getOption(_tail))).toEqual(
      O.some(C.empty())
    )
    expect(pipe(C.fromIterable([1, 2, 3]), Optic.getOption(_tail))).toEqual(
      O.some(C.fromIterable([2, 3]))
    )
    expect(pipe(C.empty(), _tail.getOptic)).toEqual(
      E.left([new Error("Expected a non empty Chunk"), C.empty()])
    )
    expect(pipe(C.empty(), Optic.replace(_tail)(C.fromIterable([3, 4])))).toEqual(C.empty())
    expect(pipe(C.fromIterable([1, 2]), Optic.replace(_tail)(C.fromIterable([3, 4])))).toEqual(
      C.fromIterable([1, 3, 4])
    )
  })
})
