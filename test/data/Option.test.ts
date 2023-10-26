import * as Optic from "@fp-ts/optic"
import * as OptionOptic from "@fp-ts/optic/data/Option"
import * as E from "effect/Either"
import { pipe } from "effect/Function"
import * as O from "effect/Option"
import { describe, expect, it } from "vitest"

describe("Option", () => {
  it("none", () => {
    const _none = Optic.id<O.Option<string>>()
      .compose(OptionOptic.none())

    expect(pipe(O.none(), Optic.getOption(_none))).toEqual(O.some(undefined))
    expect(pipe(O.some("a"), Optic.getOption(_none))).toEqual(O.none())
    expect(pipe(O.some("a"), _none.getOptic)).toEqual(
      E.left([new Error("Expected a None"), O.some("a")])
    )
    expect(pipe(undefined, Optic.encode(_none))).toEqual(O.none())
  })
})
