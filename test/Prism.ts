import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import { opticFailure } from "@fp-ts/optic/OpticFailure"
import * as _ from "@fp-ts/optic/Prism"

describe("Prism", () => {
  it("object", () => {
    const p = _.object
    expect(p.decode({})).toEqual(E.right({}))
    expect(p.decode([1, 2, 3])).toEqual(E.right([1, 2, 3]))
    expect(p.decode(null)).toEqual(E.left([opticFailure("not an object"), null]))
  })

  it("indexSignature", () => {
    const p = _.indexSignature
    expect(p.decode({})).toEqual(E.right({}))
    expect(p.decode([1, 2, 3])).toEqual(E.left([opticFailure("not an index signature"), [1, 2, 3]]))
  })

  it("key", () => {
    const p1 = pipe(_.indexSignature, _.key("a", _.string))
    expect(p1.decode({ a: "a" })).toEqual(E.right({ a: "a" }))
    expect(p1.decode({ a: "a", b: 1 })).toEqual(E.right({ a: "a", b: 1 }))
    expect(p1.decode({})).toEqual(E.left([opticFailure("missing \"a\" key"), {}]))

    const p2 = pipe(_.indexSignature, _.key("a", _.string), _.key("b", _.number))
    expect(p2.decode({ a: "a", b: 1 })).toEqual(E.right({ a: "a", b: 1 }))
    expect(p2.decode({ a: "a" })).toEqual(E.left([opticFailure("missing \"b\" key"), { a: "a" }]))
  })

  it("exactKeys", () => {
    const p = _.exactKeys("a", "b")
    expect(p.decode({ a: "a", b: 1 })).toEqual(E.right({ a: "a", b: 1 }))
    expect(p.decode({ a: "a" })).toEqual(E.left([opticFailure("missing \"b\" key"), { a: "a" }]))
  })

  it("keys", () => {
    const p = pipe(_.indexSignature, _.keys({ a: _.string, b: _.number }))
    expect(p.decode({ a: "a", b: 1 })).toEqual(E.right({ a: "a", b: 1 }))
    expect(p.decode({ a: "a" })).toEqual(E.left([opticFailure("missing \"b\" key"), { a: "a" }]))
    expect(p.decode({ a: "a", b: "b" })).toEqual(
      E.left([opticFailure("key \"b\" not a number"), { a: "a", b: "b" }])
    )
  })
})
