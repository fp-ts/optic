import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as OptionOptic from "@fp-ts/optic/data/Option"

describe("index", () => {
  it("100% coverage", () => {
    expect(Optic.iso).exist
    expect(Optic.lens).exist
    expect(Optic.polyPrism).exist
    expect(Optic.prism).exist
    expect(Optic.polyOptional).exist
    expect(Optic.optional).exist
  })

  it("replaceOption", () => {
    const _at1 = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.index(1))

    expect(pipe([1, 2, 3], Optic.replaceOption(_at1)(4))).toEqual(O.some([1, 4, 3]))
    expect(pipe([1], Optic.replaceOption(_at1)(4))).toEqual(O.none)
  })

  it("getOrModify", () => {
    const _at1 = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.index(1))

    expect(pipe([1, 2, 3], Optic.getOrModify(_at1))).toEqual(E.right(2))
    expect(pipe([1], Optic.getOrModify(_at1))).toEqual(E.left([1]))
  })

  it("modify", () => {
    type S = {
      readonly a: string
      readonly b: O.Option<{
        d: O.Option<number>
      }>
      readonly c: boolean
    }

    const f = Optic.modify(
      Optic.id<S>().compose(Optic.key("b")).compose(OptionOptic.some()).compose(Optic.key("d"))
        .compose(
          OptionOptic.some()
        )
    )((
      n
    ) => n * 2)
    expect(f({ a: "a", b: O.some({ d: O.some(1) }), c: true })).toEqual({
      a: "a",
      b: O.some({ d: O.some(2) }),
      c: true
    })
    expect(f({ a: "a", b: O.some({ d: O.none }), c: true })).toEqual({
      a: "a",
      b: O.some({ d: O.none }),
      c: true
    })
    expect(f({ a: "a", b: O.none, c: true })).toEqual({ a: "a", b: O.none, c: true })
  })

  describe("key", () => {
    it("struct", () => {
      type S = {
        readonly a: string
        readonly b: number
        readonly c: boolean
      }

      const _a = Optic.id<S>()
        .compose(Optic.key("a"))

      expect(pipe({ a: "a", b: 1, c: true }, Optic.get(_a))).toEqual("a")
      expect(pipe({ a: "a", b: 1, c: true }, Optic.set(_a)("a2"))).toEqual({
        a: "a2",
        b: 1,
        c: true
      })
    })

    it("tuple", () => {
      const _0 = Optic.id<readonly [string, number]>()
        .compose(Optic.key("0"))

      expect(pipe(["a", 1], Optic.get(_0))).toEqual("a")
      expect(pipe(["b", 2], Optic.set(_0)("a"))).toEqual(["a", 2])
    })
  })

  it("cons", () => {
    const _cons = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.cons())

    expect(pipe([1, 2, 3], Optic.getOption(_cons))).toEqual(
      O.some([1, [2, 3]])
    )
    expect(pipe([], Optic.getOption(_cons))).toEqual(O.none)
    expect(pipe([1, [2, 3]], Optic.encode(_cons))).toEqual(
      [1, 2, 3]
    )
  })

  it("index", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.index(1))

    expect(pipe([1, 2, 3], Optic.getOption(_index1))).toEqual(O.some(2))
    expect(pipe([1], Optic.getOption(_index1))).toEqual(O.none)
    expect(pipe([1, 2, 3], Optic.replace(_index1)(4))).toEqual([1, 4, 3])
    expect(pipe([1], Optic.replace(_index1)(4))).toEqual([1])
  })

  it("head", () => {
    const _head = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.head())

    expect(pipe([1, 2, 3], Optic.getOption(_head))).toEqual(
      O.some(1)
    )
    expect(pipe([], Optic.getOption(_head))).toEqual(O.none)
    expect(pipe([1, 2, 3], Optic.replace(_head)(4))).toEqual(
      [4, 2, 3]
    )
    expect(pipe([], Optic.replace(_head)(4))).toEqual(
      []
    )
  })

  it("tail", () => {
    const _tail = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.tail())

    expect(pipe([1, 2, 3], Optic.getOption(_tail))).toEqual(
      O.some([2, 3])
    )
    expect(pipe([], Optic.getOption(_tail))).toEqual(O.none)
    expect(pipe([1, 2, 3], Optic.replace(_tail)([4]))).toEqual(
      [1, 4]
    )
    expect(pipe([], Optic.replace(_tail)([4]))).toEqual(
      []
    )
  })

  it("nullable", () => {
    const _nullable = Optic.id<string | undefined | null>()
      .compose(Optic.nullable())

    expect(pipe(null, Optic.getOption(_nullable))).toEqual(O.none)
    expect(pipe(undefined, Optic.getOption(_nullable))).toEqual(O.none)
    expect(pipe("a", Optic.getOption(_nullable))).toEqual(O.some("a"))
    expect(pipe("a", Optic.encode(_nullable))).toEqual("a")
  })
})
