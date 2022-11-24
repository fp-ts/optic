<h3 align="center">
  <a href="https://fp-ts.github.io/codec/">
    <img src="./docs/fp-ts-logo.png">
  </a>
</h3>

<p align="center">
Access and transform immutable data
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fp-ts/codec">
    <img src="https://img.shields.io/npm/dm/@fp-ts/codec.svg" alt="npm downloads" height="20">
  </a>
</p>

# Optics

```mermaid
flowchart TD
  Optic --> Iso
  Iso --> Lens
  Iso --> Prism
  Lens --> Optional
  Prism --> Optional
  Optional --> Getter
  Optional --> Setter
```

# Example

```ts
interface Street {
  num: number;
  name: string;
}
interface Address {
  city: string;
  street: Street;
}
interface Company {
  name: string;
  address: Address;
}
interface Employee {
  name: string;
  company: Company;
}
```

Let's say we have an employee and we need to upper case the first character of his company street name. Here is how we could write it in vanilla TypeScript

```ts
const employee: Employee = {
  name: "john",
  company: {
    name: "awesome inc",
    address: {
      city: "london",
      street: {
        num: 23,
        name: "high street",
      },
    },
  },
};

const capitalize = (s: string): string =>
  s.substring(0, 1).toUpperCase() + s.substring(1);

const employeeCapitalized = {
  ...employee,
  company: {
    ...employee.company,
    address: {
      ...employee.company.address,
      street: {
        ...employee.company.address.street,
        name: capitalize(employee.company.address.street.name),
      },
    },
  },
};
```

As we can see copy is not convenient to update nested objects because we need to repeat ourselves. Let's see what could we do with `@fp-ts/optic`

```ts
import * as Optic from "@fp-ts/optic";

const _name = Optic.id<Employee>()
  .compose(Optic.key("company"))
  .compose(Optic.key("address"))
  .compose(Optic.key("street"))
  .compose(Optic.key("name"));

const capitalizeName = Optic.modify(_name)(capitalize);

expect(capitalizeName(employee)).toEqual(employeeCapitalized);
```

# Installation

To install the **alpha** version:

```
npm install @fp-ts/optic
```

# Documentation

- [API Reference](https://fp-ts.github.io/codec/)

# License

The MIT License (MIT)
