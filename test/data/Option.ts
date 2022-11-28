import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as OptionOptic from "@fp-ts/optic/data/Option"

describe("Option", () => {
  it("none", () => {
    const _none = Optic.id<O.Option<string>>()
      .compose(OptionOptic.none())

    expect(pipe(O.none, Optic.getOption(_none))).toEqual(O.some(undefined))
    expect(pipe(O.some("a"), Optic.getOption(_none))).toEqual(O.none)
    expect(pipe(O.some("a"), _none.getOptic)).toEqual(E.left([new Error("isNone"), O.some("a")]))
    expect(pipe(undefined, Optic.encode(_none))).toEqual(O.none)
  })
})
