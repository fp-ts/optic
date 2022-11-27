import * as E from "@fp-ts/data/Either"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as EitherOptic from "@fp-ts/optic/data/Either"

describe("prisms", () => {
  it("right", () => {
    const _right = Optic.id<E.Either<string, number>>()
      .compose(EitherOptic.right())

    expect(_right.getOption(E.right(1))).toEqual(O.some(1))
    expect(_right.getOption(E.left("e"))).toEqual(O.none)
    expect(_right.encode(2)).toEqual(E.right(2))
  })

  it("left", () => {
    const _left = Optic.id<E.Either<string, number>>()
      .compose(EitherOptic.left())

    expect(_left.getOption(E.right(1))).toEqual(O.none)
    expect(_left.getOption(E.left("e"))).toEqual(O.some("e"))
    expect(_left.encode("e")).toEqual(E.left("e"))
  })
})
