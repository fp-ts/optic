import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as EitherOptic from "@fp-ts/optic/data/Either"

describe("prisms", () => {
  it("right", () => {
    const _right = Optic.id<E.Either<string, number>>()
      .compose(EitherOptic.right())

    expect(pipe(E.right(1), Optic.getOption(_right))).toEqual(O.some(1))
    expect(pipe(E.left("e"), Optic.getOption(_right))).toEqual(O.none)
    expect(pipe(E.left("e"), _right.getOptic)).toEqual(E.left([new Error("isRight"), E.left("e")]))
    expect(pipe(2, Optic.encode(_right))).toEqual(E.right(2))
  })

  it("left", () => {
    const _left = Optic.id<E.Either<string, number>>()
      .compose(EitherOptic.left())

    expect(pipe(E.left("e"), Optic.getOption(_left))).toEqual(O.some("e"))
    expect(pipe(E.right(1), Optic.getOption(_left))).toEqual(O.none)
    expect(pipe(E.right(1), _left.getOptic)).toEqual(E.left([new Error("isLeft"), E.right(1)]))
    expect(pipe("e", Optic.encode(_left))).toEqual(E.left("e"))
  })
})
