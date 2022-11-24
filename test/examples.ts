import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
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
      owners: ReadonlyArray<string>
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
        },
        owners: ["mike"]
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

    const name2 = Optic.id<Employee>().compose(Optic.path("company", "address", "street", "name"))

    const capitalizeName2 = Optic.modify(name2)(capitalize)

    expect(capitalizeName2(employee)).toEqual(employeeCapitalized)

    const name3 = Optic.id<Employee>()
      .compose(Optic.zoom((_) => _.company.address.street.name))

    const capitalizeName3 = Optic.modify(name3)(capitalize)

    expect(capitalizeName3(employee)).toEqual(employeeCapitalized)

    const firstOwner = Optic.id<Employee>()
      .compose(Optic.zoom((_) => _.company.owners))
      .compose(Optic.at(0))

    expect(pipe(employeeCapitalized, Optic.getOption(firstOwner))).toEqual(Option.some("mike"))
  })
})
