---
title: Chunk.ts
nav_order: 3
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
export declare const cons: {
  <A>(): Prism<Chunk.Chunk<A>, readonly [A, Chunk.Chunk<A>]>
  <A, B>(): PolyPrism<Chunk.Chunk<A>, Chunk.Chunk<B>, readonly [A, Chunk.Chunk<A>], readonly [B, Chunk.Chunk<B>]>
}
```

Added in v1.0.0

## head

**Signature**

```ts
export declare const head: <A>() => Optional<Chunk.Chunk<A>, A>
```

Added in v1.0.0

## index

An optic that accesses the specified index of a `Chunk`.

**Signature**

```ts
export declare const index: <A>(i: number) => Optional<Chunk.Chunk<A>, A>
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>() => Optional<Chunk.Chunk<A>, Chunk.Chunk<A>>
```

Added in v1.0.0
