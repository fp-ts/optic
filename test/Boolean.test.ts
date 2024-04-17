import * as Optic from "@fp-ts/optic"
import * as BooleanOptic from "@fp-ts/optic/Boolean"
import { describe, expect, it } from "vitest"

describe("Boolean", () => {
  it("toggle", () => {
    type S = {
      readonly a: {
        readonly b: boolean
      }
    }
    const _b = Optic.id<S>().at("a").at("b")
    const toggle = BooleanOptic.toggle(_b)
    expect(toggle({ a: { b: true } })).toEqual({ a: { b: false } })
  })
})
