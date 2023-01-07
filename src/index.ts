/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { identity, pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate, Refinement } from "@fp-ts/data/Predicate"
import * as RA from "@fp-ts/data/ReadonlyArray"

/**
 * @since 1.0.0
 */
export interface Optic<
  in GetWhole,
  in SetWholeBefore,
  in SetPiece,
  out GetError,
  out SetError,
  out GetPiece,
  out SetWholeAfter
> {
  readonly getOptic: (GetWhole: GetWhole) => Either<readonly [GetError, SetWholeAfter], GetPiece>
  readonly setOptic: (
    SetPiece: SetPiece
  ) => (SetWholeBefore: SetWholeBefore) => Either<readonly [SetError, SetWholeAfter], SetWholeAfter>

  /**
   * @since 1.0.0
   */
  compose<S, A, B>(this: Iso<S, A>, that: Iso<A, B>): Iso<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyIso<S, T, A, B>,
    that: PolyIso<A, B, C, D>
  ): PolyIso<S, T, C, D>
  compose<S, A, B>(this: Lens<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyLens<S, T, A, B>,
    that: PolyLens<A, B, C, D>
  ): PolyLens<S, T, C, D>
  compose<S, A, B>(this: ReversedPrism<S, A>, that: ReversedPrism<A, B>): ReversedPrism<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyReversedPrism<S, T, A, B>,
    that: PolyReversedPrism<A, B, C, D>
  ): PolyReversedPrism<S, T, C, D>
  compose<S, A, B>(this: Prism<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyPrism<S, T, A, B>,
    that: PolyPrism<A, B, C, D>
  ): PolyPrism<S, T, C, D>
  compose<S, A, B>(this: Optional<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyOptional<S, T, A, B>,
    that: PolyOptional<A, B, C, D>
  ): PolyOptional<S, T, C, D>

  /**
   * An optic that accesses the specified key of a struct or a tuple.
   *
   * @since 1.0.0
   */
  at<S, A, Key extends keyof A & (string | symbol)>(this: Lens<S, A>, key: Key): Lens<S, A[Key]>
  at<S, A, Key extends keyof A & (string | symbol)>(
    this: Optional<S, A>,
    key: Key
  ): Optional<S, A[Key]>

  /**
   * An optic that accesses the case specified by a predicate.
   *
   * @since 1.0.0
   */
  filter<S, A extends B, C extends B, B = A>(
    this: Prism<S, A>,
    refinement: Refinement<B, C>
  ): Prism<S, C>
  filter<S, A extends B, B = A>(this: Prism<S, A>, predicate: Predicate<B>): Prism<S, A>
  filter<S, A extends B, C extends B, B = A>(
    this: Optional<S, A>,
    refinement: Refinement<B, C>
  ): Optional<S, C>
  filter<S, A extends B, B = A>(this: Optional<S, A>, predicate: Predicate<B>): Optional<S, A>

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
  some<S, A>(this: Prism<S, Option<A>>): Prism<S, A>
  some<S, A>(this: Optional<S, Option<A>>): Optional<S, A>

  /**
   * An optic that accesses the specified index of a `ReadonlyArray`.
   *
   * @since 1.0.0
   */
  index<S, A>(this: Optional<S, ReadonlyArray<A>>, n: number): Optional<S, A>

  /**
   * An optic that accesses the specified index of a `ReadonlyRecord`.
   *
   * @since 1.0.0
   */
  key<S, A>(
    this: Optional<S, Readonly<Record<string | symbol, A>>>,
    key: string | symbol
  ): Optional<S, A>
}

class Builder<
  GetWhole,
  SetWholeBefore,
  SetPiece,
  GetError,
  SetError,
  GetPiece,
  SetWholeAfter
> implements
  Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
{
  constructor(
    readonly composition: "prism" | "lens",
    readonly getOptic: (GetWhole: GetWhole) => Either<readonly [GetError, SetWholeAfter], GetPiece>,
    readonly setOptic: (
      SetPiece: SetPiece
    ) => (
      SetWholeBefore: SetWholeBefore
    ) => Either<readonly [SetError, SetWholeAfter], SetWholeAfter>
  ) {}

  compose(that: any): any {
    return this.composition === "lens" || that.composition === "lens" ?
      lensComposition(that)(this as any) :
      prismComposition(that)(this as any)
  }

  at(key: string) {
    return this.compose(at<any, any>(key))
  }

  filter(predicate: Predicate<any>) {
    return this.compose(filter(predicate))
  }

  nonNullable() {
    return this.compose(nonNullable())
  }

  some() {
    return this.compose(some())
  }

  index(n: number) {
    return this.compose(index(n))
  }

  key(k: string | symbol) {
    return this.compose(key(k))
  }
}

/**
 * Compose two optics when the piece of the whole returned by the get
 * operator of the first optic is not needed by the set operator of the
 * second optic.
 */
const prismComposition = <GetPiece, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>(
  that: Optic<GetPiece, unknown, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>
) =>
  <
    GetWhole extends SetWholeBefore,
    SetWholeBefore,
    GetError extends GetError1,
    SetError extends SetError1,
    SetWholeAfter
  >(
    self: Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
  ): Optic<GetWhole, SetWholeBefore, SetPiece1, GetError1, SetError1, GetPiece1, SetWholeAfter> =>
    new Builder(
      "prism",
      (getWhole) =>
        pipe(
          self.getOptic(getWhole),
          E.flatMap(
            (getPiece) =>
              pipe(
                that.getOptic(getPiece),
                E.catchAll(([GetError1, SetPiece]) =>
                  pipe(
                    self.setOptic(SetPiece)(getWhole),
                    E.match(
                      ([_, SetWholeAfter]) => E.left([GetError1, SetWholeAfter] as const),
                      (SetWholeAfter) => E.left([GetError1, SetWholeAfter] as const)
                    )
                  )
                )
              )
          )
        ),
      (SetPiece1) =>
        (SetWholeBefore) =>
          pipe(
            that.setOptic(SetPiece1)(undefined),
            E.match(
              ([SetError1, SetPiece]) =>
                pipe(
                  self.setOptic(SetPiece)(SetWholeBefore),
                  E.match(
                    ([_, SetWholeAfter]) => E.left([SetError1, SetWholeAfter] as const),
                    (SetWholeAfter) => E.left([SetError1, SetWholeAfter] as const)
                  )
                ),
              (SetPiece) => self.setOptic(SetPiece)(SetWholeBefore)
            )
          )
    )

/**
 * Compose two optics when the piece of the whole returned by the first
 * optic is needed by the set operator of the second optic
 */
const lensComposition = <
  GetPiece extends SetWholeBefore1,
  SetWholeBefore1,
  SetPiece1,
  GetError1,
  SetError1,
  GetPiece1,
  SetPiece
>(
  that: Optic<GetPiece, SetWholeBefore1, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>
) =>
  <
    GetWhole extends SetWholeBefore,
    SetWholeBefore,
    GetError extends (SetError1 & GetError1),
    SetError extends SetError1,
    SetWholeAfter
  >(
    self: Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
  ): Optic<GetWhole, GetWhole, SetPiece1, GetError1, SetError1, GetPiece1, SetWholeAfter> =>
    new Builder(
      "lens",
      (s) =>
        pipe(
          self.getOptic(s),
          E.flatMap(
            (a) =>
              pipe(
                that.getOptic(a),
                E.catchAll(([de, b]) =>
                  pipe(
                    self.setOptic(b)(s),
                    E.match(
                      ([_ee, t]) => E.left([de, t] as const),
                      (t) => E.left([de, t] as const)
                    )
                  )
                )
              )
          )
        ),
      (d) =>
        (s) =>
          pipe(
            self.getOptic(s),
            E.flatMap((a) =>
              pipe(
                that.setOptic(d)(a),
                E.match(
                  ([ee, b]) =>
                    pipe(
                      self.setOptic(b)(s),
                      E.match(
                        ([_, t]) => E.left([ee, t] as const),
                        (t) => E.left([ee, t] as const)
                      )
                    ),
                  (b) => self.setOptic(b)(s)
                )
              )
            )
          )
    )

/**
 * @since 1.0.0
 */
export interface PolyIso<in S, out T, out A, in B>
  extends Optic<S, unknown, B, never, never, A, T>
{}

/**
 * @since 1.0.0
 */
export interface Iso<in out S, in out A> extends PolyIso<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const iso: {
  <S, A>(get: (s: S) => A, encode: (a: A) => S): Iso<S, A>
  <S, T, A, B>(get: (s: S) => A, encode: (b: B) => T): PolyIso<S, T, A, B>
} = <S, A>(get: (s: S) => A, encode: (a: A) => S): Iso<S, A> =>
  new Builder("prism", (s) => E.right(get(s)), (a) => () => E.right(encode(a)))

/**
 * The identity optic.
 *
 * @category constructors
 * @since 1.0.0
 */
export const id: {
  <S>(): Iso<S, S>
  <S, T>(): PolyIso<S, T, S, T>
} = () => iso(identity, identity)

/**
 * @since 1.0.0
 */
export interface PolyLens<in S, out T, out A, in B> extends Optic<S, S, B, never, never, A, T> {}

/**
 * @since 1.0.0
 */
export interface Lens<in out S, in out A> extends PolyLens<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const lens: {
  <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S): Lens<S, A>
  <S, T, A, B>(get: (s: S) => A, set: (b: B) => (s: S) => T): PolyLens<S, T, A, B>
} = <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S): Lens<S, A> =>
  new Builder("lens", (s) => E.right(get(s)), (b) => (s) => E.right(set(b)(s)))

/**
 * An optic that accesses the specified key of a struct or a tuple.
 *
 * @category constructors
 * @since 1.0.0
 */
export const at = <S, Key extends keyof S & (string | symbol)>(key: Key): Lens<S, S[Key]> =>
  lens((s) => s[key], (b) =>
    (s) => {
      if (Array.isArray(s)) {
        const out: any = s.slice()
        out[key] = b
        return out
      }
      return { ...s, [key]: b }
    })

/**
 * @since 1.0.0
 */
export interface PolyPrism<in S, out T, out A, in B>
  extends Optic<S, unknown, B, Error, never, A, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const polyPrism = <S, T, A, B>(
  polyDecode: (s: S) => Either<readonly [Error, T], A>,
  encode: (b: B) => T
): PolyPrism<S, T, A, B> => new Builder("prism", polyDecode, (b) => (_) => E.right(encode(b)))

/**
 * @since 1.0.0
 */
export interface Prism<in out S, in out A> extends PolyPrism<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const prism = <S, A>(decode: (s: S) => Either<Error, A>, encode: (a: A) => S): Prism<S, A> =>
  polyPrism((s) => pipe(decode(s), E.mapLeft((e) => [e, s])), encode)

/**
 * An optic that accesses the `Cons` case of a `ReadonlyArray`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<ReadonlyArray<A>, readonly [A, ReadonlyArray<A>]>
  <A, B>(): PolyPrism<
    ReadonlyArray<A>,
    ReadonlyArray<B>,
    readonly [A, ReadonlyArray<A>],
    readonly [B, ReadonlyArray<B>]
  >
} = <A>() =>
  prism<ReadonlyArray<A>, readonly [A, ReadonlyArray<A>]>(
    (s) =>
      RA.isNonEmpty(s) ?
        E.right([s[0], s.slice(1)]) :
        E.left(new Error("isNonEmpty")),
    ([head, tail]) => [head, ...tail]
  )

/**
 * An optic that accesses the case specified by a predicate.
 *
 * @category constructors
 * @since 1.0.0
 */
export const filter: {
  <S extends A, B extends A, A = S>(refinement: Refinement<A, B>): Prism<S, B>
  <S extends A, A = S>(predicate: Predicate<A>): Prism<S, S>
} = <S>(predicate: Predicate<S>): Prism<S, S> =>
  prism(
    (s) =>
      predicate(s) ?
        E.right(s) :
        E.left(new Error(predicate.name)),
    identity
  )

/**
 * An optic that accesses the `NonNullable` case of a nullable type.
 *
 * @category constructors
 * @since 1.0.0
 */
export const nonNullable = <S>(): Prism<S, NonNullable<S>> =>
  filter(function isNonNullable<S>(s: S): s is NonNullable<S> {
    return s != null
  })

/**
 * An optic that accesses the `Some` case of an `Option`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const some: {
  <A>(): Prism<Option<A>, A>
  <A, B>(): PolyPrism<Option<A>, Option<B>, A, B>
} = <A>(): Prism<Option<A>, A> => prism(O.match(() => E.left(new Error("isSome")), E.right), O.some)

/**
 * @since 1.0.0
 */
export interface PolyReversedPrism<in S, out T, out A, in B>
  extends Optic<S, S, B, never, Error, A, T>
{}

/**
 * @since 1.0.0
 */
export const polyReversedPrism = <S, T, A, B>(
  get: (s: S) => A,
  polyReplaceEither: (b: B) => (s: S) => Either<readonly [Error, T], T>
): PolyReversedPrism<S, T, A, B> => new Builder("prism", (s) => E.right(get(s)), polyReplaceEither)

/**
 * @since 1.0.0
 */
export interface ReversedPrism<in out S, in out A> extends PolyReversedPrism<S, S, A, A> {}

/**
 * @since 1.0.0
 */
export const reversedPrism = <S, A>(
  get: (s: S) => A,
  replaceEither: (a: A) => Either<Error, S>
): ReversedPrism<S, A> =>
  polyReversedPrism(get, (a) => (s) => pipe(replaceEither(a), E.mapLeft((e) => [e, s])))

/**
 * An optic that accesses the input case specified by a predicate.
 *
 * @category constructors
 * @since 1.0.0
 */
export const reversedFilter: {
  <A, S extends A>(refinement: Refinement<A, S>): ReversedPrism<S, A>
  <S>(predicate: Predicate<S>): ReversedPrism<S, S>
} = <S>(predicate: Predicate<S>): ReversedPrism<S, S> =>
  reversedPrism<S, S>(identity, (s) =>
    predicate(s) ?
      E.right(s) :
      E.left(new Error(predicate.name)))

/**
 * @since 1.0.0
 */
export interface PolyOptional<in S, out T, out A, in B>
  extends Optic<S, S, B, Error, Error, A, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const polyOptional = <S, T, A, B>(
  polyDecode: (s: S) => Either<readonly [Error, T], A>,
  polyReplaceEither: (b: B) => (s: S) => Either<readonly [Error, T], T>
): PolyOptional<S, T, A, B> => new Builder("lens", polyDecode, polyReplaceEither)

/**
 * @since 1.0.0
 */
export interface Optional<in out S, in out A> extends PolyOptional<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const optional = <S, A>(
  decode: (s: S) => Either<Error, A>,
  replaceEither: (a: A) => (s: S) => Either<Error, S>
): Optional<S, A> =>
  polyOptional(
    (s) => pipe(decode(s), E.mapLeft((e) => [e, s])),
    (a) => (s) => pipe(replaceEither(a)(s), E.mapLeft((e) => [e, s]))
  )

/**
 * An optic that accesses the specified index of a `ReadonlyArray`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const index = <A>(i: number): Optional<ReadonlyArray<A>, A> =>
  optional(
    (s) =>
      pipe(
        s,
        RA.get(i),
        O.match(
          () => E.left(new Error(`hasIndex(${i})`)),
          E.right
        )
      ),
    (a) =>
      (s) =>
        pipe(
          RA.replaceOption(i, a)(s),
          O.match(
            () => E.left(new Error(`hasIndex(${i})`)),
            E.right
          )
        )
  )

// TODO: replace with @fp-ts/data/ReadonlyRecord
const RR = {
  get: (key: string | symbol) =>
    <A>(rr: Readonly<Record<string | symbol, A>>): Option<A> =>
      Object.prototype.hasOwnProperty.call(rr, key) ? O.some(rr[key]) : O.none,
  replaceOption: <A>(key: string | symbol, a: A) =>
    (rr: Readonly<Record<string | symbol, A>>): Option<Readonly<Record<string | symbol, A>>> => {
      if (Object.prototype.hasOwnProperty.call(rr, key)) {
        const out = { ...rr }
        out[key] = a
        return O.some(out)
      }
      return O.none
    }
}

/**
 * An optic that accesses the specified index of a `ReadonlyRecord`.
 *
 * @category constructors
 * @since 1.0.0
 */
export const key = <A>(key: string | symbol): Optional<Readonly<Record<string | symbol, A>>, A> =>
  optional(
    (s) =>
      pipe(
        s,
        RR.get(key),
        O.match(
          () => E.left(new Error(`hasKey(${String(key)})`)),
          E.right
        )
      ),
    (a) =>
      (s) =>
        pipe(
          RR.replaceOption(key, a)(s),
          O.match(
            () => E.left(new Error(`hasKey(${String(key)})`)),
            E.right
          )
        )
  )

/**
 * @category constructors
 * @since 1.0.0
 */
export const head = <A>(): Optional<ReadonlyArray<A>, A> => cons<A>().at("0")

/**
 * @category constructors
 * @since 1.0.0
 */
export const tail = <A>(): Optional<ReadonlyArray<A>, ReadonlyArray<A>> => cons<A>().at("1")

/**
 * An optic that accesses the first case specified by a predicate.
 *
 * @category constructors
 * @since 1.0.0
 */
export const findFirst: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): Optional<ReadonlyArray<C>, B>
  <B extends A, A = B>(predicate: Predicate<A>): Optional<ReadonlyArray<B>, B>
} = <A>(predicate: Predicate<A>): Optional<ReadonlyArray<A>, A> =>
  optional(
    (s) =>
      pipe(
        s,
        RA.findFirst(predicate),
        E.fromOption(() => new Error(predicate.name))
      ),
    (a) =>
      (s) =>
        pipe(
          s,
          RA.findFirstIndex(predicate),
          E.fromOption(() => new Error(predicate.name)),
          E.map((index) => {
            const out = s.slice()
            out[index] = a
            return out
          })
        )
  )

/**
 * @since 1.0.0
 */
export interface PolySetter<in S, out T, in A>
  extends Optic<never, S, A, unknown, Error, unknown, T>
{}

/**
 * @since 1.0.0
 */
export interface Setter<in out S, in A> extends PolySetter<S, S, A> {}

/**
 * @since 1.0.0
 */
export interface Getter<in S, out A> extends Optic<S, never, never, Error, unknown, A, unknown> {}

/**
 * @since 1.0.0
 */
export interface PolyTraversal<in S, out T, out A, in B>
  extends PolyOptional<S, T, ReadonlyArray<A>, ReadonlyArray<B>>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const polyTraversal = <S, T, A, B>(
  decode: (s: S) => Either<readonly [Error, T], ReadonlyArray<A>>,
  replace: (bs: ReadonlyArray<B>) => (s: S) => Either<readonly [Error, T], T>
): PolyTraversal<S, T, A, B> => new Builder("lens", decode, replace)

/**
 * @since 1.0.0
 */
export interface Traversal<in out S, in out A> extends PolyTraversal<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const traversal = <S, A>(
  decode: (s: S) => Either<Error, ReadonlyArray<A>>,
  replace: (as: ReadonlyArray<A>) => (s: S) => Either<Error, S>
): Traversal<S, A> =>
  polyTraversal(
    (s) => pipe(decode(s), E.mapLeft((e) => [e, s])),
    (as) => (s) => pipe(replace(as)(s), E.mapLeft((e) => [e, s]))
  )

/**
 * @since 1.0.0
 */
export interface Fold<in S, out A> extends Getter<S, ReadonlyArray<A>> {}

/**
 * @since 1.0.0
 */
export const get = <S, T, A, B>(optic: PolyReversedPrism<S, T, A, B>) =>
  (s: S): A => pipe(optic.getOptic(s), E.getOrThrow(identity))

/**
 * @since 1.0.0
 */
export const getOption = <S, A>(optic: Getter<S, A>) =>
  (s: S): Option<A> => E.getRight(optic.getOptic(s))

/**
 * @since 1.0.0
 */
export const getOrModify = <S, T, A, B>(optic: PolyOptional<S, T, A, B>) =>
  (s: S): Either<T, A> => pipe(optic.getOptic(s), E.mapLeft(([_, t]) => t))

/**
 * @since 1.0.0
 */
export const decode = <S, T, A, B>(optic: PolyPrism<S, T, A, B>) =>
  (GetWhole: S): Either<Error, A> => pipe(optic.getOptic(GetWhole), E.mapLeft(([e, _]) => e))

/**
 * @since 1.0.0
 */
export const encode = <S, T, A, B>(optic: PolyPrism<S, T, A, B>) =>
  (SetPiece: B): T => pipe(optic.setOptic(SetPiece)(undefined), E.getOrThrow(identity))

/**
 * @since 1.0.0
 */
export const replace = <S, T, A>(optic: PolySetter<S, T, A>) =>
  (a: A) => (s: S): T => pipe(optic.setOptic(a)(s), E.match(([_, t]) => t, identity))

/**
 * @since 1.0.0
 */
export const replaceOption = <S, T, A>(optic: PolySetter<S, T, A>) =>
  (a: A) => (s: S): Option<T> => E.getRight(optic.setOptic(a)(s))

/**
 * @since 1.0.0
 */
export const modify = <S, T, A, B>(optic: PolyOptional<S, T, A, B>) =>
  (f: (a: A) => B) =>
    (s: S): T =>
      pipe(
        optic.getOptic(s),
        E.flatMap((a) => optic.setOptic(f(a))(s)),
        E.match(([_, t]) => t, identity)
      )
