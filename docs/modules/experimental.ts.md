---
title: experimental.ts
nav_order: 4
parent: Modules
---

## experimental overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [FocusInitial (type alias)](#focusinitial-type-alias)
  - [FocusPrimitive (type alias)](#focusprimitive-type-alias)
  - [FocusStructure (type alias)](#focusstructure-type-alias)
  - [Fold (interface)](#fold-interface)
  - [PolyTraversal (interface)](#polytraversal-interface)
  - [Traversal (interface)](#traversal-interface)
  - [ZoomerTypeId](#zoomertypeid)
  - [ZoomerTypeId (type alias)](#zoomertypeid-type-alias)
  - [path](#path)
  - [pick](#pick)
  - [polyTraversal](#polytraversal)
  - [traversal](#traversal)
  - [zoom](#zoom)

---

# utils

## FocusInitial (type alias)

**Signature**

```ts
export type FocusInitial<S> = keyof S extends string ? FocusStructure<S> : FocusPrimitive<S>
```

Added in v1.0.0

## FocusPrimitive (type alias)

**Signature**

```ts
export type FocusPrimitive<S> = {
  [ZoomerTypeId]: (_: S) => S
}
```

Added in v1.0.0

## FocusStructure (type alias)

**Signature**

```ts
export type FocusStructure<S> = {
  [K in keyof S | ZoomerTypeId]: K extends ZoomerTypeId
    ? ZoomerTypeId
    : K extends keyof S
    ? keyof S[K] extends string
      ? FocusStructure<S[K]>
      : FocusPrimitive<S[K]>
    : never
}
```

Added in v1.0.0

## Fold (interface)

**Signature**

```ts
export interface Fold<
```

Added in v1.0.0

## PolyTraversal (interface)

**Signature**

```ts
export interface PolyTraversal<
```

Added in v1.0.0

## Traversal (interface)

**Signature**

```ts
export interface Traversal<
```

Added in v1.0.0

## ZoomerTypeId

**Signature**

```ts
export declare const ZoomerTypeId: typeof ZoomerTypeId
```

Added in v1.0.0

## ZoomerTypeId (type alias)

**Signature**

```ts
export type ZoomerTypeId = typeof ZoomerTypeId
```

Added in v1.0.0

## path

An optic that accesses a nested field of a struct.

**Signature**

```ts
export declare function path<
  S,
  K1 extends keyof S,
  K2 extends keyof S[K1],
  K3 extends keyof S[K1][K2],
  K4 extends keyof S[K1][K2][K3],
  K5 extends keyof S[K1][K2][K3][K4]
>(...path: [K1, K2, K3, K4, K5]): Lens<S, S[K1][K2][K3][K4][K5]>
export declare function path<
  S,
  K1 extends keyof S,
  K2 extends keyof S[K1],
  K3 extends keyof S[K1][K2],
  K4 extends keyof S[K1][K2][K3]
>(...path: [K1, K2, K3, K4]): Lens<S, S[K1][K2][K3][K4]>
export declare function path<S, K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(
  ...path: [K1, K2, K3]
): Lens<S, S[K1][K2][K3]>
export declare function path<S, K1 extends keyof S, K2 extends keyof S[K1]>(...path: [K1, K2]): Lens<S, S[K1][K2]>
export declare function path<S, K1 extends keyof S>(...path: [K1]): Lens<S, S[K1]>
```

Added in v1.0.0

## pick

An optic that accesses a group of keys of a struct.

**Signature**

```ts
export declare const pick: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(...keys: Keys) => any
```

Added in v1.0.0

## polyTraversal

**Signature**

```ts
export declare const polyTraversal: <S, T, A, B>(
  decode: (s: S) => Either<readonly [Error, T], readonly A[]>,
  replace: (bs: readonly B[]) => (s: S) => Either<readonly [Error, T], T>
) => any
```

Added in v1.0.0

## traversal

**Signature**

```ts
export declare const traversal: <S, A>(
  decode: (s: S) => Either<Error, readonly A[]>,
  replace: (as: readonly A[]) => (s: S) => Either<Error, S>
) => any
```

Added in v1.0.0

## zoom

An optic that accesses a nested field of a struct.

**Signature**

```ts
export declare const zoom: {
  <S, A>(f: (s: FocusInitial<S>) => FocusStructure<A>): any
  <S, A>(f: (s: FocusInitial<S>) => FocusPrimitive<A>): any
}
```

Added in v1.0.0
