import * as Optic from "@fp-ts/optic"

describe("examples", () => {
  it("README", () => {
    interface Street {
      num: number
      name: string
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

    const employee: Employee = {
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

    const capitalize = (s: string): string => s.substring(0, 1).toUpperCase() + s.substring(1)

    const employeeCapitalized = {
      ...employee,
      company: {
        ...employee.company,
        address: {
          ...employee.company.address,
          street: {
            ...employee.company.address.street,
            name: capitalize(employee.company.address.street.name)
          }
        }
      }
    }

    const _name = Optic.id<Employee>()
      .compose(Optic.key("company"))
      .compose(Optic.key("address"))
      .compose(Optic.key("street"))
      .compose(Optic.key("name"))

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(employee)).toEqual(employeeCapitalized)
  })
})
