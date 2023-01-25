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
export declare const left: { <E, A>(): any; <E, A, B>(): any }
```

Added in v1.0.0

## right

An optic that accesses the `Right` case of an `Either`.

**Signature**

```ts
export declare const right: { <E, A>(): any; <E, A, B>(): any }
```

Added in v1.0.0
