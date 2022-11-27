import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as StringOptic from "@fp-ts/optic/data/String"

describe("string", () => {
  it("index", () => {
    const _0 = StringOptic.index(0)

    expect(_0.getOption("abc")).toEqual(O.some("a"))
    expect(_0.getOption("")).toEqual(O.none)

    expect(pipe("abc", _0.replaceOption("d"))).toEqual(O.some("dbc"))
    expect(pipe("abc", _0.replaceOption("de"))).toEqual(O.some("dbc"))
    expect(pipe("abc", _0.replaceOption(""))).toEqual(O.none)
    expect(pipe("", _0.replaceOption("d"))).toEqual(O.none)
  })
})
