/**
 * @since 1.0.0
 */
import * as E from "@effect/data/Either"
import type { Option } from "@effect/data/Option"
import * as O from "@effect/data/Option"
import type { Prism } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the `None` case of an `Option`.
 *
 * @since 1.0.0
 */
export const none = <A>(): Prism<Option<A>, void> =>
  Optic.prism(
    O.match(
      () => E.right<void>(undefined),
      () => E.left(new Error("Expected a None"))
    ),
    (): Option<A> => O.none()
  )
