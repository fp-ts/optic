/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { identity, pipe } from "@fp-ts/data/Function"
import { prismCompose } from "@fp-ts/optic/internal/OpticCompose"
import type { OpticFailure } from "@fp-ts/optic/OpticFailure"
import { opticFailure } from "@fp-ts/optic/OpticFailure"
import type { PPrism } from "@fp-ts/optic/PPrism"
import { pprism } from "@fp-ts/optic/PPrism"

/**
 * @since 1.0.0
 */
export interface Prism<in out S, in out A> extends PPrism<S, S, A, A> {}

/**
 * @category constructors
 * @since 1.0.0
 */
export const prism = <S, A>(
  get: (s: S) => Either<OpticFailure, A>,
  set: (a: A) => S
): Prism<S, A> => pprism((s) => pipe(get(s), E.mapLeft((e) => [e, s])), (a) => E.right(set(a)))

/**
 * @category constructors
 * @since 1.0.0
 */
export const fromRefinement = <S, A extends S>(
  refinement: (s: S) => s is A,
  onFailure: OpticFailure
): Prism<S, A> =>
  prism(
    (s) => refinement(s) ? E.right(s) : E.left(onFailure),
    identity
  )

/**
 * @since 1.0.0
 */
export const compose: <A, B>(
  that: Prism<A, B>
) => <S>(self: Prism<S, A>) => Prism<S, B> = prismCompose

/**
 * @since 1.0.0
 */
export const string: Prism<unknown, string> = fromRefinement(
  (s): s is string => typeof s === "string",
  opticFailure("not a string")
)

/**
 * @since 1.0.0
 */
export const number: Prism<unknown, number> = fromRefinement(
  (s): s is number => typeof s === "number",
  opticFailure("not a number")
)

/**
 * @since 1.0.0
 */
export const object: Prism<
  unknown,
  object
> = fromRefinement(
  (s): s is object => typeof s === "object" && s !== null,
  opticFailure("not an object")
)

/**
 * @since 1.0.0
 */
export const indexSignature: Prism<
  object,
  { [_: string]: unknown }
> = fromRefinement(
  (s): s is { [_: string]: unknown } => !Array.isArray(s),
  opticFailure("not an index signature")
)

/**
 * @since 1.0.0
 */
export const exactKeys = <Keys extends [string, ...ReadonlyArray<string>]>(
  ...keys: Keys
): Prism<
  { [_: string]: unknown },
  { [K in Keys[number]]: unknown }
> =>
  prism(
    (s) => {
      const out: any = {}
      for (const key of keys) {
        if (!(key in s)) {
          return E.left(opticFailure(`missing ${JSON.stringify(key)} key`))
        }
        out[key] = s[key]
      }
      return E.right(out)
    },
    identity
  )

/**
 * @since 1.0.0
 */
export const key = <Key extends string, B>(
  key: Key,
  value: Prism<unknown, B>
): <S, A extends { [_: string]: unknown }>(
  self: Prism<S, A>
) => Prism<S, A & { [K in Key]: B }> =>
  compose(prism(
    (a) => {
      if (key in a) {
        return pipe(
          value.decode(a[key]),
          E.bimap(([e, _]) => e, (b) => ({ ...a, [key]: b }))
        )
      }
      return E.left(opticFailure(`missing ${JSON.stringify(key)} key`))
    },
    identity
  ))

/**
 * @since 1.0.0
 */
export const keys = <Keys extends Record<string, Prism<unknown, any>>>(
  keys: Keys
) =>
  <S, A extends { [_: string]: unknown }>(
    self: Prism<S, A>
  ): Prism<S, A & { [K in keyof Keys]: Keys[K] extends Prism<any, infer B> ? B : never }> =>
    pipe(
      self,
      compose(prism<A, A & { [K in keyof Keys]: Keys[K] extends Prism<any, infer B> ? B : never }>(
        (a) => {
          const out: any = {}
          for (const key in keys) {
            if (!(key in a)) {
              return E.left(opticFailure(`missing ${JSON.stringify(key)} key`))
            }
            const e = keys[key].decode(a[key])
            if (E.isLeft(e)) {
              return pipe(
                e,
                E.bimap(([e]) => opticFailure(`key ${JSON.stringify(key)} ${e.message}`), () => a)
              )
            }
            out[key] = e.right
          }
          return E.right(out)
        },
        identity
      ))
    )
