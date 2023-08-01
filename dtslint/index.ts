import * as Optic from "@fp-ts/optic"

interface Sstruct {
  readonly a1: string
  readonly a2: number
  readonly a3: {
    readonly b1: boolean
    readonly b2: Date
    readonly b3: bigint
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

// $ExpectType Lens<Stuple, string>
Optic.id<Stuple>().at('0')

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
// omit
//

// $ExpectType Lens<Sstruct, { readonly a1: string; readonly a2: number; }>
Optic.id<Sstruct>().omit('a3')

// $ExpectType Lens<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
isoSA.omit('b3')
// $ExpectType Lens<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
lensSA.omit('b3')
// $ExpectType Optional<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
prismSA.omit('b3')
// $ExpectType Optional<Sstruct, { readonly b1: boolean; readonly b2: Date; }>
optionalSA.omit('b3')

//
// index
//

// $ExpectType Optional<SreadonlyArray, number>
Optic.id<SreadonlyArray>().index(1)

//
// key
//

// $ExpectType Optional<SindexSignature, number>
Optic.id<SindexSignature>().key('a')

// $ExpectType Optional<{ readonly a: { readonly [x: string]: number; }; }, number>
Optic.id<{ readonly a: { readonly [x: string]: number } }>().at('a').key('b')

//
// filter
//

declare const isString: (u: unknown) => u is string

// $ExpectType Prism<string | number, string>
Optic.id<string | number>().filter(isString)

declare const predicate: (u: string | number | boolean) => boolean

// $ExpectType Prism<string | number, string | number>
Optic.id<string | number>().filter(predicate)

//
// findFirst
//

// $ExpectType Optional<readonly (string | number)[], string>
Optic.id<ReadonlyArray<string | number>>().compose(Optic.findFirst(isString))

// $ExpectType Optional<readonly (string | number)[], string | number>
Optic.id<ReadonlyArray<string | number>>().compose(Optic.findFirst(predicate))
