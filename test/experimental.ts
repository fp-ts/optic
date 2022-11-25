import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as Optic from "@fp-ts/optic"
import * as Experimental from "@fp-ts/optic/experimental"

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

describe("experimental", () => {
  it("path", () => {
    const _name = Optic.id<Employee>().compose(
      Experimental.path("company", "address", "street", "name")
    )

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(employee)).toEqual(employeeCapitalized)
  })

  it("zoom", () => {
    const _name = Optic.id<Employee>()
      .compose(Experimental.zoom((_) => _.company.address.street.name))

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(employee)).toEqual(employeeCapitalized)

    const firstOwner = Optic.id<Employee>()
      .compose(Experimental.zoom((_) => _.company.owners))
      .compose(Optic.at(0))

    expect(pipe(employeeCapitalized, Optic.getOption(firstOwner))).toEqual(
      Option.some("mike")
    )
  })

  it("pick", () => {
    type S = {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }

    const _pick = Optic.id<S>()
      .compose(Experimental.pick("a", "b"))

    expect(pipe({ a: "a", b: 1, c: true }, Optic.get(_pick))).toEqual({ a: "a", b: 1 })
    expect(pipe({ a: "a1", b: 1, c: true }, Optic.set(_pick)({ a: "a2", b: 2 }))).toEqual({
      a: "a2",
      b: 2,
      c: true
    })
  })
})
