import * as _ from "@fp-ts/optic"
import * as O from "@fp-ts/data/Option"

// $ExpectType Optional<{ a: Option<string>; }, string>
_.id<{ a: O.Option<string> }>()
  .compose(_.key("a"))
  .compose(_.some())

interface S {
  readonly a: string
  readonly b: number
  readonly c: boolean
  readonly d: [string, number]
  readonly e: ReadonlyArray<number>
}

//
// key
//

// $ExpectType Lens<S, string>
_.id<S>().compose(_.key('a'))

// $ExpectType Lens<S, number>
_.id<S>().compose(_.key('d')).compose(_.key('1'))
