/**
 * @since 1.0.0
 */
import * as Either from "@effect/data/Either"
import * as Option from "@effect/data/Option"
import type { Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the `None` case of an `Option`.
 *
 * @since 1.0.0
 */
export const none = <A>(): Prism<Option.Option<A>, void> =>
  Optic.prism(
    Option.match({
      onNone: () => Either.right<void>(undefined),
      onSome: () => Either.left(new Error("Expected a None"))
    }),
    (): Option.Option<A> => Option.none()
  )
