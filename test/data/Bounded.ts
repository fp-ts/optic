import type { Bounded } from "@fp-ts/core/typeclass/Bounded"
import * as n from "@fp-ts/data/Number"
import * as Optic from "@fp-ts/optic"
import * as B from "@fp-ts/optic/data/Bounded"

type S = {
  readonly a: {
    readonly b: Bounded<number>
  }
}

const s: S = { a: { b: n.Bounded } }

describe("Bounded", () => {
  it("min", () => {
    const _b = Optic.id<S>().at("a").at("b").compose(B.min())
    expect(Optic.modify(_b)(() => 10)(s)).toEqual({ a: { b: { ...n.Bounded, minBound: 10 } } })
  })
  it("max", () => {
    const _b = Optic.id<S>().at("a").at("b").compose(B.max())
    expect(Optic.modify(_b)(() => 10)(s)).toEqual({ a: { b: { ...n.Bounded, maxBound: 10 } } })
  })
})
