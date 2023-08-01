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

// @ts-expect-error
Optic.id<Sstruct>().at('c')

// @ts-expect-error
Optic.id<Stuple>().at('2')

//
// index
//

// @ts-expect-error
Optic.id<SreadonlyArray>().index(true)

//
// key
//

// @ts-expect-error
Optic.id<SindexSignature>().key(true)
