import * as Optic from "@fp-ts/optic"

interface S {
  readonly a: string
  readonly b: number
}

interface T {
  readonly a: boolean
  readonly b: number
}

type ST = readonly [string, number]

type TT = readonly [boolean, number]

//
// at
//

// $ExpectType Lens<S, string>
Optic.id<S>().compose(Optic.at('a'))

// $ExpectType Lens<ST, string>
Optic.id<ST>().compose(Optic.at('0'))

//
// filter
//

declare const isString: (u: unknown) => u is string

// $ExpectType Prism<string | number, string>
Optic.id<string | number>().compose(Optic.filter(isString))

declare const predicate: (u: string | number | boolean) => boolean

// $ExpectType Prism<string | number, string | number>
Optic.id<string | number>().compose(Optic.filter(predicate))

//
// findFirst
//

// $ExpectType Optional<readonly (string | number)[], string>
Optic.id<ReadonlyArray<string | number>>().compose(Optic.findFirst(isString))

// $ExpectType Optional<readonly (string | number)[], string | number>
Optic.id<ReadonlyArray<string | number>>().compose(Optic.findFirst(predicate))
