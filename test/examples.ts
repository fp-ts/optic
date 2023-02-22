import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import type { Option } from "@effect/data/Option"
import * as String from "@effect/data/String"
import * as Optic from "@fp-ts/optic"
import * as StringOptic from "@fp-ts/optic/data/String"

describe("examples", () => {
  it("README", () => {
    interface Street {
      num: number
      name: O.Option<string>
    }
    interface Address {
      city: string
      street: Street
    }
    interface Company {
      name: string
      address: Address
    }
    interface Employee {
      name: string
      company: Company
    }

    const from: Employee = {
      name: "john",
      company: {
        name: "awesome inc",
        address: {
          city: "london",
          street: {
            num: 23,
            name: O.some("high street")
          }
        }
      }
    }

    const to: Employee = {
      name: "john",
      company: {
        name: "awesome inc",
        address: {
          city: "london",
          street: {
            num: 23,
            name: O.some("High street")
          }
        }
      }
    }

    const _firstChar: Optic.Optional<Employee, string> = Optic.id<Employee>()
      .at("company")
      .at("address")
      .at("street")
      .at("name")
      .some()
      .compose(StringOptic.index(0))

    const capitalizeName = Optic.modify(_firstChar)(String.toUpperCase)

    expect(capitalizeName(from)).toEqual(to)
  })

  it("fluent APIs", () => {
    // let's say we need to upper case the first character of the second element of `c`
    interface S {
      readonly a: {
        readonly b: Option<{
          readonly c: ReadonlyArray<Option<string>>
        }>
      }
    }

    // with compose
    // const _c_1 = Optic.id<S>()
    //   .compose(Optic.at("a"))
    //   .compose(Optic.at("b"))
    //   .compose(OptionOptic.some())
    //   .compose(Optic.at("c"))
    //   .compose(Optic.index(1))
    //   .compose(OptionOptic.some())
    //   .compose(StringOptic.index(0))

    // with fluent APIs
    const _c_1 = Optic.id<S>()
      .at("a")
      .at("b")
      .some()
      .at("c")
      .index(1)
      .some()
      .compose(StringOptic.index(0))

    const s: S = {
      a: {
        b: O.some({
          c: [O.none(), O.some("aaa"), O.some("bbb")]
        })
      }
    }

    expect(pipe(s, Optic.modify(_c_1)(String.toUpperCase))).toEqual({
      a: {
        b: O.some({
          c: [O.none(), O.some("Aaa"), O.some("bbb")]
        })
      }
    })

    // with immer
    /*
    import produce from 'immer'

    const output = produce(s, (draft) => {
      const b = draft.a.b
      if (O.isSome(b)) {
        if (b.value.c.length >= 1 && O.isSome(b.value.c[1])) {
          const s = b.value.c[1].value
          b.value.c[1] = O.some(toUpperCase(s.charAt(0)) + s.substring(1))
        }
      }
    })
    */
  })
})
