---
title: index.ts
nav_order: 11
parent: Modules
---

## index overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [cons](#cons)
  - [findFirst](#findfirst)
  - [head](#head)
  - [id](#id)
  - [indexes](#indexes)
  - [iso](#iso)
  - [lens](#lens)
  - [optional](#optional)
  - [polyOptional](#polyoptional)
  - [polyPrism](#polyprism)
  - [polyTraversal](#polytraversal)
  - [prism](#prism)
  - [reversedFilter](#reversedfilter)
  - [tail](#tail)
  - [traversal](#traversal)
- [utils](#utils)
  - [Fold (interface)](#fold-interface)
  - [Getter (interface)](#getter-interface)
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

## cons

An optic that accesses the `Cons` case of a `ReadonlyArray`.

**Signature**

```ts
export declare const cons: {
  <A>(): Prism<readonly A[], readonly [A, readonly A[]]>
  <A, B>(): PolyPrism<readonly A[], readonly B[], readonly [A, readonly A[]], readonly [B, readonly B[]]>
}
```

Added in v1.0.0

## findFirst

An optic that accesses the first case specified by a predicate.

**Signature**

```ts
export declare const findFirst: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>, message?: string): Optional<readonly C[], B>
  <B extends A, A = B>(predicate: Predicate<A>, message?: string): Optional<readonly B[], B>
}
```

Added in v1.0.0

## head

**Signature**

```ts
export declare const head: <A>() => Optional<readonly A[], A>
```

Added in v1.0.0

## id

The identity optic.

**Signature**

```ts
export declare const id: { <S>(): Iso<S, S>; <S, T>(): PolyIso<S, T, S, T> }
```

Added in v1.0.0

## indexes

An optic that accesses all of the elements in a `ReadonlyArray`.

**Signature**

```ts
export declare const indexes: <A>() => Traversal<readonly A[], A>
```

Added in v1.0.0

## iso

**Signature**

```ts
export declare const iso: {
  <S, A>(get: (s: S) => A, encode: (a: A) => S): Iso<S, A>
  <S, T, A, B>(get: (s: S) => A, encode: (b: B) => T): PolyIso<S, T, A, B>
}
```

Added in v1.0.0

## lens

**Signature**

```ts
export declare const lens: {
  <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S): Lens<S, A>
  <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T): PolyLens<S, T, A, B>
}
```

Added in v1.0.0

## optional

**Signature**

```ts
export declare const optional: <S, A>(
  decode: (s: S) => Either.Either<Error, A>,
  replaceEither: (a: A) => (s: S) => Either.Either<Error, S>
) => Optional<S, A>
```

Added in v1.0.0

## polyOptional

**Signature**

```ts
export declare const polyOptional: <S, T, A, B>(
  polyDecode: (s: S) => Either.Either<readonly [Error, T], A>,
  polyReplaceEither: (b: B) => (s: S) => Either.Either<readonly [Error, T], T>
) => PolyOptional<S, T, A, B>
```

Added in v1.0.0

## polyPrism

**Signature**

```ts
export declare const polyPrism: <S, T, A, B>(
  polyDecode: (s: S) => Either.Either<readonly [Error, T], A>,
  encode: (b: B) => T
) => PolyPrism<S, T, A, B>
```

Added in v1.0.0

## polyTraversal

**Signature**

```ts
export declare const polyTraversal: <S, T, A, B>(
  decode: (s: S) => Either.Either<readonly [Error, T], readonly A[]>,
  replace: (bs: readonly B[]) => (s: S) => Either.Either<readonly [Error, T], T>
) => PolyTraversal<S, T, A, B>
```

Added in v1.0.0

## prism

**Signature**

```ts
export declare const prism: <S, A>(decode: (s: S) => Either.Either<Error, A>, encode: (a: A) => S) => Prism<S, A>
```

Added in v1.0.0

## reversedFilter

An optic that accesses the input case specified by a predicate.

**Signature**

```ts
export declare const reversedFilter: {
  <A, S extends A>(refinement: Refinement<A, S>, message?: string): ReversedPrism<S, A>
  <S>(predicate: Predicate<S>, message?: string): ReversedPrism<S, S>
}
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>() => Optional<readonly A[], readonly A[]>
```

Added in v1.0.0

## traversal

**Signature**

```ts
export declare const traversal: <S, A>(
  decode: (s: S) => Either.Either<Error, readonly A[]>,
  replace: (as: readonly A[]) => (s: S) => Either.Either<Error, S>
) => Traversal<S, A>
```

Added in v1.0.0

# utils

## Fold (interface)

**Signature**

```ts
export interface Fold<in S, out A> extends Getter<S, ReadonlyArray<A>> {}
```

Added in v1.0.0

## Getter (interface)

**Signature**

```ts
export interface Getter<in S, out A> extends Optic<S, never, never, Error, unknown, A, unknown> {}
```

Added in v1.0.0

## Iso (interface)

**Signature**

```ts
export interface Iso<in out S, in out A> extends PolyIso<S, S, A, A> {}
```

Added in v1.0.0

## Lens (interface)

**Signature**

```ts
export interface Lens<in out S, in out A> extends PolyLens<S, S, A, A> {}
```

Added in v1.0.0

## Optic (interface)

**Signature**

```ts
export interface Optic<
  in GetWhole,
  in SetWholeBefore,
  in SetPiece,
  out GetError,
  out SetError,
  out GetPiece,
  out SetWholeAfter
> {
  readonly getOptic: (GetWhole: GetWhole) => Either.Either<readonly [GetError, SetWholeAfter], GetPiece>
  readonly setOptic: (
    SetPiece: SetPiece
  ) => (SetWholeBefore: SetWholeBefore) => Either.Either<readonly [SetError, SetWholeAfter], SetWholeAfter>

  /**
   * @since 1.0.0
   */
  compose<S, A, B>(this: Iso<S, A>, that: Iso<A, B>): Iso<S, B>
  compose<S, T, A, B, C, D>(this: PolyIso<S, T, A, B>, that: PolyIso<A, B, C, D>): PolyIso<S, T, C, D>
  compose<S, A, B>(this: Lens<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<S, T, A, B, C, D>(this: PolyLens<S, T, A, B>, that: PolyLens<A, B, C, D>): PolyLens<S, T, C, D>
  compose<S, A, B>(this: ReversedPrism<S, A>, that: ReversedPrism<A, B>): ReversedPrism<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyReversedPrism<S, T, A, B>,
    that: PolyReversedPrism<A, B, C, D>
  ): PolyReversedPrism<S, T, C, D>
  compose<S, A, B>(this: Prism<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<S, T, A, B, C, D>(this: PolyPrism<S, T, A, B>, that: PolyPrism<A, B, C, D>): PolyPrism<S, T, C, D>
  compose<S, A, B>(this: Optional<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(this: PolyOptional<S, T, A, B>, that: PolyOptional<A, B, C, D>): PolyOptional<S, T, C, D>

  /**
   * An optic that accesses the specified key of a struct or a tuple.
   *
   * @since 1.0.0
   */
  at<S, A, Key extends keyof A>(this: Lens<S, A>, key: Key): Lens<S, A[Key]>
  at<S, T, A, B, Key extends keyof A & keyof B>(this: PolyLens<S, T, A, B>, key: Key): PolyLens<S, T, A[Key], B[Key]>
  at<S, A, Key extends keyof A>(this: Optional<S, A>, key: Key): Optional<S, A[Key]>
  at<S, T, A, B, Key extends keyof A & keyof B>(
    this: PolyOptional<S, T, A, B>,
    key: Key
  ): PolyOptional<S, T, A[Key], B[Key]>

  /**
   * An optic that accesses a group of keys of a struct.
   *
   * @since 1.0.0
   */
  pick<S, A, Keys extends readonly [keyof A, ...Array<keyof A>]>(
    this: Lens<S, A>,
    ...keys: Keys
  ): Lens<S, { readonly [K in Keys[number]]: A[K] }>
  pick<S, A, Keys extends readonly [keyof A, ...Array<keyof A>]>(
    this: Optional<S, A>,
    ...keys: Keys
  ): Optional<S, { readonly [K in Keys[number]]: A[K] }>

  /**
   * An optic that excludes a group of keys of a struct.
   *
   * @since 1.0.0
   */
  omit<S, A, Keys extends readonly [keyof A, ...Array<keyof A>]>(
    this: Lens<S, A>,
    ...keys: Keys
  ): Lens<S, { readonly [K in Exclude<keyof A, Keys[number]>]: A[K] }>
  omit<S, A, Keys extends readonly [keyof A, ...Array<keyof A>]>(
    this: Optional<S, A>,
    ...keys: Keys
  ): Optional<S, { readonly [K in Exclude<keyof A, Keys[number]>]: A[K] }>

  /**
   * An optic that accesses the case specified by a predicate.
   *
   * @since 1.0.0
   */
  filter<S, A extends B, C extends B, B = A>(
    this: Prism<S, A>,
    refinement: Refinement<B, C>,
    message?: string
  ): Prism<S, C>
  filter<S, A extends B, B = A>(this: Prism<S, A>, predicate: Predicate<B>, message?: string): Prism<S, A>
  filter<S, A extends B, C extends B, B = A>(
    this: Optional<S, A>,
    refinement: Refinement<B, C>,
    message?: string
  ): Optional<S, C>
  filter<S, A extends B, B = A>(this: Optional<S, A>, predicate: Predicate<B>, message?: string): Optional<S, A>

  /**
   * An optic that accesses the `NonNullable` case of a nullable type.
   *
   * @since 1.0.0
   */
  nonNullable<S, A>(this: Prism<S, A>): Prism<S, NonNullable<A>>
  nonNullable<S, A>(this: Optional<S, A>): Optional<S, NonNullable<A>>

  /**
   * An optic that accesses the `Some` case of an `Option`.
   *
   * @since 1.0.0
   */
  some<S, A>(this: Prism<S, Option.Option<A>>): Prism<S, A>
  some<S, A>(this: Optional<S, Option.Option<A>>): Optional<S, A>

  /**
   * An optic that accesses the specified index of a `ReadonlyArray`.
   *
   * @since 1.0.0
   */
  index<S, A>(this: Optional<S, ReadonlyArray<A>>, n: number): Optional<S, A>

  /**
   * An optic that accesses the specified key of a record.
   *
   * @since 1.0.0
   */
  key<S, A>(this: Optional<S, ReadonlyRecord.ReadonlyRecord<A>>, key: string): Optional<S, A>
}
```

Added in v1.0.0

## Optional (interface)

**Signature**

```ts
export interface Optional<in out S, in out A> extends PolyOptional<S, S, A, A> {}
```

Added in v1.0.0

## PolyIso (interface)

**Signature**

```ts
export interface PolyIso<in S, out T, out A, in B> extends Optic<S, unknown, B, never, never, A, T> {}
```

Added in v1.0.0

## PolyLens (interface)

**Signature**

```ts
export interface PolyLens<in S, out T, out A, in B> extends Optic<S, S, B, never, never, A, T> {}
```

Added in v1.0.0

## PolyOptional (interface)

**Signature**

```ts
export interface PolyOptional<in S, out T, out A, in B> extends Optic<S, S, B, Error, Error, A, T> {}
```

Added in v1.0.0

## PolyPrism (interface)

**Signature**

```ts
export interface PolyPrism<in S, out T, out A, in B> extends Optic<S, unknown, B, Error, never, A, T> {}
```

Added in v1.0.0

## PolyReversedPrism (interface)

**Signature**

```ts
export interface PolyReversedPrism<in S, out T, out A, in B> extends Optic<S, S, B, never, Error, A, T> {}
```

Added in v1.0.0

## PolySetter (interface)

**Signature**

```ts
export interface PolySetter<in S, out T, in A> extends Optic<never, S, A, unknown, Error, unknown, T> {}
```

Added in v1.0.0

## PolyTraversal (interface)

**Signature**

```ts
export interface PolyTraversal<in S, out T, out A, in B>
  extends PolyOptional<S, T, ReadonlyArray<A>, ReadonlyArray<B>> {}
```

Added in v1.0.0

## Prism (interface)

**Signature**

```ts
export interface Prism<in out S, in out A> extends PolyPrism<S, S, A, A> {}
```

Added in v1.0.0

## ReversedPrism (interface)

**Signature**

```ts
export interface ReversedPrism<in out S, in out A> extends PolyReversedPrism<S, S, A, A> {}
```

Added in v1.0.0

## Setter (interface)

**Signature**

```ts
export interface Setter<in out S, in A> extends PolySetter<S, S, A> {}
```

Added in v1.0.0

## Traversal (interface)

**Signature**

```ts
export interface Traversal<in out S, in out A> extends PolyTraversal<S, S, A, A> {}
```

Added in v1.0.0

## decode

**Signature**

```ts
export declare const decode: <S, T, A, B>(optic: PolyPrism<S, T, A, B>) => (GetWhole: S) => Either.Either<Error, A>
```

Added in v1.0.0

## encode

**Signature**

```ts
export declare const encode: <S, T, A, B>(optic: PolyPrism<S, T, A, B>) => (SetPiece: B) => T
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: <S, T, A, B>(optic: PolyReversedPrism<S, T, A, B>) => (s: S) => A
```

Added in v1.0.0

## getOption

**Signature**

```ts
export declare const getOption: <S, A>(optic: Getter<S, A>) => (s: S) => Option.Option<A>
```

Added in v1.0.0

## getOrModify

**Signature**

```ts
export declare const getOrModify: <S, T, A, B>(optic: PolyOptional<S, T, A, B>) => (s: S) => Either.Either<T, A>
```

Added in v1.0.0

## modify

**Signature**

```ts
export declare const modify: <S, T, A, B>(optic: PolyOptional<S, T, A, B>) => (f: (a: A) => B) => (s: S) => T
```

Added in v1.0.0

## polyReversedPrism

**Signature**

```ts
export declare const polyReversedPrism: <S, T, A, B>(
  get: (s: S) => A,
  polyReplaceEither: (b: B) => (s: S) => Either.Either<readonly [Error, T], T>
) => PolyReversedPrism<S, T, A, B>
```

Added in v1.0.0

## replace

**Signature**

```ts
export declare const replace: <S, T, A>(optic: PolySetter<S, T, A>) => (a: A) => (s: S) => T
```

Added in v1.0.0

## replaceOption

**Signature**

```ts
export declare const replaceOption: <S, T, A>(optic: PolySetter<S, T, A>) => (a: A) => (s: S) => Option.Option<T>
```

Added in v1.0.0

## reversedPrism

**Signature**

```ts
export declare const reversedPrism: <S, A>(
  get: (s: S) => A,
  replaceEither: (a: A) => Either.Either<Error, S>
) => ReversedPrism<S, A>
```

Added in v1.0.0
