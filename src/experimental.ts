/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type { Applicative } from "@fp-ts/core/typeclass/Applicative"
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { identity, pipe } from "@fp-ts/data/Function"
import type { Getter, Lens, Optional, PolyOptional } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export interface PolyTraversal<in S, out T, out A, in B>
  extends PolyOptional<S, T, ReadonlyArray<A>, ReadonlyArray<B>>
{}

/**
 * @since 1.0.0
 */
export const polyTraversal = <S, T, A, B>(
  decode: (s: S) => Either<readonly [Error, T], ReadonlyArray<A>>,
  replace: (bs: ReadonlyArray<B>) => (s: S) => Either<readonly [Error, T], T>
): PolyTraversal<S, T, A, B> => new Optic.OpticImpl("lens", decode, replace)

/**
 * @since 1.0.0
 */
export interface Traversal<in out S, in out A> extends PolyTraversal<S, S, A, A> {}

/**
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
export const modifyApplicative = <S, T, A, B>(optic: PolyOptional<S, T, A, B>) =>
  <F extends TypeLambda>(F: Applicative<F>) =>
    <R, E, O>(f: (a: A) => Kind<F, R, E, O, B>) =>
      (s: S): Kind<F, R, E, O, T> =>
        pipe(
          optic.getOptic(s),
          E.match(
            ([_, t]) => F.of(t),
            (a) =>
              pipe(f(a), F.map((b) => pipe(optic.setOptic(b)(s), E.match(([_, t]) => t, identity))))
          )
        )

/**
 * An optic that accesses a nested field of a struct.
 *
 * @since 1.0.0
 */
export function path<
  S,
  K1 extends keyof S,
  K2 extends keyof S[K1],
  K3 extends keyof S[K1][K2],
  K4 extends keyof S[K1][K2][K3],
  K5 extends keyof S[K1][K2][K3][K4]
>(
  ...path: [K1, K2, K3, K4, K5]
): Lens<S, S[K1][K2][K3][K4][K5]>
export function path<
  S,
  K1 extends keyof S,
  K2 extends keyof S[K1],
  K3 extends keyof S[K1][K2],
  K4 extends keyof S[K1][K2][K3]
>(
  ...path: [K1, K2, K3, K4]
): Lens<S, S[K1][K2][K3][K4]>
export function path<S, K1 extends keyof S, K2 extends keyof S[K1], K3 extends keyof S[K1][K2]>(
  ...path: [K1, K2, K3]
): Lens<S, S[K1][K2][K3]>
export function path<S, K1 extends keyof S, K2 extends keyof S[K1]>(
  ...path: [K1, K2]
): Lens<S, S[K1][K2]>
export function path<S, K1 extends keyof S>(...path: [K1]): Lens<S, S[K1]>
export function path<S>(...path: ReadonlyArray<string>): Lens<S, any> {
  let out: Lens<S, any> = Optic.id<S>()
  for (const k of path) {
    out = out.compose(Optic.at(k))
  }
  return out
}

/**
 * @since 1.0.0
 */
export const ZoomerTypeId = Symbol.for("@fp-ts/optic/Zoomer")

/**
 * @since 1.0.0
 */
export type ZoomerTypeId = typeof ZoomerTypeId

/**
 * @since 1.0.0
 */
export type FocusStructure<S> = {
  [K in keyof S | ZoomerTypeId]: K extends ZoomerTypeId ? ZoomerTypeId
    : K extends keyof S ? keyof S[K] extends string ? FocusStructure<S[K]>
    : FocusPrimitive<S[K]>
    : never
}

/**
 * @since 1.0.0
 */
export type FocusPrimitive<S> = {
  [ZoomerTypeId]: (_: S) => S
}

/**
 * @since 1.0.0
 */
export type FocusInitial<S> = keyof S extends string ? FocusStructure<S> : FocusPrimitive<S>

const focus = <S>(
  ops: Array<PropertyKey> = []
): FocusStructure<S> =>
  // @ts-expect-error
  new Proxy(new Function(), {
    get: (_, prop) => {
      if (prop === ZoomerTypeId) {
        return ops
      }
      return focus([...ops, prop])
    }
  })

/**
 * An optic that accesses a nested field of a struct.
 *
 * @since 1.0.0
 */
export const zoom: {
  <S, A>(f: (s: FocusInitial<S>) => FocusStructure<A>): Lens<S, A>
  <S, A>(f: (s: FocusInitial<S>) => FocusPrimitive<A>): Lens<S, A>
} = (f: any): any => {
  const x = f(focus() as any)
  let out: Lens<any, any> | Optional<any, any> = Optic.id()
  for (const k of (x[ZoomerTypeId] as unknown as Array<PropertyKey>)) {
    out = out.compose(Optic.at(k as any))
  }
  return out
}

/**
 * An optic that accesses a group of keys of a struct.
 *
 * @since 1.0.0
 */
export const pick = <S, Keys extends readonly [keyof S, ...Array<keyof S>]>(
  ...keys: Keys
): Lens<S, { readonly [K in Keys[number]]: S[K] }> =>
  Optic.lens((s) => {
    const out: any = {}
    for (const k of keys) {
      out[k] = s[k]
    }
    return out
  }, (a) => (s) => ({ ...s, ...a }))
