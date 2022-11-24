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

  compose<A, B, S>(this: Iso<S, A>, that: Iso<A, B>): Iso<S, B>
  compose<A, B, S>(this: Iso<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<A, B, S>(this: Iso<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<A, B, S>(this: Lens<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<A, B, S>(this: Lens<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<A, B, S>(this: Prism<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<A, B, S>(this: Prism<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<A, B, S>(this: Optional<S, A>, that: Optional<A, B>): Optional<S, B>
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

  compose<A, B, S>(this: Iso<S, A>, that: Iso<A, B>): Iso<S, B>
  compose<A, B, S>(this: Iso<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<A, B, S>(this: Lens<S, A>, that: Lens<A, B>): Lens<S, B>
  compose<A, B, S>(this: Lens<S, A>, that: Prism<A, B>): Optional<S, B>
  compose<A, B, S>(this: Lens<S, A>, that: Optional<A, B>): Optional<S, B>
  compose<A, B, S>(this: Prism<S, A>, that: Prism<A, B>): Prism<S, B>
  compose<A, B, S>(this: Optional<S, A>, that: Optional<A, B>): Optional<S, B>
  compose(that: any) {
    return this.composition === "lens" || that.composition === "lens" ?
      lensComposition(that)(this as any) :
      prismComposition(that)(this as any)
  }
}

/**
 * @since 1.0.0
 */
export interface OpticError {
  readonly message: string
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const opticError = (message: string): OpticError => ({ message })

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
export interface IsoP<in S, out T, out A, in B> extends Optic<S, unknown, B, never, never, A, T> {}

/**
 * @since 1.0.0
 */
export interface Iso<in out S, in out A> extends IsoP<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const isoP = <S, T, A, B>(
  get: (s: S) => A,
  encode: (b: B) => T
): IsoP<S, T, A, B> =>
  new OpticImpl("prism", (s) => E.right(get(s)), (a) => () => E.right(encode(a)))

/**
 * @category constructors
 * @since 1.0.0
 */
export const iso: <S, A>(get: (s: S) => A, encode: (a: A) => S) => Iso<S, A> = isoP

/**
 * The identity optic.
 *
 * @since 1.0.0
 */
export const id = <A>(): Iso<A, A> => iso(identity, identity)

/**
 * @since 1.0.0
 */
export interface LensP<in S, out T, out A, in B> extends Optic<S, S, B, never, never, A, T> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const lensP = <S, T, A, B>(
  get: (s: S) => A,
  set: (b: B) => (s: S) => T
): LensP<S, T, A, B> =>
  new OpticImpl("lens", (s) => E.right(get(s)), (b) => (s) => E.right(set(b)(s)))

/**
 * @since 1.0.0
 */
export interface Lens<in out S, in out A> extends LensP<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const lens: <S, A>(get: (s: S) => A, set: (a: A) => (s: S) => S) => Lens<S, A> = lensP

/**
 * @since 1.0.0
 */
export const get: <S, A>(optic: Lens<S, A>) => (whole: S) => A = (optic) =>
  (whole) => pipe(optic.getOptic(whole), E.getOrThrow(identity))

/**
 * An optic that accesses a prop of a struct.
 *
 * @since 1.0.0
 */
export const prop = <S, P extends keyof S>(
  prop: P
): Lens<S, S[P]> => lens((s) => s[prop], (a) => (s) => ({ ...s, [prop]: a }))

/**
 * An optic that accesses an index of a tuple.
 *
 * @since 1.0.0
 */
export const component = <S extends ReadonlyArray<unknown>, P extends keyof S & string>(
  prop: P
): Lens<S, S[P]> =>
  lens((s) => s[prop], (a) =>
    (s) => {
      const out: S = s.slice() as any
      out[prop] = a
      return out
    })

/**
 * An optic that accesses the first element of a tuple.
 *
 * @since 1.0.0
 */
export const first = <A, B, C>(): LensP<readonly [A, B], readonly [C, B], A, C> =>
  lensP(([a, _]) => a, (c) => ([_, b]) => [c, b])

/**
 * An optic that accesses the second element of a tuple.
 *
 * @since 1.0.0
 */
export const second = <A, B, C>(): LensP<readonly [A, B], readonly [A, C], B, C> =>
  lensP(([_, b]) => b, (c) => ([a, _]) => [a, c])

/**
 * @since 1.0.0
 */
export interface PrismP<in S, out T, out A, in B>
  extends Optic<S, unknown, B, OpticError, never, A, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const prismP = <S, T, A, B>(
  decode: (s: S) => Either<readonly [OpticError, T], A>,
  encode: (b: B) => T
): PrismP<S, T, A, B> => new OpticImpl("prism", decode, (b) => (_) => E.right(encode(b)))

/**
 * @since 1.0.0
 */
export interface Prism<in out S, in out A> extends PrismP<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const prism = <S, A>(
  decode: (s: S) => Either<OpticError, A>,
  encode: (a: A) => S
): Prism<S, A> => prismP((s) => pipe(decode(s), E.mapLeft((e) => [e, s])), encode)

/**
 * An optic that accesses the `None` case of an `Option`.
 *
 * @since 1.0.0
 */
export const none = <A>(): Prism<Option<A>, void> =>
  prism(
    O.match(
      () => E.right<void>(undefined),
      (a) => E.left(opticError(`some(${a}) did not satisfy isNone`))
    ),
    (_): Option<A> => O.none
  )

/**
 * An optic that accesses the `Some` case of an `Option`.
 *
 * @since 1.0.0
 */
export const someP = <A, B>(): PrismP<Option<A>, Option<B>, A, B> =>
  prismP(
    O.match(
      () => E.left([opticError("none did not satisfy isSome"), O.none]),
      (a) => E.right(a)
    ),
    (b) => O.some(b)
  )

/**
 * An optic that accesses the `Some` case of an `Option`.
 *
 * @since 1.0.0
 */
export const some: <A>() => Prism<Option<A>, A> = someP

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const rightP = <A, B, C>(): PrismP<Either<A, B>, Either<A, C>, B, C> =>
  prismP(
    E.match(
      (a) => E.left([opticError(`left(${a}) did not satisfy isRight`), E.left(a)]),
      (b) => E.right(b)
    ),
    (c): Either<A, C> => E.right(c)
  )

/**
 * An optic that accesses the `Right` case of an `Either`.
 *
 * @since 1.0.0
 */
export const right: <A, B>() => Prism<Either<A, B>, B> = rightP

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const leftP = <A, B, C>(): PrismP<Either<A, B>, Either<C, B>, A, C> =>
  prismP(
    E.match(
      (a) => E.right(a),
      (b) => E.left([opticError(`right(${b}) did not satisfy isLeft`), E.right(b)])
    ),
    (c): Either<C, B> => E.left(c)
  )

/**
 * An optic that accesses the `Left` case of an `Either`.
 *
 * @since 1.0.0
 */
export const left: <A, B>() => Prism<Either<A, B>, A> = leftP

/**
 * An optic that accesses the `Cons` case of a `List`.
 *
 * @since 1.0.0
 */
export const consP = <A, B>(): PrismP<
  List<A>,
  List<B>,
  readonly [A, List<A>],
  readonly [B, List<B>]
> =>
  prismP(
    (s) =>
      list.isCons(s) ?
        E.right([s.head, s.tail]) :
        E.left([opticError(`Nil did not satisfy isCons`), list.nil()]),
    ([head, tail]): List<B> => list.cons(head, tail)
  )

/**
 * An optic that accesses the `Cons` case of a `List`.
 *
 * @since 1.0.0
 */
export const cons: <A>() => Prism<List<A>, readonly [A, List<A>]> = consP

/**
 * @since 1.0.0
 */
export interface OptionalP<in S, out T, out A, in B>
  extends Optic<S, S, B, OpticError, OpticError, A, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const optionalP = <S, T, A, B>(
  decode: (s: S) => Either<readonly [OpticError, T], A>,
  replace: (b: B) => (s: S) => Either<readonly [OpticError, T], T>
): OptionalP<S, T, A, B> => new OpticImpl("lens", decode, replace)

/**
 * @since 1.0.0
 */
export interface Optional<in out S, in out A> extends OptionalP<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const optional = <S, A>(
  decode: (s: S) => Either<OpticError, A>,
  replace: (a: A) => (s: S) => Either<OpticError, S>
): Optional<S, A> =>
  optionalP(
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
        E.left(opticError(`${as} did not satisfy hasAt(${n})`)),
    (a) =>
      (as) => {
        if (n >= 0 && n < as.length) {
          const out = as.slice()
          out[n] = a
          return E.right(out)
        }
        return E.left(opticError(`${as} did not satisfy hasAt(${n})`))
      }
  )

// TODO atChunk https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L133

// TODO head https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L193

// TODO tail https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L287

// TODO key https://github.com/zio/zio-optics/blob/master/zio-optics/shared/src/main/scala/zio/optics/optic.scala#L205

/**
 * @since 1.0.0
 */
export interface TraversalP<in S, out T, out A, in B>
  extends Optic<S, S, ReadonlyArray<B>, OpticError, OpticError, ReadonlyArray<A>, T>
{}

/**
 * @category constructors
 * @since 1.0.0
 */
export const traversalP = <S, T, A, B>(
  decode: (s: S) => Either<readonly [OpticError, T], ReadonlyArray<A>>,
  replace: (bs: ReadonlyArray<B>) => (s: S) => Either<readonly [OpticError, T], T>
): TraversalP<S, T, A, B> => new OpticImpl("lens", decode, replace)

/**
 * @since 1.0.0
 */
export interface Traversal<in out S, in out A> extends TraversalP<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const traversal = <S, A>(
  decode: (s: S) => Either<OpticError, ReadonlyArray<A>>,
  replace: (as: ReadonlyArray<A>) => (s: S) => Either<OpticError, S>
): Traversal<S, A> =>
  traversalP(
    (s) => pipe(decode(s), E.mapLeft((e) => [e, s])),
    (as) => (s) => pipe(replace(as)(s), E.mapLeft((e) => [e, s]))
  )

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
export interface SetterP<in S, out T, in A>
  extends Optic<never, S, A, unknown, OpticError, unknown, T>
{}

/**
 * @since 1.0.0
 */
export interface Setter<in out S, in A> extends SetterP<S, S, A> {}

/**
 * @since 1.0.0
 */
export interface Fold<in S, out A>
  extends Optic<S, never, never, OpticError, unknown, ReadonlyArray<A>, unknown>
{}

/**
 * @since 1.0.0
 */
export interface Getter<in S, out A>
  extends Optic<S, never, never, OpticError, unknown, A, unknown>
{}

/**
 * @since 1.0.0
 */
export const getOption: <S, A>(optic: Getter<S, A>) => (whole: S) => O.Option<A> = (optic) =>
  (whole) => pipe(optic.getOptic(whole), E.getRight)
