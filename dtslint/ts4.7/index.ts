import * as Optic from "@fp-ts/optic"

interface Sstruct {
  readonly a1: string
  readonly a2: number
  readonly a3: {
    readonly b1: boolean
    readonly b2: Date
  }
}

type Stuple = readonly [string, number]

type SreadonlyArray = ReadonlyArray<number>

type SindexSignature = Record<string, number>

//
// at
//

// $ExpectType Lens<Sstruct, string>
Optic.id<Sstruct>().at('a1')
// $ExpectType Lens<Sstruct, string>
Optic.id<Sstruct>().compose(Optic.at('a1'))

// $ExpectType Lens<Stuple, string>
Optic.id<Stuple>().at('0')
// $ExpectType Lens<Stuple, string>
Optic.id<Stuple>().compose(Optic.at('0'))

declare const isoSA: Optic.Iso<Sstruct, Sstruct['a3']>
declare const lensSA: Optic.Lens<Sstruct, Sstruct['a3']>
declare const prismSA: Optic.Prism<Sstruct, Sstruct['a3']>
declare const optionalSA: Optic.Optional<Sstruct, Sstruct['a3']>

// $ExpectType Lens<Sstruct, boolean>
isoSA.at('b1')
// $ExpectType Lens<Sstruct, boolean>
lensSA.at('b1')
// $ExpectType Optional<Sstruct, boolean>
prismSA.at('b1')
// $ExpectType Optional<Sstruct, boolean>
optionalSA.at('b1')

//
// pick
//

// $ExpectType Lens<Sstruct, { readonly a1: string; readonly a2: number; }>
Optic.id<Sstruct>().pick('a1', 'a2')

// $ExpectType Lens<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
isoSA.pick('b1', 'b2')
// $ExpectType Lens<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
lensSA.pick('b1', 'b2')
// $ExpectType Optional<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
prismSA.pick('b1', 'b2')
// $ExpectType Optional<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
optionalSA.pick('b1', 'b2')

//
// index
//

// $ExpectType Optional<SreadonlyArray, number>
Optic.id<SreadonlyArray>().index(1)
// $ExpectType Optional<SreadonlyArray, number>
Optic.id<SreadonlyArray>().compose(Optic.index(1))

//
// key
//

// $ExpectType Optional<SindexSignature, number>
Optic.id<SindexSignature>().key('a')
// $ExpectType Optional<SindexSignature, number>
Optic.id<SindexSignature>().compose(Optic.key('a'))

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
