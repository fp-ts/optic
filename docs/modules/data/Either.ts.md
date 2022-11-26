---
title: data/Either.ts
nav_order: 3
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
export declare const left: { <A, B>(): any; <A, B, C>(): any }
```

Added in v1.0.0

## right

An optic that accesses the `Right` case of an `Either`.

**Signature**

```ts
export declare const right: { <A, B>(): any; <A, B, C>(): any }
```

Added in v1.0.0
