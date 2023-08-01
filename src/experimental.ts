/**
 * @since 1.0.0
 */
import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import type { Kind, TypeLambda } from "@effect/data/HKT"
import type { Applicative } from "@effect/typeclass/Applicative"
import type { Lens, Optional, PolyOptional } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export const modifyApplicative = <S, T, A, B>(optic: PolyOptional<S, T, A, B>) =>
  <F extends TypeLambda>(F: Applicative<F>) =>
    <R, E, O>(f: (a: A) => Kind<F, R, E, O, B>) =>
      (s: S): Kind<F, R, E, O, T> =>
        pipe(
          optic.getOptic(s),
          Either.match({
            onLeft: ([_, t]) => F.of(t),
            onRight: (a) =>
              pipe(
                f(a),
                F.map((b) =>
                  pipe(
                    optic.setOptic(b)(s),
                    Either.getOrElse(([_, t]) => t)
                  )
                )
              )
          })
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
    out = out.at(k)
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
    out = out.at(k as any)
  }
  return out
}
