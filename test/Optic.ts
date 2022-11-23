import * as E from "@fp-ts/data/Either"
import type { List } from "@fp-ts/data/List"
import * as list from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import * as _ from "@fp-ts/optic"

describe("Optic", () => {
  it("100% coverage", () => {
    expect(_.optic).exist
    expect(_.isoP).exist
    expect(_.iso).exist
    expect(_.lensP).exist
    expect(_.lens).exist
    expect(_.prismP).exist
    expect(_.prism).exist
    expect(_.optionalP).exist
    expect(_.optional).exist
    expect(_.traversalP).exist
    expect(_.traversal).exist

    expect(_.someP).exist
    expect(_.rightP).exist
    expect(_.leftP).exist
    expect(_.consP).exist
  })

  describe("lenses", () => {
    it("prop", () => {
      const lens = _.id<{ readonly a: string; readonly b: number }>()
        .compose(_.prop("a"))

      expect(_.get(lens)({ a: "a", b: 1 })).toEqual("a")
      expect(lens.setOptic("c")({ a: "a", b: 1 })).toEqual(E.right({ a: "c", b: 1 }))
    })

    it("component", () => {
      const lens = _.id<readonly [string, number]>()
        .compose(_.component("0"))

      expect(lens.getOptic(["a", 1])).toEqual(E.right("a"))
      expect(lens.setOptic("a")(["b", 2])).toEqual(E.right(["a", 2]))
    })

    it("first", () => {
      const lens = _.id<readonly [string, number]>()
        .compose(_.first())

      expect(lens.getOptic(["a", 1])).toEqual(E.right("a"))
      expect(lens.setOptic("a")(["b", 2])).toEqual(E.right(["a", 2]))
    })

    it("second", () => {
      const lens = _.id<readonly [string, number]>()
        .compose(_.second())

      expect(lens.getOptic(["a", 1])).toEqual(E.right(1))
      expect(lens.setOptic(3)(["b", 2])).toEqual(E.right(["b", 3]))
    })
  })

  describe("prisms", () => {
    it("none", () => {
      const prism = _.id<O.Option<string>>()
        .compose(_.none())

      expect(prism.getOptic(O.none)).toEqual(E.right(undefined))
      expect(prism.getOptic(O.some("a"))).toEqual(
        E.left([_.opticError("some(a) did not satisfy isNone"), O.some("a")])
      )
      expect(prism.setOptic(undefined)(undefined)).toEqual(E.right(O.none))
    })

    it("some", () => {
      const prism = _.id<O.Option<string>>()
        .compose(_.some())

      expect(prism.getOptic(O.none)).toEqual(
        E.left([_.opticError("none did not satisfy isSome"), O.none])
      )
      expect(prism.getOptic(O.some("a"))).toEqual(E.right("a"))
      expect(prism.setOptic("b")(undefined)).toEqual(E.right(O.some("b")))
    })

    it("right", () => {
      const prism = _.id<E.Either<string, number>>()
        .compose(_.right())

      expect(prism.getOptic(E.right(1))).toEqual(E.right(1))
      expect(prism.getOptic(E.left("e"))).toEqual(
        E.left([_.opticError("left(e) did not satisfy isRight"), E.left("e")])
      )
      expect(prism.setOptic(2)(undefined)).toEqual(E.right(E.right(2)))
    })

    it("left", () => {
      const prism = _.id<E.Either<string, number>>()
        .compose(_.left())

      expect(prism.getOptic(E.left("e"))).toEqual(E.right("e"))
      expect(prism.getOptic(E.right(1))).toEqual(
        E.left([_.opticError("right(1) did not satisfy isLeft"), E.right(1)])
      )
      expect(prism.setOptic("e2")(undefined)).toEqual(E.right(E.left("e2")))
    })

    it("cons", () => {
      const prism = _.id<List<number>>()
        .compose(_.cons())

      expect(prism.getOptic(list.fromIterable([1, 2, 3]))).toEqual(
        E.right([1, list.fromIterable([2, 3])])
      )
      expect(prism.getOptic(list.nil())).toEqual(
        E.left([_.opticError("Nil did not satisfy isCons"), list.nil()])
      )
      expect(prism.setOptic([1, list.fromIterable([2, 3])])(undefined)).toEqual(
        E.right(list.fromIterable([1, 2, 3]))
      )
    })
  })

  describe("optionals", () => {
    it("at", () => {
      const optional = _.id<ReadonlyArray<number>>()
        .compose(_.at(0))

      expect(optional.getOptic([1, 2, 3])).toEqual(E.right(1))
      expect(optional.getOptic([])).toEqual(
        E.left([_.opticError(" did not satisfy hasAt(0)"), []])
      )
      expect(optional.setOptic(4)([1, 2, 3])).toEqual(E.right([4, 2, 3]))
      expect(optional.setOptic(4)([])).toEqual(
        E.left([_.opticError(" did not satisfy hasAt(0)"), []])
      )
    })

    it("some", () => {
      const optional = _.id<{ a: O.Option<string> }>()
        .compose(_.prop("a"))
        .compose(_.some())

      expect(_.getOption(optional)({ a: O.some("a") })).toEqual(O.some("a"))
    })
  })
})
