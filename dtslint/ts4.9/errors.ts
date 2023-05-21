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

// $ExpectError
Optic.id<Sstruct>().at('c')

// $ExpectError
Optic.id<Stuple>().at('2')

//
// index
//

// $ExpectError
Optic.id<SreadonlyArray>().index(true)

//
// key
//

// $ExpectError
Optic.id<SindexSignature>().key(true)
