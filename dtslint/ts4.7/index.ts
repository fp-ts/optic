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

// $ExpectType PolyLens<S, T, string, boolean>
Optic.id<S, T>().compose(Optic.at<S, 'a', boolean>('a'))

// $ExpectType Lens<ST, string>
Optic.id<ST>().compose(Optic.at('0'))

// $ExpectType PolyLens<ST, TT, string, boolean>
Optic.id<ST, TT>().compose(Optic.at<ST, '0', boolean>('0'))

// $ExpectType PolyLens<S, { readonly a: boolean; readonly b: number; }, string, boolean>
Optic.at<S, 'a', boolean>('a')

// $ExpectType PolyLens<ST, readonly [boolean, number], string, boolean>
Optic.at<ST, '0', boolean>('0')

//
// filter
//

declare const isString: (u: unknown) => u is string

// $ExpectType Prism<string | number, string>
Optic.id<string | number>().compose(Optic.filter(isString))

declare const predicate: (u: string | number | boolean) => boolean

// $ExpectType Prism<string | number, string | number>
Optic.id<string | number>().compose(Optic.filter(predicate))
