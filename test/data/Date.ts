import { pipe } from "@fp-ts/data/Function"
import * as Optic from "@fp-ts/optic"
import * as D from "@fp-ts/optic/data/Date"

type S = {
  readonly key: {
    readonly date: Date
  }
}

const obj = { key: { date: new Date("2001-01-01T01:01:01.001Z") } }
const inc = (n: number) => n + 1

describe("Date", () => {
  it("year", () => {
    const year = pipe(Optic.id<S>().at("key").at("date").compose(D.year))

    expect(Optic.modify(year)(inc)(obj)).toEqual({
      key: { date: new Date("2002-01-01T01:01:01.001Z") }
    })
  })

  it("month", () => {
    const month = pipe(Optic.id<S>().at("key").at("date").compose(D.month))

    expect(Optic.modify(month)(inc)(obj)).toEqual({
      key: { date: new Date("2001-02-01T01:01:01.001Z") }
    })
  })

  it("day", () => {
    const day = pipe(Optic.id<S>().at("key").at("date").compose(D.day))

    expect(Optic.modify(day)(inc)(obj)).toEqual({
      key: { date: new Date("2001-01-02T01:01:01.001Z") }
    })
  })

  it("hour", () => {
    const hour = pipe(Optic.id<S>().at("key").at("date").compose(D.hour))

    expect(Optic.modify(hour)(inc)(obj)).toEqual({
      key: { date: new Date("2001-01-01T02:01:01.001Z") }
    })
  })

  it("minute", () => {
    const minute = pipe(Optic.id<S>().at("key").at("date").compose(D.minute))

    expect(Optic.modify(minute)(inc)(obj)).toEqual({
      key: { date: new Date("2001-01-01T01:02:01.001Z") }
    })
  })

  it("second", () => {
    const second = pipe(Optic.id<S>().at("key").at("date").compose(D.second))

    expect(Optic.modify(second)(inc)(obj)).toEqual({
      key: { date: new Date("2001-01-01T01:01:02.001Z") }
    })
  })

  it("millisecond", () => {
    const millisecond = pipe(Optic.id<S>().at("key").at("date").compose(D.millisecond))

    expect(Optic.modify(millisecond)(inc)(obj)).toEqual({
      key: { date: new Date("2001-01-01T01:01:01.002Z") }
    })
  })

  it("time", () => {
    const time = pipe(Optic.id<S>().at("key").at("date").compose(D.time))

    expect(Optic.modify(time)((ms) => ms + 1)(obj)).toEqual({
      key: { date: new Date("2001-01-01T01:01:01.002Z") }
    })

    expect(Optic.modify(time)((ms) => ms + 1000)(obj)).toEqual({
      key: { date: new Date("2001-01-01T01:01:02.001Z") }
    })
  })
})
