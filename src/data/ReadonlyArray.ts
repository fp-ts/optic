/**
 * @since 1.0.0
 */

import * as Optic from "@fp-ts/optic"
import type { Index } from "@fp-ts/optic/typeclass/Index"

/**
 * @since 1.0.0
 */
export const getIndex = <A>(): Index<ReadonlyArray<A>, number, A> => ({
  index: Optic.index
})
