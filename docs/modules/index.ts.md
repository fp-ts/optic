---
title: index.ts
nav_order: 10
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [at](#at)
  - [cons](#cons)
  - [filter](#filter)
  - [findFirst](#findfirst)
  - [head](#head)
  - [id](#id)
  - [index](#index)
  - [indexes](#indexes)
  - [iso](#iso)
  - [key](#key)
  - [lens](#lens)
  - [nonNullable](#nonnullable)
  - [omit](#omit)
  - [optional](#optional)
  - [pick](#pick)
  - [polyOptional](#polyoptional)
  - [polyPrism](#polyprism)
  - [polyTraversal](#polytraversal)
  - [prism](#prism)
  - [reversedFilter](#reversedfilter)
  - [some](#some)
  - [tail](#tail)
  - [traversal](#traversal)
- [utils](#utils)
  - [Fold (interface)](#fold-interface)
  - [Getter (interface)](#getter-interface)
  - [IndexSignature (interface)](#indexsignature-interface)
  - [Iso (interface)](#iso-interface)
  - [Lens (interface)](#lens-interface)
  - [Optic (interface)](#optic-interface)
  - [Optional (interface)](#optional-interface)
  - [PolyIso (interface)](#polyiso-interface)
  - [PolyLens (interface)](#polylens-interface)
  - [PolyOptional (interface)](#polyoptional-interface)
  - [PolyPrism (interface)](#polyprism-interface)
  - [PolyReversedPrism (interface)](#polyreversedprism-interface)
  - [PolySetter (interface)](#polysetter-interface)
  - [PolyTraversal (interface)](#polytraversal-interface)
  - [Prism (interface)](#prism-interface)
  - [ReversedPrism (interface)](#reversedprism-interface)
  - [Setter (interface)](#setter-interface)
  - [Traversal (interface)](#traversal-interface)
  - [decode](#decode)
  - [encode](#encode)
  - [get](#get)
  - [getOption](#getoption)
  - [getOrModify](#getormodify)
  - [modify](#modify)
  - [polyReversedPrism](#polyreversedprism)
  - [replace](#replace)
  - [replaceOption](#replaceoption)
  - [reversedPrism](#reversedprism)

---

# constructors

## at

An optic that accesses the specified key of a struct or a tuple.

**Signature**

```ts
export declare const at: <S, Key extends (keyof S & string) | (keyof S & symbol)>(key: Key) => any
```

Added in v1.0.0

## cons

An optic that accesses the `Cons` case of a `ReadonlyArray`.

**Signature**

```ts
export declare const cons: { <A>(): any; <A, B>(): any }
```

Added in v1.0.0

## filter

An optic that accesses the case specified by a predicate.

**Signature**

```ts
export declare const filter: {
  <S extends A, B extends A, A = S>(refinement: Refinement<A, B>): any
  <S extends A, A = S>(predicate: Predicate<A>): any
}
```

Added in v1.0.0

## findFirst

An optic that accesses the first case specified by a predicate.

**Signature**

```ts
export declare const findFirst: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): any
  <B extends A, A = B>(predicate: Predicate<A>): any
}
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

## index

An optic that accesses the specified index of a `ReadonlyArray`.

**Signature**

```ts
export declare const index: <A>(i: number) => any
```

Added in v1.0.0

## indexes

An optic that accesses all of the elements in a `ReadonlyArray`.

**Signature**

```ts
export declare const indexes: <A>() => any
```

Added in v1.0.0

## iso

**Signature**

```ts
export declare const iso: {
  <S, A>(get: (s: S) => A, encode: (a: A) => S): any
  <S, T, A, B>(get: (s: S) => A, encode: (b: B) => T): any
}
```

Added in v1.0.0

## key

An optic that accesses the specified key of an index signature.

**Signature**

```ts
export declare const key: <A>(key: PropertyKey) => any
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

## nonNullable

An optic that accesses the `NonNullable` case of a nullable type.

**Signature**

```ts
export declare const nonNullable: <S>() => any
```

Added in v1.0.0

## omit

An optic that excludes a group of keys of a struct.

**Signature**

```ts
export declare const omit: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(...keys: Keys) => any
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

## pick

An optic that accesses a group of keys of a struct.

**Signature**

```ts
export declare const pick: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(...keys: Keys) => any
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

## polyTraversal

**Signature**

```ts
export declare const polyTraversal: <S, T, A, B>(
  decode: (s: S) => Either<readonly [Error, T], readonly A[]>,
  replace: (bs: readonly B[]) => (s: S) => Either<readonly [Error, T], T>
) => any
```

Added in v1.0.0

## prism

**Signature**

```ts
export declare const prism: <S, A>(decode: (s: S) => Either<Error, A>, encode: (a: A) => S) => any
```

Added in v1.0.0

## reversedFilter

An optic that accesses the input case specified by a predicate.

**Signature**

```ts
export declare const reversedFilter: {
  <A, S extends A>(refinement: Refinement<A, S>): any
  <S>(predicate: Predicate<S>): any
}
```

Added in v1.0.0

## some

An optic that accesses the `Some` case of an `Option`.

**Signature**

```ts
export declare const some: { <A>(): any; <A, B>(): any }
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>() => any
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

# utils

## Fold (interface)

**Signature**

```ts
export interface Fold<
```

Added in v1.0.0

## Getter (interface)

**Signature**

```ts
export interface Getter<
```

Added in v1.0.0

## IndexSignature (interface)

**Signature**

```ts
export interface IndexSignature<A> {
  readonly [x: PropertyKey]: A
}
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

## PolyReversedPrism (interface)

**Signature**

```ts
export interface PolyReversedPrism<
```

Added in v1.0.0

## PolySetter (interface)

**Signature**

```ts
export interface PolySetter<
```

Added in v1.0.0

## PolyTraversal (interface)

**Signature**

```ts
export interface PolyTraversal<
```

Added in v1.0.0

## Prism (interface)

**Signature**

```ts
export interface Prism<
```

Added in v1.0.0

## ReversedPrism (interface)

**Signature**

```ts
export interface ReversedPrism<
```

Added in v1.0.0

## Setter (interface)

**Signature**

```ts
export interface Setter<
```

Added in v1.0.0

## Traversal (interface)

**Signature**

```ts
export interface Traversal<
```

Added in v1.0.0

## decode

**Signature**

```ts
export declare const decode: <S, T, A, B>(optic: any) => (GetWhole: S) => Either<Error, A>
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
export declare const get: <S, T, A, B>(optic: any) => (s: S) => A
```

Added in v1.0.0

## getOption

**Signature**

```ts
export declare const getOption: <S, A>(optic: any) => (s: S) => O.Option<A>
```

Added in v1.0.0

## getOrModify

**Signature**

```ts
export declare const getOrModify: <S, T, A, B>(optic: any) => (s: S) => Either<T, A>
```

Added in v1.0.0

## modify

**Signature**

```ts
export declare const modify: <S, T, A, B>(optic: any) => (f: (a: A) => B) => (s: S) => T
```

Added in v1.0.0

## polyReversedPrism

**Signature**

```ts
export declare const polyReversedPrism: <S, T, A, B>(
  get: (s: S) => A,
  polyReplaceEither: (b: B) => (s: S) => Either<readonly [Error, T], T>
) => any
```

Added in v1.0.0

## replace

**Signature**

```ts
export declare const replace: <S, T, A>(optic: any) => (a: A) => (s: S) => T
```

Added in v1.0.0

## replaceOption

**Signature**

```ts
export declare const replaceOption: <S, T, A>(optic: any) => (a: A) => (s: S) => O.Option<T>
```

Added in v1.0.0

## reversedPrism

**Signature**

```ts
export declare const reversedPrism: <S, A>(get: (s: S) => A, replaceEither: (a: A) => Either<Error, S>) => any
```

Added in v1.0.0
