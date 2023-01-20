/**
 * @since 1.0.0
 */

import * as Optic from "@fp-ts/optic"

/**
 * @since 1.0.0
 * An optic that accesses the year of a `Date`. Uses `Date.prototype.getFullYear` and `Date.prototype.setFullYear`.
 */
export const year = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getFullYear() : date.getUTCFullYear(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setFullYear(val) : new Date(date).setUTCFullYear(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the month of a `Date`. Uses `Date.prototype.getMonth` and `Date.prototype.setMonth`.
 */
export const month = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getMonth() : date.getUTCMonth(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setMonth(val) : new Date(date).setUTCMonth(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the day(of the month) of a `Date`. Uses `Date.prototype.getDate` and `Date.prototype.setDate`.
 */
export const day = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getDate() : date.getUTCDate(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setDate(val) : new Date(date).setUTCDate(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the hour of a `Date`. Uses `Date.prototype.getHours` and `Date.prototype.setHours`.
 */
export const hour = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getHours() : date.getUTCHours(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setHours(val) : new Date(date).setUTCHours(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the minutes of a `Date`. Uses `Date.prototype.getMinutes` and `Date.prototype.setMinutes`.
 */
export const minute = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getMinutes() : date.getUTCMinutes(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setMinutes(val) : new Date(date).setUTCMinutes(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the seconds of a `Date`. Uses `Date.prototype.getSeconds` and `Date.prototype.setSeconds`.
 */
export const second = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getSeconds() : date.getUTCSeconds(),
    (val: number) =>
      (date) => new Date(utc ? new Date(date).setSeconds(val) : new Date(date).setUTCSeconds(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the milliseconds of a `Date`. Uses `Date.prototype.getMilliseconds` and `Date.prototype.setMilliseconds`.
 */
export const millisecond = (utc?: boolean) =>
  Optic.lens(
    (date: Date) => utc ? date.getMilliseconds() : date.getUTCMilliseconds(),
    (val: number) =>
      (date) =>
        new Date(utc ? new Date(date).setMilliseconds(val) : new Date(date).setUTCMilliseconds(val))
  )

/**
 * @since 1.0.0
 * An optic that accesses the time(ms since epoch) of a `Date`. Uses `Date.prototype.getTime` and `Date.prototype.setTime`.
 */
export const time = () =>
  Optic.lens(
    (date: Date) => date.getTime(),
    (val: number) => (date) => new Date(new Date(date).setTime(val))
  )
