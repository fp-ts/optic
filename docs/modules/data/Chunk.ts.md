---
title: data/Chunk.ts
nav_order: 2
parent: Modules
---

## Chunk overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [cons](#cons)
  - [head](#head)
  - [index](#index)
  - [tail](#tail)

---

# constructors

## cons

An optic that accesses the `Cons` case of a `Chunk`.

**Signature**

```ts
export declare const cons: { <A>(): any; <A, B>(): any }
```

Added in v1.0.0

## head

**Signature**

```ts
export declare const head: <A>() => any
```

Added in v1.0.0

## index

An optic that accesses the specified index of a `Chunk`.

**Signature**

```ts
export declare const index: <A>(i: number) => any
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>() => any
```

Added in v1.0.0
