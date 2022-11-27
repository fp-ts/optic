import type { Iso, Lens, Optional, Prism } from "@fp-ts/optic"

interface S { s: A }
interface A { a: string }

declare const isoSA: Iso<S, A>
declare const lensSA: Lens<S, A>
declare const prismSA: Prism<S, A>
declare const optionalSA: Optional<S, A>

// $ExpectType Lens<S, string>
isoSA.at('a')
// $ExpectType Lens<S, string>
lensSA.at('a')
// $ExpectType Optional<S, string>
prismSA.at('a')
// $ExpectType Optional<S, string>
optionalSA.at('a')
