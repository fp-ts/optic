import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as OptionOptic from "@fp-ts/optic/data/Option"

describe("Option", () => {
  it("none", () => {
    const _none = Optic.id<O.Option<string>>()
      .compose(OptionOptic.none())

    expect(_none.getOption(O.none)).toEqual(O.some(undefined))
    expect(_none.getOption(O.some("a"))).toEqual(O.none)
    expect(_none.encode(undefined)).toEqual(O.none)
  })

  it("some", () => {
    const _some = Optic.id<O.Option<string>>()
      .compose(OptionOptic.some())

    expect(_some.getOption(O.none)).toEqual(O.none)
    expect(_some.getOption(O.some("a"))).toEqual(O.some("a"))
    expect(_some.encode("a")).toEqual(O.some("a"))
  })
})
