---
title: data/Either.ts
nav_order: 4
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
  <E, A>(): Prism<Either.Either<E, A>, E>
  <E, A, B>(): PolyPrism<Either.Either<E, A>, Either.Either<B, A>, E, B>
}
```

Added in v1.0.0

## right

An optic that accesses the `Right` case of an `Either`.

**Signature**

```ts
export declare const right: {
  <E, A>(): Prism<Either.Either<E, A>, A>
  <E, A, B>(): PolyPrism<Either.Either<E, A>, Either.Either<E, B>, A, B>
}
```

Added in v1.0.0
