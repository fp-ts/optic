import type { Lens, Optional } from "@fp-ts/optic"
import { id, key, lens } from "@fp-ts/optic"

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
  let out: Lens<S, any> = id<S>()
  for (const k of path) {
    out = out.compose(key(k))
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
  let out: Lens<any, any> | Optional<any, any> = id()
  for (const k of (x[ZoomerTypeId] as unknown as Array<PropertyKey>)) {
    out = out.compose(key(k as any))
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
  lens((s) => {
    const out: any = {}
    for (const k of keys) {
      out[k] = s[k]
    }
    return out
  }, (a) => (s) => ({ ...s, ...a }))
