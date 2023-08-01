---
title: typeclass/Index.ts
nav_order: 13
parent: Modules
---

## Index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Index (interface)](#index-interface)
  - [fromAt](#fromat)

---

# utils

## Index (interface)

Typeclass that defines a `Lens` from an `S` to an `A` at an index `I`

**Signature**

```ts
export interface Index<in out S, in I, in out A> {
  readonly index: (i: I) => Optional<S, A>
}
```

Added in v1.0.0

## fromAt

**Signature**

```ts
export declare const fromAt: <S, I, A>(F: At<S, I, Option<A>>) => Index<S, I, A>
```

Added in v1.0.0
