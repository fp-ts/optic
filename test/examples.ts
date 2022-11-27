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
})
