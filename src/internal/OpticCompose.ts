/**
 * @since 1.0.0
 */
import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import type { Optic } from "@fp-ts/optic/Optic"
import { optic } from "@fp-ts/optic/Optic"

/**
 * Compose two optics when the piece of the whole returned by the get
 * operator of the first optic is not needed by the set operator of the
 * second optic.
 *
 * @since 1.0.0
 */
export const prismCompose = <GetPiece, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>(
  that: Optic<GetPiece, unknown, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>
) =>
  <
    GetWhole extends SetWholeBefore,
    SetWholeBefore,
    GetError extends GetError1,
    SetError extends SetError1,
    SetWholeAfter
  >(
    self: Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
  ): Optic<GetWhole, SetWholeBefore, SetPiece1, GetError1, SetError1, GetPiece1, SetWholeAfter> =>
    optic(
      (getWhole) =>
        pipe(
          self.decode(getWhole),
          E.flatMap(
            (getPiece) =>
              pipe(
                that.decode(getPiece),
                E.catchAll(([GetError1, SetPiece]) =>
                  pipe(
                    self.encode(SetPiece)(getWhole),
                    E.match(
                      ([_, SetWholeAfter]) => E.left([GetError1, SetWholeAfter] as const),
                      (SetWholeAfter) => E.left([GetError1, SetWholeAfter] as const)
                    )
                  )
                )
              )
          )
        ),
      (SetPiece1) =>
        (SetWholeBefore) =>
          pipe(
            that.encode(SetPiece1)(undefined),
            E.match(
              ([SetError1, SetPiece]) =>
                pipe(
                  self.encode(SetPiece)(SetWholeBefore),
                  E.match(
                    ([_, SetWholeAfter]) => E.left([SetError1, SetWholeAfter] as const),
                    (SetWholeAfter) => E.left([SetError1, SetWholeAfter] as const)
                  )
                ),
              (SetPiece) => self.encode(SetPiece)(SetWholeBefore)
            )
          )
    )

/**
 * Compose two optics when the piece of the whole returned by the first
 * optic is needed by the set operator of the second optic
 *
 * @since 1.0.0
 */
export const lensCompose = <
  GetPiece extends SetWholeBefore1,
  SetWholeBefore1,
  SetPiece1,
  GetError1,
  SetError1,
  GetPiece1,
  SetPiece
>(
  that: Optic<GetPiece, SetWholeBefore1, SetPiece1, GetError1, SetError1, GetPiece1, SetPiece>
) =>
  <
    GetWhole extends SetWholeBefore,
    SetWholeBefore,
    GetError extends (SetError1 & GetError1),
    SetError extends SetError1,
    SetWholeAfter
  >(
    self: Optic<GetWhole, SetWholeBefore, SetPiece, GetError, SetError, GetPiece, SetWholeAfter>
  ): Optic<GetWhole, GetWhole, SetPiece1, GetError1, SetError1, GetPiece1, SetWholeAfter> =>
    optic(
      (s) =>
        pipe(
          self.decode(s),
          E.flatMap(
            (a) =>
              pipe(
                that.decode(a),
                E.catchAll(([de, b]) =>
                  pipe(
                    self.encode(b)(s),
                    E.match(
                      ([_ee, t]) => E.left([de, t] as const),
                      (t) => E.left([de, t] as const)
                    )
                  )
                )
              )
          )
        ),
      (d) =>
        (s) =>
          pipe(
            self.decode(s),
            E.flatMap((a) =>
              pipe(
                that.encode(d)(a),
                E.match(
                  ([ee, b]) =>
                    pipe(
                      self.encode(b)(s),
                      E.match(
                        ([_, t]) => E.left([ee, t] as const),
                        (t) => E.left([ee, t] as const)
                      )
                    ),
                  (b) => self.encode(b)(s)
                )
              )
            )
          )
    )

/*

    Composition

    prismCompose
      - Iso -> Iso
      - Iso -> Prism
      - Prism -> Iso
      - Prism -> Prism
    lensCompose
      - Iso -> Lens
      - Iso -> Optional
      - Lens -> Lens
      - Lens -> Iso
      - Lens -> Prism
      - Lens -> Optional
      - Prism -> Lens
      - Prism -> Optional
      - Optional -> Iso
      - Optional -> Lens
      - Optional -> Prism
      - Optional -> Optional

*/

// export const composePIsoPIso: <A, B, C, D>(
//   that: PIso<A, B, C, D>
// ) => <S, T>(self: PIso<S, T, A, B>) => PIso<S, T, C, D> = prismCompose

// export const composePLensPLens: <A, B, C, D>(
//   that: PLens<A, B, C, D>
// ) => <S, T>(self: PLens<S, T, A, B>) => PLens<S, T, C, D> = lensCompose

// export const composePPrismPPrism: <A, B, C, D>(
//   that: PPrism<A, B, C, D>
// ) => <S, T>(self: PPrism<S, T, A, B>) => PPrism<S, T, C, D> = prismCompose

// export const composePOptionalPOptional: <A, B, C, D>(
//   that: POptional<A, B, C, D>
// ) => <S, T>(self: POptional<S, T, A, B>) => POptional<S, T, C, D> = lensCompose

// // ----------------

// export const composePIsoPLens: <A, B, C, D>(
//   that: PLens<A, B, C, D>
// ) => <S, T>(self: PIso<S, T, A, B>) => PLens<S, T, C, D> = lensCompose

// export const composePIsoPPrism: <A, B, C, D>(
//   that: PPrism<A, B, C, D>
// ) => <S, T>(self: PIso<S, T, A, B>) => PPrism<S, T, C, D> = prismCompose

// export const composePIsoPOptional: <A, B, C, D>(
//   that: POptional<A, B, C, D>
// ) => <S, T>(self: PIso<S, T, A, B>) => POptional<S, T, C, D> = lensCompose

// export const composePLensPIso: <A, B, C, D>(
//   that: PIso<A, B, C, D>
// ) => <S, T>(self: PLens<S, T, A, B>) => PLens<S, T, C, D> = lensCompose

// export const composePLensPPrism: <A, B, C, D>(
//   that: PPrism<A, B, C, D>
// ) => <S, T>(self: PLens<S, T, A, B>) => POptional<S, T, C, D> = lensCompose

// export const composePLensPOptional: <A, B, C, D>(
//   that: POptional<A, B, C, D>
// ) => <S, T>(self: PLens<S, T, A, B>) => POptional<S, T, C, D> = lensCompose

// export const composePPrismPOptional: <A, B, C, D>(
//   that: POptional<A, B, C, D>
// ) => <S, T>(self: PPrism<S, T, A, B>) => POptional<S, T, C, D> = lensCompose

// // ----------------

// export const composePPrismPIso: <A, B, C, D>(
//   that: PIso<A, B, C, D>
// ) => <S, T>(self: PPrism<S, T, A, B>) => PPrism<S, T, C, D> = composePPrismPPrism

// export const composePPrismPLens: <A, B, C, D>(
//   that: PLens<A, B, C, D>
// ) => <S, T>(self: PPrism<S, T, A, B>) => POptional<S, T, C, D> = composePOptionalPOptional

// export const composePOptionalPIso: <A, B, C, D>(
//   that: PIso<A, B, C, D>
// ) => <S, T>(self: POptional<S, T, A, B>) => POptional<S, T, C, D> = composePOptionalPOptional

// export const composePOptionalPLens: <A, B, C, D>(
//   that: PLens<A, B, C, D>
// ) => <S, T>(self: POptional<S, T, A, B>) => POptional<S, T, C, D> = composePOptionalPOptional

// export const composePOptionalPPrism: <A, B, C, D>(
//   that: PPrism<A, B, C, D>
// ) => <S, T>(self: POptional<S, T, A, B>) => POptional<S, T, C, D> = composePOptionalPOptional

// // assignability tests
// export function f<S, T, A, B>() {
//   const piso: PIso<S, T, A, B> = null as any
//   const piso2: PIso<S, T, ReadonlyArray<A>, ReadonlyArray<B>> = null as any
//   const plens: PLens<S, T, A, B> = piso
//   const pprism: PPrism<S, T, A, B> = piso
//   const poptional1: POptional<S, T, A, B> = piso
//   const poptional2: POptional<S, T, A, B> = plens
//   const poptional3: POptional<S, T, A, B> = pprism
//   const ptraversal1: PTraversal<S, T, A, B> = piso2
//   return {
//     piso,
//     piso2,
//     plens,
//     pprism,
//     poptional1,
//     poptional2,
//     poptional3,
//     ptraversal1
//   }
// }
