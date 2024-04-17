---
title: Either.ts
nav_order: 5
parent: Modules
---

## Either overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [left](#left)
  - [right](#right)

---

# utils

## left

An optic that accesses the `Left` case of an `Either`.

**Signature**

```ts
export declare const left: {
  <A, E>(): Prism<Either.Either<A, E>, E>
  <A, E, B>(): PolyPrism<Either.Either<A, E>, Either.Either<A, B>, E, B>
}
```

Added in v1.0.0

## right

An optic that accesses the `Right` case of an `Either`.

**Signature**

```ts
export declare const right: {
  <A, E>(): Prism<Either.Either<A, E>, A>
  <A, E, B>(): PolyPrism<Either.Either<A, E>, Either.Either<B, E>, A, B>
}
```

Added in v1.0.0
