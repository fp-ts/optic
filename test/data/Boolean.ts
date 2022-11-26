import * as Optic from "@fp-ts/optic"
import * as BooleanOptic from "@fp-ts/optic/data/Boolean"

describe("Boolean", () => {
  it("toggle", () => {
    type S = {
      readonly a: {
        readonly b: boolean
      }
    }
    const _b = Optic.id<S>().compose(Optic.at("a")).compose(Optic.at("b"))
    const toggle = BooleanOptic.toggle(_b)
    expect(toggle({ a: { b: true } })).toEqual({ a: { b: false } })
  })
})
