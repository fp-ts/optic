import * as _ from "@fp-ts/optic"

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
_.id<S>().compose(_.key('a'))

// $ExpectType LensPoly<S, T, string, boolean>
_.id<S, T>().compose(_.key<S, 'a', boolean>('a'))

// $ExpectType Lens<ST, string>
_.id<ST>().compose(_.key('0'))

// $ExpectType LensPoly<ST, TT, string, boolean>
_.id<ST, TT>().compose(_.key<ST, '0', boolean>('0'))

// $ExpectType LensPoly<S, { readonly a: boolean; readonly b: number; }, string, boolean>
_.key<S, 'a', boolean>('a')

// $ExpectType LensPoly<ST, readonly [boolean, number], string, boolean>
_.key<ST, '0', boolean>('0')

// $ExpectError
_.key<ST, 100, boolean>(100)
