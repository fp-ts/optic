/**
 * @since 1.0.0
 */

import * as E from "@fp-ts/data/Either"
import type { Optional } from "@fp-ts/optic"
import { optional } from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export const isChar = (s: string): s is string => s.length > 0

/**
 * An optic that accesses the specified index of a `string`.
 *
 * @since 1.0.0
 */
export const index = (n: number): Optional<string, string> =>
  optional(
    (s) =>
      n >= 0 && n < s.length ?
        E.right(s[n]) :
        E.left(new Error(`${s} did not satisfy hasAt(${n})`)),
    (char) =>
      (s) => {
        if (!isChar(char)) {
          return E.left(new Error("did not satisfy isChar"))
        }
        if (n >= 0 && n < s.length) {
          return E.right(s.substring(0, n) + char.charAt(0) + s.substring(n + 1))
        }
        return E.left(new Error(`${s} did not satisfy hasAt(${n})`))
      }
  )
