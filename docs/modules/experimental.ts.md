---
title: experimental.ts
nav_order: 9
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
  - [ZoomerTypeId](#zoomertypeid)
  - [ZoomerTypeId (type alias)](#zoomertypeid-type-alias)
  - [modifyApplicative](#modifyapplicative)
  - [path](#path)
  - [pick](#pick)
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

## modifyApplicative

**Signature**

```ts
export declare const modifyApplicative: <S, T, A, B>(
  optic: any
) => <F extends TypeLambda>(
  F: Applicative<F>
) => <R, E, O>(f: (a: A) => Kind<F, R, E, O, B>) => (s: S) => Kind<F, R, E, O, T>
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
