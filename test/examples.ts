import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as S from "@fp-ts/data/String"
import * as Optic from "@fp-ts/optic"
import * as StringOptic from "@fp-ts/optic/data/String"

describe("examples", () => {
  it("README", () => {
    interface Street {
      num: number
      name: string | null
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
            name: "high street"
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
            name: "High street"
          }
        }
      }
    }

    const _name: Optic.Optional<Employee, string> = Optic.id<Employee>()
      .at("company")
      .at("address")
      .at("street")
      .at("name")
      .nonNullable()
      .compose(StringOptic.index(0))

    const capitalize = (s: string): string => s.toUpperCase()

    const capitalizeName = _name.modify(capitalize)

    expect(capitalizeName(from)).toEqual(to)
  })

  it("fluent APIs", () => {
    interface S {
      readonly a: {
        readonly b: O.Option<{
          readonly c: ReadonlyArray<O.Option<string>>
        }>
      }
    }

    // const _c_1 = Optic.id<S>()
    //   .compose(Optic.at("a"))
    //   .compose(Optic.at("b"))
    //   .compose(OptionOptic.some())
    //   .compose(Optic.at("c"))
    //   .compose(Optic.index(1))
    //   .compose(OptionOptic.some())
    //   .compose(StringOptic.index(0))

    const _c_1 = Optic.id<S>()
      .at("a")
      .at("b")
      .some()
      .at("c")
      .compose(Optic.index(1))
      .some()
      .compose(StringOptic.index(0))

    const s: S = {
      a: {
        b: O.some({
          c: [O.none, O.some("aaa"), O.some("bbb")]
        })
      }
    }

    expect(pipe(s, _c_1.modify(S.toUpperCase))).toEqual({
      a: {
        b: O.some({
          c: [O.none, O.some("Aaa"), O.some("bbb")]
        })
      }
    })
  })
})
