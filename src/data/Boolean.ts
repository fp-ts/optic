/**
 * @since 1.0.0
 */

import type { Optional } from "@fp-ts/optic"
import { modify } from "@fp-ts/optic"

/**
 * @since 1.0.0
 */
export const toggle = <S>(optic: Optional<S, boolean>): (s: S) => S => modify(optic)((a) => !a)
