import * as OptionInstances from "@effect/typeclass/data/Option"
import * as Optic from "@fp-ts/optic"
import * as ExperimentalOptic from "@fp-ts/optic/experimental"
import { pipe } from "effect/Function"
import * as Option from "effect/Option"
import { describe, expect, it } from "vitest"

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
  it("modifyApplicative", () => {
    const _0 = Optic.id<ReadonlyArray<number>>().index(0)
    const f = ExperimentalOptic.modifyApplicative(_0)(OptionInstances.Applicative)((
      n
    ) => (n > 0 ? Option.some(n * 2) : Option.none()))
    expect(f([])).toEqual(Option.some([]))
    expect(f([1, 2, 3])).toEqual(Option.some([2, 2, 3]))
    expect(f([-1, 2, 3])).toEqual(Option.none())
  })

  it("path", () => {
    const _name = Optic.id<Employee>().compose(
      ExperimentalOptic.path("company", "address", "street", "name")
    )

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(employee)).toEqual(employeeCapitalized)
  })

  it("zoom", () => {
    const _name = Optic.id<Employee>()
      .compose(ExperimentalOptic.zoom((_) => _.company.address.street.name))

    const capitalizeName = Optic.modify(_name)(capitalize)

    expect(capitalizeName(employee)).toEqual(employeeCapitalized)

    const firstOwner = Optic.id<Employee>()
      .compose(ExperimentalOptic.zoom((_) => _.company.owners))
      .index(0)

    expect(pipe(employeeCapitalized, Optic.getOption(firstOwner))).toEqual(
      Option.some("mike")
    )
  })
})
