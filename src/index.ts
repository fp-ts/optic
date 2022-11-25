/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { identity, pipe } from "@fp-ts/data/Function"
import type { List } from "@fp-ts/data/List"
import * as list from "@fp-ts/data/List"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"

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

  // Iso
  compose<S, A, B>(this: Iso<S, A>, that: Iso<A, B>): Iso<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyIso<S, T, A, B>,
    that: PolyIso<A, B, C, D>
  ): PolyIso<S, T, C, D>
  compose<S, A, B>(this: Iso<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyIso<S, T, A, B>,
    that: PolyPrism<A, B, C, D>
  ): PolyPrism<S, T, C, D>
  compose<S, A, B>(this: Iso<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyIso<S, T, A, B>,
    that: PolyLens<A, B, C, D>
  ): PolyLens<S, T, C, D>
  compose<S, A, B>(this: Iso<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyIso<S, T, A, B>,
    that: PolyOptional<A, B, C, D>
  ): PolyOptional<S, T, C, D>
  // Lens
  compose<S, A, B>(this: Lens<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyLens<S, T, A, B>,
    that: PolyLens<A, B, C, D>
  ): PolyLens<S, T, C, D>
  compose<S, A, B>(this: Lens<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyLens<S, T, A, B>,
    that: PolyOptional<A, B, C, D>
  ): PolyOptional<S, T, C, D>
  // Prism
  compose<S, A, B>(this: Prism<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyPrism<S, T, A, B>,
    that: PolyPrism<A, B, C, D>
  ): PolyPrism<S, T, C, D>
  compose<S, A, B>(this: Prism<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyPrism<S, T, A, B>,
    that: PolyOptional<A, B, C, D>
  ): PolyOptional<S, T, C, D>
  // Optional
  compose<S, A, B>(this: Optional<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<S, T, A, B, C, D>(
    this: PolyOptional<S, T, A, B>,
    that: PolyOptional<A, B, C, D>
  ): PolyOptional<S, T, C, D>
}

class OpticImpl<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
  implements Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
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
    new OpticImpl(
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
    new OpticImpl(
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
export const polyIso = <S, T, A, B>(
  get: (s: S) => A,
  encode: (b: B) => T
): PolyIso<S, T, A, B> =>
  new OpticImpl("prism", (s) => E.right(get(s)), (a) => () => E.right(encode(a)))

/**
 * @category constructors
 * @since 1.0.0
 */
export const iso: <S, A>(get: (s: S) => A, encode: (a: A) => S) => Iso<S, A> = polyIso

/**
 * The identity optic.
 *
 * @since 1.0.0
 */
export const id: {
  <S>(): Iso<S, S>
  <S, T>(): PolyIso<S, T, S, T>
} = <S, T>(): PolyIso<S, T, S, T> => polyIso(identity, identity)

/**
 * @since 1.0.0
 */
export interface PolyLens<in S, out T, out A, in B> extends Optic<S, S, B, never, never, A, T> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const polyLens = <S, T, A, B>(
  get: (s: S) => A,
  set: (b: B) => (s: S) => T
): PolyLens<S, T, A, B> =>
  new OpticImpl("lens", (s) => E.right(get(s)), (b) => (s) => E.right(set(b)(s)))

/**
 * @since 1.0.0
 */
export const get = <S, T, A, B>(optic: PolyLens<S, T, A, B>) =>
  (GetWhole: S): A => pipe(optic.getOptic(GetWhole), E.getOrThrow(identity))

/**
 * @since 1.0.0
 */
export const set = <S, T, A, B>(optic: PolyLens<S, T, A, B>) =>
  (SetPiece: B) =>
    (SetWholeBefore: S): T => pipe(optic.setOptic(SetPiece)(SetWholeBefore), E.getOrThrow(identity))

/**
 * @since 1.0.0
 */
export interface Lens<in out S, in out A> extends PolyLens<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const lens: <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S) => Lens<S, A> = polyLens

/**
 * An optic that accesses a key of a struct or a tuple.
 *
 * @since 1.0.0
 */
export const key: {
  <S, Key extends keyof S & (string | symbol)>(key: Key): Lens<S, S[Key]>
  <S, Key extends keyof S & (string | symbol), B>(
    key: Key
  ): PolyLens<S, { readonly [P in keyof S]: P extends Key ? B : S[P] }, S[Key], B>
} = <S, Key extends keyof S, B>(
  key: Key
): PolyLens<S, any, S[Key], B> =>
  polyLens((s) => s[key], (b) =>
    (s) => {
      if (Array.isArray(s)) {
        const out: any = s.slice()
        out[key] = b
        return out
      }
      return { ...s, [key]: b }
    })

/**
 * An optic that accesses the first element of a tuple.
 *
 * @since 1.0.0
 */
export const first = <A, B, C>(): PolyLens<readonly [A, B], readonly [C, B], A, C> =>
  polyLens(([a, _]) => a, (c) => ([_, b]) => [c, b])

/**
 * An optic that accesses the second element of a tuple.
 *
 * @since 1.0.0
 */
export const second = <A, B, C>(): PolyLens<readonly [A, B], readonly [A, C], B, C> =>
  polyLens(([_, b]) => b, (c) => ([a, _]) => [a, c])

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
  decodeP: (s: S) => Either<readonly [Error, T], A>,
  encode: (b: B) => T
): PolyPrism<S, T, A, B> => new OpticImpl("prism", decodeP, (b) => (_) => E.right(encode(b)))

/**
 * @since 1.0.0
 */
export const encode = <S, T, A, B>(optic: PolyPrism<S, T, A, B>) =>
  (SetPiece: B): T => pipe(optic.setOptic(SetPiece)(undefined), E.getOrThrow(identity))

/**
 * @since 1.0.0
 */
export interface Prism<in out S, in out A> extends PolyPrism<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const prism = <S, A>(
  decode: (s: S) => Either<Error, A>,
  encode: (a: A) => S
): Prism<S, A> => polyPrism((s) => pipe(decode(s), E.mapLeft((e) => [e, s])), encode)

/**
 * An optic that accesses the `None` case of an `Option`.
 *
 * @since 1.0.0
 */
export const none = <A>(): Prism<Option<A>, void> =>
  prism(
    O.match(
      () => E.right<void>(undefined),
      (a) => E.left(Error(`some(${a}) did not satisfy isNone`))
    ),
    (_): Option<A> => O.none
  )

/**
 * An optic that accesses the `Some` case of an `Option`.
 *
 * @since 1.0.0
 */
export const some: {
  <A>(): Prism<Option<A>, A>
  <A, B>(): PolyPrism<Option<A>, Option<B>, A, B>
} = <A, B>(): PolyPrism<Option<A>, Option<B>, A, B> =>
  polyPrism(
    O.match(
      () => E.left([Error("none did not satisfy isSome"), O.none]),
      (a) => E.right(a)
    ),
    (b) => O.some(b)
  )

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: {
  <A, B>(): Prism<Either<A, B>, B>
  <A, B, C>(): PolyPrism<Either<A, B>, Either<A, C>, B, C>
} = <A, B, C>(): PolyPrism<Either<A, B>, Either<A, C>, B, C> =>
  polyPrism(
    E.match(
      (a) => E.left([Error(`left(${a}) did not satisfy isRight`), E.left(a)]),
      (b) => E.right(b)
    ),
    (c): Either<A, C> => E.right(c)
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: {
  <A, B>(): Prism<Either<A, B>, A>
  <A, B, C>(): PolyPrism<Either<A, B>, Either<C, B>, A, C>
} = <A, B, C>(): PolyPrism<Either<A, B>, Either<C, B>, A, C> =>
  polyPrism(
    E.match(
      (a) => E.right(a),
      (b) => E.left([Error(`right(${b}) did not satisfy isLeft`), E.right(b)])
    ),
    (c): Either<C, B> => E.left(c)
  )

/**
 * An optic that accesses the `Cons` case of a `List`.
 *
 * @since 1.0.0
 */
export const cons: {
  <A>(): Prism<List<A>, readonly [A, List<A>]>
  <A, B>(): PolyPrism<List<A>, List<B>, readonly [A, List<A>], readonly [B, List<B>]>
} = <A, B>(): PolyPrism<List<A>, List<B>, readonly [A, List<A>], readonly [B, List<B>]> =>
  polyPrism(
    (s) =>
      list.isCons(s) ?
        E.right([s.head, s.tail]) :
        E.left([Error(`Nil did not satisfy isCons`), list.nil()]),
    ([head, tail]): List<B> => list.cons(head, tail)
  )

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
  decodeP: (s: S) => Either<readonly [Error, T], A>,
  replaceEitherP: (b: B) => (s: S) => Either<readonly [Error, T], T>
): PolyOptional<S, T, A, B> => new OpticImpl("lens", decodeP, replaceEitherP)

/**
 * @since 1.0.0
 */
export const getOrModify = <S, T, A, B>(optic: PolyOptional<S, T, A, B>) =>
  (s: S): Either<T, A> => pipe(optic.getOptic(s), E.mapLeft(([_, t]) => t))

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
  replace: (a: A) => (s: S) => Either<Error, S>
): Optional<S, A> =>
  polyOptional(
    (s) => pipe(decode(s), E.mapLeft((e) => [e, s])),
    (a) => (s) => pipe(replace(a)(s), E.mapLeft((e) => [e, s]))
  )

/**
 * @since 1.0.0
 */
export const at = <A>(n: number): Optional<ReadonlyArray<A>, A> =>
  optional(
    (as) =>
      n >= 0 && n < as.length ?
        E.right(as[n]) :
        E.left(Error(`[${as}] did not satisfy hasAt(${n})`)),
    (a) =>
      (as) => {
        if (n >= 0 && n < as.length) {
          const out = as.slice()
          out[n] = a
          return E.right(out)
        }
        return E.left(Error(`[${as}] did not satisfy hasAt(${n})`))
      }
  )

// TODO atChunk https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L133

// TODO head https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L193

// TODO tail https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L287

// TODO key https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L205

// TODO https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L159
// /**
//  * An optic that accesses a filtered subset of a ReadonlArray.
//  *
//  * @since 1.0.0
//  */
// export const filter = <A>(f: (a: A) => boolean): Traversal<ReadonlyArray<A>, A> =>
//   traversal(

//   )

// TODO https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L266
// /**
//  * An optic that accesses a filtered subset of a ReadonlArray.
//  *
//  * @since 1.0.0
//  */
// export const slice = <A>(from: number, to: number): Traversal<ReadonlyArray<A>, A> =>
//   traversal(

//   )

/**
 * @since 1.0.0
 */
export interface PolySetter<in S, out T, in A>
  extends Optic<never, S, A, unknown, Error, unknown, T>
{}

/**
 * @since 1.0.0
 */
export const replace = <S, T, A>(optic: PolySetter<S, T, A>) =>
  (SetPiece: A) =>
    (SetWholeBefore: S): T =>
      pipe(optic.setOptic(SetPiece)(SetWholeBefore), E.match(([_, t]) => t, identity))

/**
 * @since 1.0.0
 */
export const replaceOption = <S, T, A>(optic: PolySetter<S, T, A>) =>
  (SetPiece: A) =>
    (SetWholeBefore: S): Option<T> => E.getRight(optic.setOptic(SetPiece)(SetWholeBefore))

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
export const getOption = <S, A>(optic: Getter<S, A>) =>
  (s: S): Option<A> => E.getRight(optic.getOptic(s))

// export interface PolyTraversal<in S, out T, out A, in B>
//   extends OptionalP<S, T, ReadonlyArray<A>, ReadonlyArray<B>>
// {}

// export const polyTraversal = <S, T, A, B>(
//   decode: (s: S) => Either<readonly [Error, T], ReadonlyArray<A>>,
//   replace: (bs: ReadonlyArray<B>) => (s: S) => Either<readonly [Error, T], T>
// ): PolyTraversal<S, T, A, B> => new OpticImpl("lens", decode, replace)

// export interface Traversal<in out S, in out A> extends TraversalP<S, S, A, A> {}

// export const traversal = <S, A>(
//   decode: (s: S) => Either<Error, ReadonlyArray<A>>,
//   replace: (as: ReadonlyArray<A>) => (s: S) => Either<Error, S>
// ): Traversal<S, A> =>
//   polyTraversal(
//     (s) => pipe(decode(s), E.mapLeft((e) => [e, s])),
//     (as) => (s) => pipe(replace(as)(s), E.mapLeft((e) => [e, s]))
//   )

// export interface Fold<in S, out A> extends Getter<S, ReadonlyArray<A>> {}
