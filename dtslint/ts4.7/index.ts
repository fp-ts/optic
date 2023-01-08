import * as Optic from "@fp-ts/optic"

interface Sstruct {
  readonly a: string
  readonly b: number
}

type Stuple = readonly [string, number]

type SreadonlyArray = ReadonlyArray<number>

type SindexSignature = Record<string, number>

//
// at
//

// $ExpectType Lens<Sstruct, string>
Optic.id<Sstruct>().at('a')
// $ExpectType Lens<Sstruct, string>
Optic.id<Sstruct>().compose(Optic.at('a'))

// $ExpectType Lens<Stuple, string>
Optic.id<Stuple>().at('0')
// $ExpectType Lens<Stuple, string>
Optic.id<Stuple>().compose(Optic.at('0'))

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
