import * as E from "@fp-ts/core/Either"
import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import * as Optic from "@fp-ts/optic"
import * as StringOptic from "@fp-ts/optic/data/String"

describe("string", () => {
  it("index", () => {
    const _0 = StringOptic.index(0)

    expect(pipe("abc", Optic.getOption(_0))).toEqual(O.some("a"))
    expect(pipe("", Optic.getOption(_0))).toEqual(O.none())

    expect(pipe("abc", Optic.replaceOption(_0)("d"))).toEqual(O.some("dbc"))
    expect(pipe("abc", Optic.replaceOption(_0)("de"))).toEqual(O.some("dbc"))
    expect(pipe("abc", Optic.replaceOption(_0)(""))).toEqual(O.none())
    expect(pipe("abc", _0.setOptic(""))).toEqual(
      E.left([new Error("Expected a non empty string"), "abc"])
    )
    expect(pipe("", Optic.replaceOption(_0)("d"))).toEqual(O.none())
    expect(pipe("", _0.setOptic("d"))).toEqual(E.left([new Error("Missing index 0"), ""]))
  })
})
