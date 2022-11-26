import * as O from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as OptionOptic from "@fp-ts/optic/data/Option"
import * as StringOptic from "@fp-ts/optic/data/string"

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

    const _name: Optic.Optional<Employee, string> = Optic.id<Employee>()
      .compose(Optic.key("company")) // Lens<Employee, Company>
      .compose(Optic.key("address")) // Lens<Employee, Company>
      .compose(Optic.key("street")) // Lens<<Employee, Company>
      .compose(Optic.key("name")) // Lens<Street, O.Option<string>>
      .compose(OptionOptic.some()) // Prism<O.Option<string>, string>
      .compose(StringOptic.index(0)) // Optional<string, string>

    const capitalize = (s: string): string => s.toUpperCase()

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(from)).toEqual(to)
  })
})
