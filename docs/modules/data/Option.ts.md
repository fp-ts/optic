---
title: data/Option.ts
nav_order: 5
parent: Modules
---

## Option overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [none](#none)
  - [some](#some)

---

# utils

## none

An optic that accesses the `None` case of an `Option`.

**Signature**

```ts
export declare const none: <A>() => any
```

Added in v1.0.0

## some

An optic that accesses the `Some` case of an `Option`.

**Signature**

```ts
export declare const some: { <A>(): any; <A, B>(): any }
```

Added in v1.0.0
