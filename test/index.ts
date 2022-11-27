import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"

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
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(pipe([1, 2, 3], _index1.replaceOption(4))).toEqual(O.some([1, 4, 3]))
    expect(pipe([1], _index1.replaceOption(4))).toEqual(O.none)
  })

  it("getOrModify", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(_index1.getOrModify([1, 2, 3])).toEqual(E.right(2))
    expect(_index1.getOrModify([1])).toEqual(E.left([1]))
  })

  it("modify", () => {
    type S = {
      readonly a: string
      readonly b: O.Option<{
        d: O.Option<number>
      }>
      readonly c: boolean
    }

    const f = Optic.id<S>()
      .at("b")
      .some()
      .at("d")
      .some()
      .modify((n) => n * 2)

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

  describe("at", () => {
    it("struct", () => {
      type S = {
        readonly a: string
        readonly b: number
        readonly c: boolean
      }

      const _a = Optic.id<S>().at("a")

      expect(_a.get({ a: "a", b: 1, c: true })).toEqual("a")
      expect(pipe({ a: "a", b: 1, c: true }, _a.replace("a2"))).toEqual({
        a: "a2",
        b: 1,
        c: true
      })
    })

    it("symbol", () => {
      const b = Symbol.for("b")
      type S = {
        readonly a: string
        readonly [b]: number
      }

      const _b = Optic.id<S>().at(b)

      expect(_b.get({ a: "a", [b]: 1 })).toEqual(1)
      expect(pipe({ a: "a", [b]: 1 }, _b.replace(2))).toEqual({
        a: "a",
        [b]: 2
      })
    })

    it("tuple", () => {
      type S = readonly [string, number]
      const _0 = Optic.id<S>().at("0")

      expect(_0.get(["a", 1])).toEqual("a")
      expect(pipe(["b", 2], _0.replace("a"))).toEqual(["a", 2])
    })
  })

  it("cons", () => {
    const _cons = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.cons())

    expect(_cons.getOption([1, 2, 3])).toEqual(
      O.some([1, [2, 3]])
    )
    expect(_cons.getOption([])).toEqual(O.none)
    expect(_cons.encode([1, [2, 3]])).toEqual(
      [1, 2, 3]
    )
  })

  it("index", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(_index1.getOption([1, 2, 3])).toEqual(O.some(2))
    expect(_index1.getOption([1])).toEqual(O.none)
    expect(pipe([1, 2, 3], _index1.replace(4))).toEqual([1, 4, 3])
    expect(pipe([1], _index1.replace(4))).toEqual([1])
  })

  it("head", () => {
    const _head = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.head())

    expect(_head.getOption([1, 2, 3])).toEqual(
      O.some(1)
    )
    expect(_head.getOption([])).toEqual(O.none)
    expect(pipe([1, 2, 3], _head.replace(4))).toEqual(
      [4, 2, 3]
    )
    expect(pipe([], _head.replace(4))).toEqual(
      []
    )
  })

  it("tail", () => {
    const _tail = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.tail())

    expect(_tail.getOption([1, 2, 3])).toEqual(
      O.some([2, 3])
    )
    expect(_tail.getOption([])).toEqual(O.none)
    expect(pipe([1, 2, 3], _tail.replace([4]))).toEqual(
      [1, 4]
    )
    expect(pipe([], _tail.replace([4]))).toEqual(
      []
    )
  })

  it("nonNullable", () => {
    const _nonNullable = Optic.id<string | undefined | null>()
      .compose(Optic.nonNullable())

    expect(_nonNullable.getOption(null)).toEqual(O.none)
    expect(_nonNullable.getOption(undefined)).toEqual(O.none)
    expect(_nonNullable.getOption("a")).toEqual(O.some("a"))
    expect(_nonNullable.encode("a")).toEqual("a")
  })

  it("some", () => {
    const _some = Optic.id<O.Option<string>>().some()

    expect(_some.getOption(O.none)).toEqual(O.none)
    expect(_some.getOption(O.some("a"))).toEqual(O.some("a"))
    expect(_some.encode("a")).toEqual(O.some("a"))
  })

  it("filter", () => {
    type A = [true, string]
    type B = [false, number]
    type S = A | B
    const _A = Optic.id<S>()
      .compose(Optic.filter((s): s is A => s[0] === true))
    expect(_A.getOption([true, "a"])).toEqual(O.some([true, "a"]))
    expect(_A.getOption([false, 1])).toEqual(O.none)

    expect(_A.encode([true, "a"])).toEqual([true, "a"])
  })

  it("findFirst", () => {
    const isString = (u: unknown): u is string => typeof u === "string"
    const _firstString = Optic.id<ReadonlyArray<string | number>>()
      .compose(Optic.findFirst(isString))
    expect(_firstString.getOption([1, 2, "a", 3, "b"])).toEqual(O.some("a"))
    expect(_firstString.getOption([1, 2, 3])).toEqual(O.none)

    expect(pipe([1, 2, "a", 3, "b"], _firstString.replaceOption("c"))).toEqual(
      O.some([1, 2, "c", 3, "b"])
    )
    expect(pipe([1, 2, 3], _firstString.replaceOption("c"))).toEqual(O.none)
  })
})
