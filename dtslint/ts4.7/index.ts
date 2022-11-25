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
// key
//

// $ExpectType Lens<S, string>
Optic.id<S>().compose(Optic.key('a'))

// $ExpectType PolyLens<S, T, string, boolean>
Optic.id<S, T>().compose(Optic.key<S, 'a', boolean>('a'))

// $ExpectType Lens<ST, string>
Optic.id<ST>().compose(Optic.key('0'))

// $ExpectType PolyLens<ST, TT, string, boolean>
Optic.id<ST, TT>().compose(Optic.key<ST, '0', boolean>('0'))

// $ExpectType PolyLens<S, { readonly a: boolean; readonly b: number; }, string, boolean>
Optic.key<S, 'a', boolean>('a')

// $ExpectType PolyLens<ST, readonly [boolean, number], string, boolean>
Optic.key<ST, '0', boolean>('0')
