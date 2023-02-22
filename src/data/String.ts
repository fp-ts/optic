/**
 * @since 1.0.0
 */

import * as E from "@effect/data/Either"
import * as String from "@effect/data/String"
import type { Optional } from "@fp-ts/optic"
import * as Optic from "@fp-ts/optic"

/**
 * An optic that accesses the specified index of a `string`.
 *
 * @since 1.0.0
 */
export const index = (i: number): Optional<string, string> =>
  Optic.optional(
    (s) =>
      i >= 0 && i < s.length ?
        E.right(s[i]) :
        E.left(new Error(`Missing index ${i}`)),
    (char) =>
      (s) => {
        if (String.isEmpty(char)) {
          return E.left(new Error("Expected a non empty string"))
        }
        if (i >= 0 && i < s.length) {
          return E.right(s.substring(0, i) + char.charAt(0) + s.substring(i + 1))
        }
        return E.left(new Error(`Missing index ${i}`))
      }
  )
