/**
 * @since 1.0.0
 */

/**
 * @category constructors
 * @since 1.0.0
 */
export interface OpticFailure {
  readonly message: string
}

/**
 * @since 1.0.0
 */
export const opticFailure = (message: string): OpticFailure => ({ message })
