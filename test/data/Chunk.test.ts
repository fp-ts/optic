import * as Optic from "@fp-ts/optic"
import * as ChunkOptic from "@fp-ts/optic/data/Chunk"
import { Chunk, Either, Equal, Option, pipe } from "effect"
import { describe, expect, it } from "vitest"

describe("Chunk", () => {
  it("index", () => {
    const _index1 = Optic.id<Chunk.Chunk<number>>().compose(ChunkOptic.index(1))

    expect(pipe(Chunk.fromIterable([1, 2, 3]), Optic.getOption(_index1))).toEqual(Option.some(2))
    expect(pipe(Chunk.fromIterable([1]), Optic.getOption(_index1))).toEqual(Option.none())
    expect(pipe(Chunk.fromIterable([1]), _index1.getOptic)).toEqual(
      Either.left([new Error("Missing index 1"), Chunk.fromIterable([1])])
    )

    expect(pipe(Chunk.fromIterable([1, 2, 3]), Optic.replace(_index1)(4))).toEqual(
      Chunk.fromIterable([1, 4, 3])
    )
    expect(pipe(Chunk.fromIterable([1]), Optic.replace(_index1)(4))).toEqual(
      Chunk.fromIterable([1])
    )
  })

  it("cons", () => {
    const _cons = Optic.id<Chunk.Chunk<number>>()
      .compose(ChunkOptic.cons())

    expect(
      pipe(
        Chunk.make(1, 2, 3),
        Optic.getOption(_cons),
        Option.map(([a, chunk]) => [a, Chunk.toReadonlyArray(chunk)])
      )
    )
      .toEqual(
        Option.some([1, [2, 3]])
      )
    expect(pipe(Chunk.empty(), Optic.getOption(_cons))).toEqual(Option.none())
    expect(pipe(Chunk.empty(), _cons.getOptic)).toEqual(
      Either.left([new Error("Expected a non empty Chunk"), Chunk.empty()])
    )
    expect(
      Equal.equals(
        pipe([1, Chunk.make(2, 3)], Optic.encode(_cons)),
        Chunk.make(1, 2, 3)
      )
    ).toBe(true)
  })

  it("head", () => {
    const _head = Optic.id<Chunk.Chunk<number>>()
      .compose(ChunkOptic.head())
    expect(pipe(Chunk.empty(), Optic.getOption(_head))).toEqual(Option.none())
    expect(Equal.equals(pipe(Chunk.make(1, 2, 3), Optic.getOption(_head)), Option.some(1))).toBe(
      true
    )
    expect(pipe(Chunk.empty(), _head.getOptic)).toEqual(
      Either.left([new Error("Expected a non empty Chunk"), Chunk.empty()])
    )
    expect(pipe(Chunk.empty(), Optic.replace(_head)(3))).toEqual(Chunk.empty())
    expect(Equal.equals(pipe(Chunk.make(1, 2), Optic.replace(_head)(3)), Chunk.make(3, 2))).toBe(
      true
    )
  })

  it("tail", () => {
    const _tail = Optic.id<Chunk.Chunk<number>>()
      .compose(ChunkOptic.tail())
    expect(pipe(Chunk.empty(), Optic.getOption(_tail))).toEqual(Option.none())
    expect(pipe(Chunk.fromIterable([1]), Optic.getOption(_tail))).toEqual(
      Option.some(Chunk.empty())
    )
    expect(
      Equal.equals(pipe(Chunk.make(1, 2, 3), Optic.getOption(_tail)), Option.some(Chunk.make(2, 3)))
    ).toBe(true)
    expect(pipe(Chunk.empty(), _tail.getOptic)).toEqual(
      Either.left([new Error("Expected a non empty Chunk"), Chunk.empty()])
    )
    expect(pipe(Chunk.empty(), Optic.replace(_tail)(Chunk.fromIterable([3, 4])))).toEqual(
      Chunk.empty()
    )
    expect(
      Equal.equals(
        pipe(Chunk.make(1, 2), Optic.replace(_tail)(Chunk.make(3, 4))),
        Chunk.make(1, 3, 4)
      )
    ).toBe(true)
  })
})
