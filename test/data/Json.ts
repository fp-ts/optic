import { pipe } from "@fp-ts/data/Function"
import type * as J from "@fp-ts/data/Json"
import * as Optic from "@fp-ts/optic"
import * as _ from "@fp-ts/optic/data/Json"

type S = {
  readonly json: string
}

type T = {
  readonly json: J.Json
}

describe("Json", () => {
  it("stringify", () => {
    const optic = pipe(Optic.id<T>().at("json").compose(_.stringify))

    expect(Optic.modify(optic)(() => "[]")({ json: {} })).toEqual({ json: [] })
    expect(Optic.modify(optic)(() => "1")({ json: {} })).toEqual({ json: 1 })
    expect(Optic.modify(optic)((val) => `[${val}]`)({ json: 1 })).toEqual({ json: [1] })
  })

  it("number", () => {
    const optic = pipe(Optic.id<S>().at("json").compose(_.parse).compose(_.number))

    expect(Optic.modify(optic)((num) => num + 1)({ json: "4" })).toEqual({
      json: "5"
    })
  })

  it("boolean", () => {
    const optic = pipe(Optic.id<S>().at("json").compose(_.parse).compose(_.boolean))

    expect(Optic.modify(optic)((x) => !x)({ json: "true" })).toEqual({
      json: "false"
    })
  })

  it("object", () => {
    const optic = pipe(Optic.id<S>().at("json").compose(_.parse).compose(_.object))

    expect(Optic.modify(optic)((obj) => ({ ...obj, a: "test" }))({ json: "{}" })).toEqual({
      json: "{\"a\":\"test\"}"
    })
  })

  it("array", () => {
    const optic = pipe(Optic.id<S>().at("json").compose(_.parse).compose(_.array))

    expect(Optic.modify(optic)((arr) => [...arr, "test"])({ json: "[]" })).toEqual({
      json: "[\"test\"]"
    })
  })

  it("string", () => {
    const optic = pipe(Optic.id<S>().at("json").compose(_.parse).compose(_.string))

    expect(Optic.modify(optic)((str) => str + "123")({ json: "\"test\"" })).toEqual({
      json: "\"test123\""
    })
  })
})
