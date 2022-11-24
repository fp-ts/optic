import * as _ from "@fp-ts/optic"
import * as O from "@fp-ts/data/Option"

// $ExpectType Optional<{ a: Option<string>; }, string>
_.id<{ a: O.Option<string> }>()
  .compose(_.prop("a"))
  .compose(_.some())
