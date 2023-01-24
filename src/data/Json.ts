/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import { identity, pipe } from "@fp-ts/data/Function"
import * as J from "@fp-ts/data/Json"
import type { Optional } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export const parse: Optional<string, J.Json> = Optic.optional(
  (s) => pipe(J.parse(s), E.mapLeft(() => new Error("Json.parse"))),
  (json) => () => pipe(J.stringify(json), E.mapLeft(() => new Error("Json.parse")))
)

/**
 * @since 1.0.0
 */
export const stringify: Optional<J.Json, string> = Optic.optional(
  (json) => pipe(J.stringify(json), E.mapLeft(() => new Error("Json.stringify"))),
  (s) => () => pipe(J.parse(s), E.mapLeft(() => new Error("Json.stringify")))
)

/**
 * @since 1.0.0
 */
export const number: Optional<J.Json, number> = Optic.prism(
  (json) => typeof json === "number" ? E.right(json) : E.left(new Error("Json.number")),
  identity
)

/**
 * @since 1.0.0
 */
export const string: Optional<J.Json, string> = Optic.prism(
  (json) => typeof json === "string" ? E.right(json) : E.left(new Error("Json.string")),
  identity
)

/**
 * @since 1.0.0
 */
export const boolean: Optional<J.Json, boolean> = Optic.prism(
  (json) => typeof json === "boolean" ? E.right(json) : E.left(new Error("Json.boolean")),
  identity
)

/**
 * @since 1.0.0
 */
export const array: Optional<J.Json, J.JsonArray> = Optic.prism(
  (json) => json instanceof Array<J.Json> ? E.right(json) : E.left(new Error("Json.array")),
  identity
)

/**
 * @since 1.0.0
 */
export const object: Optional<J.Json, J.JsonObject> = Optic.prism(
  (json) =>
    typeof json === "object" && !(json instanceof Array<J.Json>) && json !== null ?
      E.right(json) :
      E.left(new Error("Json.object")),
  identity
)
