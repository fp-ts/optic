import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import type { List } from "@fp-ts/data/List"
import * as list from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import * as _ from "@fp-ts/optic"

describe("Optic", () => {
  it("100% coverage", () => {
    expect(_.isoP).exist
    expect(_.iso).exist
    expect(_.lensP).exist
    expect(_.lens).exist
    expect(_.prismP).exist
    expect(_.prism).exist
    expect(_.optionalP).exist
    expect(_.optional).exist

    expect(_.someP).exist
    expect(_.rightP).exist
    expect(_.leftP).exist
    expect(_.consP).exist
  })

  it("replaceOption", () => {
    const _at1 = _.id<ReadonlyArray<number>>()
      .compose(_.at(1))

    expect(pipe([1, 2, 3], _.replaceOption(_at1)(4))).toEqual(O.some([1, 4, 3]))
    expect(pipe([1], _.replaceOption(_at1)(4))).toEqual(O.none)
  })

  it("getOrModify", () => {
    const _at1 = _.id<ReadonlyArray<number>>()
      .compose(_.at(1))

    expect(pipe([1, 2, 3], _.getOrModify(_at1))).toEqual(E.right(2))
    expect(pipe([1], _.getOrModify(_at1))).toEqual(E.left([1]))
  })

  it("modify", () => {
    type S = {
      readonly a: string
      readonly b: O.Option<{
        d: O.Option<number>
      }>
      readonly c: boolean
    }

    const f = _.modify(
      _.id<S>().compose(_.field("b")).compose(_.some()).compose(_.field("d")).compose(_.some())
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

  describe("lenses", () => {
    type S = {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }

    it("field", () => {
      const _a = _.id<S>()
        .compose(_.field("a"))

      expect(pipe({ a: "a", b: 1, c: true }, _.get(_a))).toEqual("a")
      expect(pipe({ a: "a", b: 1, c: true }, _.set(_a)("a2"))).toEqual({ a: "a2", b: 1, c: true })
    })

    it("fields", () => {
      const _a_b = _.id<S>()
        .compose(_.fields("a", "b"))

      expect(pipe({ a: "a", b: 1, c: true }, _.get(_a_b))).toEqual({ a: "a", b: 1 })
      expect(pipe({ a: "a1", b: 1, c: true }, _.set(_a_b)({ a: "a2", b: 2 }))).toEqual({
        a: "a2",
        b: 2,
        c: true
      })
    })

    it("component", () => {
      const _0 = _.id<readonly [string, number]>()
        .compose(_.component("0"))

      expect(pipe(["a", 1], _.get(_0))).toEqual("a")
      expect(pipe(["b", 2], _.set(_0)("a"))).toEqual(["a", 2])
    })

    it("first", () => {
      const _0 = _.id<readonly [string, number]>()
        .compose(_.first())

      expect(pipe(["a", 1], _.get(_0))).toEqual("a")
      expect(pipe(["b", 2], _.set(_0)("a"))).toEqual(["a", 2])
    })

    it("second", () => {
      const _1 = _.id<readonly [string, number]>()
        .compose(_.second())

      expect(pipe(["a", 1], _.get(_1))).toEqual(1)
      expect(pipe(["b", 2], _.set(_1)(3))).toEqual(["b", 3])
    })
  })

  describe("prisms", () => {
    it("none", () => {
      const _none = _.id<O.Option<string>>()
        .compose(_.none())

      expect(pipe(O.none, _.getOption(_none))).toEqual(O.some(undefined))
      expect(pipe(O.some("a"), _.getOption(_none))).toEqual(O.none)
      expect(pipe(undefined, _.encode(_none))).toEqual(O.none)
    })

    it("some", () => {
      const _some = _.id<O.Option<string>>()
        .compose(_.some())

      expect(pipe(O.none, _.getOption(_some))).toEqual(O.none)
      expect(pipe(O.some("a"), _.getOption(_some))).toEqual(O.some("a"))
      expect(pipe("a", _.encode(_some))).toEqual(O.some("a"))
    })

    it("right", () => {
      const _right = _.id<E.Either<string, number>>()
        .compose(_.right())

      expect(pipe(E.right(1), _.getOption(_right))).toEqual(O.some(1))
      expect(pipe(E.left("e"), _.getOption(_right))).toEqual(O.none)
      expect(pipe(2, _.encode(_right))).toEqual(E.right(2))
    })

    it("left", () => {
      const _left = _.id<E.Either<string, number>>()
        .compose(_.left())

      expect(pipe(E.right(1), _.getOption(_left))).toEqual(O.none)
      expect(pipe(E.left("e"), _.getOption(_left))).toEqual(O.some("e"))
      expect(pipe("e", _.encode(_left))).toEqual(E.left("e"))
    })

    it("cons", () => {
      const _cons = _.id<List<number>>()
        .compose(_.cons())

      expect(pipe(list.fromIterable([1, 2, 3]), _.getOption(_cons))).toEqual(
        O.some([1, list.fromIterable([2, 3])])
      )
      expect(pipe(list.nil(), _.getOption(_cons))).toEqual(O.none)
      expect(pipe([1, list.fromIterable([2, 3])], _.encode(_cons))).toEqual(
        list.fromIterable([1, 2, 3])
      )
    })
  })

  describe("optionals", () => {
    it("at", () => {
      const _at1 = _.id<ReadonlyArray<number>>()
        .compose(_.at(1))

      expect(pipe([1, 2, 3], _.getOption(_at1))).toEqual(O.some(2))
      expect(pipe([1], _.getOption(_at1))).toEqual(O.none)
      expect(pipe([1, 2, 3], _.replace(_at1)(4))).toEqual([1, 4, 3])
      expect(pipe([1], _.replace(_at1)(4))).toEqual([1])
    })
  })
})
