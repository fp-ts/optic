import * as Optic from "@fp-ts/optic"

type ST = readonly [string, number]

// $ExpectError
Optic.key<ST, 100, boolean>(100)
