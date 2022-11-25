---
title: index.ts
nav_order: 5
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [iso](#iso)
  - [lens](#lens)
  - [optional](#optional)
  - [polyOptional](#polyoptional)
  - [polyPrism](#polyprism)
  - [prism](#prism)
- [utils](#utils)
  - [Getter (interface)](#getter-interface)
  - [Iso (interface)](#iso-interface)
  - [Lens (interface)](#lens-interface)
  - [Optic (interface)](#optic-interface)
  - [OpticImpl (class)](#opticimpl-class)
  - [Optional (interface)](#optional-interface)
  - [PolyIso (interface)](#polyiso-interface)
  - [PolyLens (interface)](#polylens-interface)
  - [PolyOptional (interface)](#polyoptional-interface)
  - [PolyPrism (interface)](#polyprism-interface)
  - [PolySetter (interface)](#polysetter-interface)
  - [Prism (interface)](#prism-interface)
  - [Setter (interface)](#setter-interface)
  - [at](#at)
  - [cons](#cons)
  - [encode](#encode)
  - [get](#get)
  - [getOption](#getoption)
  - [getOrModify](#getormodify)
  - [head](#head)
  - [id](#id)
  - [key](#key)
  - [modify](#modify)
  - [nullable](#nullable)
  - [replace](#replace)
  - [replaceOption](#replaceoption)
  - [set](#set)
  - [tail](#tail)

---

# constructors

## iso

**Signature**

```ts
export declare const iso: {
  <S, A>(get: (s: S) => A, encode: (a: A) => S): any
  <S, T, A, B>(get: (s: S) => A, encode: (b: B) => T): any
}
```

Added in v1.0.0

## lens

**Signature**

```ts
export declare const lens: {
  <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S): any
  <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T): any
}
```

Added in v1.0.0

## optional

**Signature**

```ts
export declare const optional: <S, A>(
  decode: (s: S) => Either<Error, A>,
  replaceEither: (a: A) => (s: S) => Either<Error, S>
) => any
```

Added in v1.0.0

## polyOptional

**Signature**

```ts
export declare const polyOptional: <S, T, A, B>(
  polyDecode: (s: S) => Either<readonly [Error, T], A>,
  polyReplaceEither: (b: B) => (s: S) => Either<readonly [Error, T], T>
) => any
```

Added in v1.0.0

## polyPrism

**Signature**

```ts
export declare const polyPrism: <S, T, A, B>(
  polyDecode: (s: S) => Either<readonly [Error, T], A>,
  encode: (b: B) => T
) => any
```

Added in v1.0.0

## prism

**Signature**

```ts
export declare const prism: <S, A>(decode: (s: S) => Either<Error, A>, encode: (a: A) => S) => any
```

Added in v1.0.0

# utils

## Getter (interface)

**Signature**

```ts
export interface Getter<
```

Added in v1.0.0

## Iso (interface)

**Signature**

```ts
export interface Iso<
```

Added in v1.0.0

## Lens (interface)

**Signature**

```ts
export interface Lens<
```

Added in v1.0.0

## Optic (interface)

**Signature**

```ts
export interface Optic<
```

Added in v1.0.0

## OpticImpl (class)

**Signature**

```ts
export declare class OpticImpl<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter> {
  constructor(
    readonly composition: 'prism' | 'lens',
    readonly getOptic: (GetWhole: GetWhole) => Either<readonly [GetError, SetWholeAfter], GetPiece>,
    readonly setOptic: (
      SetPiece: SetPiece
    ) => (SetWholeBefore: SetWholeBefore) => Either<readonly [SetError, SetWholeAfter], SetWholeAfter>
  )
}
```

Added in v1.0.0

## Optional (interface)

**Signature**

```ts
export interface Optional<
```

Added in v1.0.0

## PolyIso (interface)

**Signature**

```ts
export interface PolyIso<
```

Added in v1.0.0

## PolyLens (interface)

**Signature**

```ts
export interface PolyLens<
```

Added in v1.0.0

## PolyOptional (interface)

**Signature**

```ts
export interface PolyOptional<
```

Added in v1.0.0

## PolyPrism (interface)

**Signature**

```ts
export interface PolyPrism<
```

Added in v1.0.0

## PolySetter (interface)

**Signature**

```ts
export interface PolySetter<
```

Added in v1.0.0

## Prism (interface)

**Signature**

```ts
export interface Prism<
```

Added in v1.0.0

## Setter (interface)

**Signature**

```ts
export interface Setter<
```

Added in v1.0.0

## at

**Signature**

```ts
export declare const at: <A>(n: number) => any
```

Added in v1.0.0

## cons

An optic that accesses the `Cons` case of a `ReadonlyArray`.

**Signature**

```ts
export declare const cons: { <A>(): any; <A, B>(): any }
```

Added in v1.0.0

## encode

**Signature**

```ts
export declare const encode: <S, T, A, B>(optic: any) => (SetPiece: B) => T
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: <S, T, A, B>(optic: any) => (GetWhole: S) => A
```

Added in v1.0.0

## getOption

**Signature**

```ts
export declare const getOption: <S, A>(optic: any) => (s: S) => Option<A>
```

Added in v1.0.0

## getOrModify

**Signature**

```ts
export declare const getOrModify: <S, T, A, B>(optic: any) => (s: S) => Either<T, A>
```

Added in v1.0.0

## head

**Signature**

```ts
export declare const head: <A>() => any
```

Added in v1.0.0

## id

The identity optic.

**Signature**

```ts
export declare const id: { <S>(): any; <S, T>(): any }
```

Added in v1.0.0

## key

An optic that accesses a key of a struct or a tuple.

**Signature**

```ts
export declare const key: {
  <S, Key extends (keyof S & string) | (keyof S & symbol)>(key: Key): any
  <S, Key extends (keyof S & string) | (keyof S & symbol), B>(key: Key): any
}
```

Added in v1.0.0

## modify

**Signature**

```ts
export declare const modify: <S, T, A, B>(optic: any) => (f: (a: A) => B) => (s: S) => T
```

Added in v1.0.0

## nullable

An optic that accesses the `NonNullable` case of a nullable type.

**Signature**

```ts
export declare const nullable: <S>() => any
```

Added in v1.0.0

## replace

**Signature**

```ts
export declare const replace: <S, T, A>(optic: any) => (SetPiece: A) => (SetWholeBefore: S) => T
```

Added in v1.0.0

## replaceOption

**Signature**

```ts
export declare const replaceOption: <S, T, A>(optic: any) => (SetPiece: A) => (SetWholeBefore: S) => Option<T>
```

Added in v1.0.0

## set

**Signature**

```ts
export declare const set: <S, T, A, B>(optic: any) => (SetPiece: B) => (SetWholeBefore: S) => T
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>() => any
```

Added in v1.0.0
