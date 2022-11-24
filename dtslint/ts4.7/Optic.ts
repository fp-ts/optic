import * as _ from "@fp-ts/optic"
import * as O from "@fp-ts/data/Option"
import { pipe } from "@fp-ts/data/Function"

// $ExpectType Optional<{ a: Option<string>; }, string>
_.id<{ a: O.Option<string> }>()
  .compose(_.key("a"))
  .compose(_.some())

interface ObjectS {
  readonly a: string
  readonly b: number
  readonly c: boolean
  readonly d: [string, number]
}

type TupleS = [string, number]

//
// key
//

// $ExpectType Lens<ObjectS, string>
_.id<ObjectS>().compose(_.key('a'))

// $ExpectType Lens<TupleS, number>
_.id<TupleS>().compose(_.key('1'))

//
// zoom
//

// $ExpectType Lens<ObjectS, string>
_.id<ObjectS>().compose(_.zoom(_ => _.d[0]))
