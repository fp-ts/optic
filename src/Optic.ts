/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import type { OpticFailure } from "@fp-ts/optic/OpticFailure"

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
  readonly decode: (GetWhole: GetWhole) => Either<readonly [GetError, SetWholeAfter], GetPiece>
  readonly encode: (
    SetPiece: SetPiece
  ) => (SetWholeBefore: SetWholeBefore) => Either<readonly [SetError, SetWholeAfter], SetWholeAfter>
}

/**
 * @since 1.0.0
 */
export const optic = <
  GetWhole,
  SetWholeBefore,
  SetPiece,
  GetError,
  SetError,
  GetPiece,
  SetWholeAfter
>(
  decode: (GetWhole: GetWhole) => Either<readonly [GetError, SetWholeAfter], GetPiece>,
  encode: (
    SetPiece: SetPiece
  ) => (SetWholeBefore: SetWholeBefore) => Either<readonly [SetError, SetWholeAfter], SetWholeAfter>
): Optic<
  GetWhole,
  SetWholeBefore,
  SetPiece,
  GetError,
  SetError,
  GetPiece,
  SetWholeAfter
> => ({
  decode,
  encode
})

/**
 * @since 1.0.0
 */
export interface PIso<in S, out T, out A, in B> extends Optic<S, unknown, B, never, never, A, T> {}

/**
 * @since 1.0.0
 */
export interface PLens<in S, out T, out A, in B> extends Optic<S, S, B, never, never, A, T> {}

/**
 * @since 1.0.0
 */
export interface POptional<in S, out T, out A, in B>
  extends Optic<S, S, B, OpticFailure, OpticFailure, A, T>
{}

/**
 * @since 1.0.0
 */
export interface PTraversal<in S, out T, out A, in B>
  extends Optic<S, S, ReadonlyArray<B>, OpticFailure, OpticFailure, ReadonlyArray<A>, T>
{}

/**
 * @since 1.0.0
 */
export interface PSetter<in S, out T, in A>
  extends Optic<never, S, A, unknown, OpticFailure, unknown, T>
{}

/**
 * @since 1.0.0
 */
export interface Iso<in out S, in out A> extends PIso<S, S, A, A> {}

/**
 * @since 1.0.0
 */
export interface Lens<in out S, in out A> extends PLens<S, S, A, A> {}

/**
 * @since 1.0.0
 */
export interface Optional<in out S, in out A> extends POptional<S, S, A, A> {}

/**
 * @since 1.0.0
 */
export interface Traversal<in out S, in out A> extends PTraversal<S, S, A, A> {}

/**
 * @since 1.0.0
 */
export interface Fold<in S, out A>
  extends Optic<S, never, never, OpticFailure, unknown, ReadonlyArray<A>, unknown>
{}

/**
 * @since 1.0.0
 */
export interface Getter<in S, out A>
  extends Optic<S, never, never, OpticFailure, unknown, A, unknown>
{}

/**
 * @since 1.0.0
 */
export interface Setter<in out S, in A> extends PSetter<S, S, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const poptional = <S, T, A, B>(
  decode: (s: S) => Either<readonly [OpticFailure, T], A>,
  set: (b: B) => (s: S) => Either<never, T>
): POptional<S, T, A, B> => ({
  decode,
  encode: set
})
