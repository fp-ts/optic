import * as Optic from "@fp-ts/optic"
import * as E from "effect/Either"
import { identity, pipe, unsafeCoerce } from "effect/Function"
import * as O from "effect/Option"
import { isString } from "effect/String"
import { describe, expect, it } from "vitest"

describe("index", () => {
  it("decode", () => {
    const _some = Optic.id<O.Option<number>>().some()

    expect(pipe(O.none(), Optic.decode(_some))).toEqual(
      E.left(new Error("Expected a Some"))
    )
  })

  it("replaceOption", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(pipe([1, 2, 3], Optic.replaceOption(_index1)(4))).toEqual(O.some([1, 4, 3]))
    expect(pipe([1], Optic.replaceOption(_index1)(4))).toEqual(O.none())
  })

  it("getOrModify", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(pipe([1, 2, 3], Optic.getOrModify(_index1))).toEqual(E.right(2))
    expect(pipe([1], Optic.getOrModify(_index1))).toEqual(E.left([1]))
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
      Optic.id<S>()
        .at("b")
        .some()
        .at("d")
        .some()
    )((n) => n * 2)

    expect(f({ a: "a", b: O.some({ d: O.some(1) }), c: true })).toEqual({
      a: "a",
      b: O.some({ d: O.some(2) }),
      c: true
    })
    expect(f({ a: "a", b: O.some({ d: O.none() }), c: true })).toEqual({
      a: "a",
      b: O.some({ d: O.none() }),
      c: true
    })
    expect(f({ a: "a", b: O.none(), c: true })).toEqual({ a: "a", b: O.none(), c: true })
  })

  describe("at", () => {
    it("struct", () => {
      type S = {
        readonly a: string
        readonly b: number
        readonly c: boolean
      }

      const _a = Optic.id<S>().at("a")

      expect(pipe({ a: "a", b: 1, c: true }, Optic.get(_a))).toEqual("a")
      expect(pipe({ a: "a", b: 1, c: true }, Optic.replace(_a)("a2"))).toEqual({
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

      expect(pipe({ a: "a", [b]: 1 }, Optic.get(_b))).toEqual(1)
      expect(pipe({ a: "a", [b]: 1 }, Optic.replace(_b)(2))).toEqual({
        a: "a",
        [b]: 2
      })
    })

    it("tuple", () => {
      type S = readonly [string, number]
      const _0 = Optic.id<S>().at("0")

      expect(pipe(["a", 1], Optic.get(_0))).toEqual("a")
      expect(pipe(["b", 2], Optic.replace(_0)("a"))).toEqual(["a", 2])
    })
  })

  it("cons", () => {
    const _cons = Optic.cons<number>()

    expect(pipe([1, 2, 3], Optic.getOption(_cons))).toEqual(
      O.some([1, [2, 3]])
    )
    expect(pipe([], Optic.getOption(_cons))).toEqual(O.none())
    expect(pipe([], _cons.getOptic)).toEqual(
      E.left([new Error("Expected a non empty array"), []])
    )
    expect(pipe([1, [2, 3]], Optic.encode(_cons))).toEqual(
      [1, 2, 3]
    )
  })

  it("index", () => {
    const _index1 = Optic.id<ReadonlyArray<number>>().index(1)

    expect(pipe([1, 2, 3], Optic.getOption(_index1))).toEqual(O.some(2))
    expect(pipe([1], Optic.getOption(_index1))).toEqual(O.none())
    expect(pipe([1], _index1.getOptic)).toEqual(
      E.left([new Error("Missing index 1"), [1]])
    )

    expect(pipe([1, 2, 3], Optic.replace(_index1)(4))).toEqual([1, 4, 3])
    expect(pipe([1], Optic.replace(_index1)(4))).toEqual([1])
  })

  it("indexes", () => {
    const _indexes = Optic.indexes<number>()

    expect(pipe([], Optic.getOption(_indexes))).toEqual(O.some([]))
    expect(pipe([1, 2, 3], Optic.getOption(_indexes))).toEqual(O.some([1, 2, 3]))

    expect(pipe([], Optic.replace(_indexes))([4, 5])).toEqual([4, 5])
    expect(pipe([1, 2, 3], Optic.replace(_indexes)([4, 5]))).toEqual([4, 5, 3])
  })

  it("key/ string keys", () => {
    const _keya = Optic.id<Record<string, number>>().key("a")

    expect(pipe({ a: 1 }, Optic.getOption(_keya))).toEqual(O.some(1))
    expect(pipe({ b: 2 }, Optic.getOption(_keya))).toEqual(O.none())
    expect(pipe({ b: 2 }, _keya.getOptic)).toEqual(
      E.left([new Error(`Missing key "a"`), { b: 2 }])
    )

    expect(pipe({ a: 1, b: 2 }, Optic.replace(_keya)(3))).toEqual({ a: 3, b: 2 })
    expect(pipe({ b: 2 }, Optic.replace(_keya)(3))).toEqual({ b: 2 })
  })

  it("pick", () => {
    type S = {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }

    const _ab = Optic.id<S>().pick("a", "b")

    expect(pipe({ a: "a", b: 1, c: true }, Optic.get(_ab))).toEqual({ a: "a", b: 1 })
    expect(pipe({ a: "a1", b: 1, c: true }, Optic.replace(_ab)({ a: "a2", b: 2 }))).toEqual({
      a: "a2",
      b: 2,
      c: true
    })
  })

  it("omit", () => {
    type S = {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }

    const _ab = Optic.id<S>().omit("c")

    expect(pipe({ a: "a", b: 1, c: true }, Optic.get(_ab))).toEqual({ a: "a", b: 1 })
    expect(pipe({ a: "a1", b: 1, c: true }, Optic.replace(_ab)({ a: "a2", b: 2 }))).toEqual({
      a: "a2",
      b: 2,
      c: true
    })
  })

  it("head", () => {
    const _head = Optic.id<ReadonlyArray<number>>()
      .compose(Optic.head())

    expect(pipe([1, 2, 3], Optic.getOption(_head))).toEqual(
      O.some(1)
    )
    expect(pipe([], Optic.getOption(_head))).toEqual(O.none())
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
    expect(pipe([], Optic.getOption(_tail))).toEqual(O.none())
    expect(pipe([1, 2, 3], Optic.replace(_tail)([4]))).toEqual(
      [1, 4]
    )
    expect(pipe([], Optic.replace(_tail)([4]))).toEqual(
      []
    )
  })

  it("nonNullable", () => {
    const _nonNullable = Optic.id<string | undefined | null>()
      .nonNullable()

    expect(pipe("a", Optic.getOption(_nonNullable))).toEqual(O.some("a"))
    expect(pipe(null, Optic.getOption(_nonNullable))).toEqual(O.none())
    expect(pipe(undefined, Optic.getOption(_nonNullable))).toEqual(O.none())
    expect(pipe(null, _nonNullable.getOptic)).toEqual(
      E.left([new Error("Expected a non nullable value"), null])
    )
    expect(pipe("a", Optic.encode(_nonNullable))).toEqual("a")
  })

  it("some", () => {
    const _some = Optic.id<O.Option<string>>().some()

    expect(pipe(O.some("a"), Optic.getOption(_some))).toEqual(O.some("a"))
    expect(pipe(O.none(), Optic.getOption(_some))).toEqual(O.none())
    expect(pipe(O.none(), _some.getOptic)).toEqual(
      E.left([new Error("Expected a Some"), O.none()])
    )
    expect(pipe("a", Optic.encode(_some))).toEqual(O.some("a"))
  })

  it("filter", () => {
    type A = [true, string]
    type B = [false, number]
    type S = A | B

    const isA = (s: S): s is A => s[0] === true

    const _A = Optic.id<S>().filter(isA, "Expected an instance of A")

    expect(pipe([true, "a"], Optic.getOption(_A))).toEqual(O.some([true, "a"]))
    expect(pipe([false, 1], Optic.getOption(_A))).toEqual(O.none())
    expect(pipe([false, 1], _A.getOptic)).toEqual(
      E.left([new Error("Expected an instance of A"), [false, 1]])
    )

    expect(pipe([true, "a"], Optic.encode(_A))).toEqual([true, "a"])
  })

  it("filter/ default error message", () => {
    const _int = Optic.id<number>().filter(Number.isInteger)
    expect(pipe(1.1, _int.getOptic)).toEqual(
      E.left([new Error("Expected a value satisfying the specified predicate"), 1.1])
    )
  })

  it("reversedFilter", () => {
    type Int = number & { __brand: "Int" }

    const isInt = (n: number): n is Int => Number.isInteger(n)

    const Unsafe: Optic.Iso<Int, number> = Optic.iso<Int, number>(identity, unsafeCoerce)
    const Safe: Optic.ReversedPrism<Int, number> = Optic.reversedFilter(isInt)

    type S = {
      readonly a: Int
    }

    const _a = Optic.id<S>().at("a").compose(Safe)

    const s: S = {
      a: pipe(1, Optic.encode(Unsafe))
    }

    expect(pipe(s, Optic.get(_a))).toEqual(1)
    expect(pipe(s, Optic.replace(_a)(2))).toEqual({ a: 2 })
    expect(pipe(s, Optic.replace(_a)(2.1))).toEqual({ a: 1 })

    expect(Optic.modify(_a)((n) => n * 2)(s)).toEqual({ a: 2 })
    expect(Optic.modify(_a)((n) => n / 2)(s)).toEqual({ a: 1 })
  })

  it("findFirst", () => {
    const _firstString = Optic.id<ReadonlyArray<string | number>>()
      .compose(Optic.findFirst(isString, "Expected a string"))
    expect(pipe([1, 2, "a", 3, "b"], Optic.getOption(_firstString))).toEqual(O.some("a"))
    expect(pipe([1, 2, 3], Optic.getOption(_firstString))).toEqual(O.none())
    expect(pipe([1, 2, 3], _firstString.getOptic)).toEqual(
      E.left([new Error("Expected a string"), [1, 2, 3]])
    )

    expect(pipe([1, 2, "a", 3, "b"], Optic.replaceOption(_firstString)("c"))).toEqual(
      O.some([1, 2, "c", 3, "b"])
    )
    expect(pipe([1, 2, 3], Optic.replaceOption(_firstString)("c"))).toEqual(O.none())
    expect(pipe([1, 2, 3], _firstString.setOptic("c"))).toEqual(
      E.left([new Error("Expected a string"), [1, 2, 3]])
    )
  })

  it("findFirst/ default error message", () => {
    const _firstString = Optic.id<ReadonlyArray<string | number>>()
      .compose(Optic.findFirst(isString))
    expect(pipe([1, 2, 3], _firstString.getOptic)).toEqual(
      E.left([new Error("Expected a value satisfying the specified predicate"), [1, 2, 3]])
    )
    expect(pipe([1, 2, 3], _firstString.setOptic("c"))).toEqual(
      E.left([new Error("Expected a value satisfying the specified predicate"), [1, 2, 3]])
    )
  })

  it("PolyLens", () => {
    type S = {
      a: { b: string }
    }
    type T = {
      a: { b: number }
    }
    const _a = Optic.id<S, T>().at("a").at("b")
    expect(pipe({ a: { b: "b" } }, Optic.get(_a))).toEqual("b")

    expect(pipe({ a: { b: "b" } }, Optic.replace(_a)(1))).toEqual({ a: { b: 1 } })
  })
})
