---
title: typeclass/At.ts
nav_order: 11
parent: Modules
---

## At overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [At (interface)](#at-interface)
  - [remove](#remove)

---

# utils

## At (interface)

Typeclass that defines a `Lens` from an `S` to an `A` at an index `I`

**Signature**

```ts
export interface At<in out S, in I, in out A> {
  readonly at: (i: I) => Lens<S, A>
}
```

Added in v1.0.0

## remove

Delete a value associated with a key in a Map-like container

**Signature**

```ts
export declare const remove: <S, I, A>(F: At<S, I, Option.Option<A>>) => (i: I) => (s: S) => S
```

Added in v1.0.0
