/**
 * @since 1.0.0
 */

import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 * An optic that accesses the year of a `Date`. Uses `Date.prototype.getFullYear` and `Date.prototype.setFullYear`.
 */
export const year = Optic.lens(
  (date: Date) => date.getFullYear(),
  (val: number) => (date) => new Date(new Date(date).setFullYear(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the month of a `Date`. Uses `Date.prototype.getMonth` and `Date.prototype.setMonth`.
 */
export const month = Optic.lens(
  (date: Date) => date.getMonth(),
  (val: number) => (date) => new Date(new Date(date).setMonth(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the day(of the month) of a `Date`. Uses `Date.prototype.getDate` and `Date.prototype.setDate`.
 */
export const day = Optic.lens(
  (date: Date) => date.getDate(),
  (val: number) => (date) => new Date(new Date(date).setDate(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the hour of a `Date`. Uses `Date.prototype.getHours` and `Date.prototype.setHours`.
 */
export const hour = Optic.lens(
  (date: Date) => date.getHours(),
  (val: number) => (date) => new Date(new Date(date).setHours(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the minutes of a `Date`. Uses `Date.prototype.getMinutes` and `Date.prototype.setMinutes`.
 */
export const minute = Optic.lens(
  (date: Date) => date.getMinutes(),
  (val: number) => (date) => new Date(new Date(date).setMinutes(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the seconds of a `Date`. Uses `Date.prototype.getSeconds` and `Date.prototype.setSeconds`.
 */
export const second = Optic.lens(
  (date: Date) => date.getSeconds(),
  (val: number) => (date) => new Date(new Date(date).setSeconds(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the milliseconds of a `Date`. Uses `Date.prototype.getMilliseconds` and `Date.prototype.setMilliseconds`.
 */
export const millisecond = Optic.lens(
  (date: Date) => date.getMilliseconds(),
  (val: number) => (date) => new Date(new Date(date).setMilliseconds(val))
)

/**
 * @since 1.0.0
 * An optic that accesses the time(ms since epoch) of a `Date`. Uses `Date.prototype.getTime` and `Date.prototype.setTime`.
 */
export const time = Optic.lens(
  (date: Date) => date.getTime(),
  (val: number) => (date) => new Date(new Date(date).setTime(val))
)
