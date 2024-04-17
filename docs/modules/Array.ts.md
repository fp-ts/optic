---
title: Array.ts
nav_order: 1
parent: Modules
---

## Array overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [consNonEmpty](#consnonempty)

---

# constructors

## consNonEmpty

An optic that accesses the `Cons` case of a `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const consNonEmpty: {
  <A>(): Iso<readonly [A, ...A[]], readonly [A, readonly A[]]>
  <A, B>(): PolyIso<readonly [A, ...A[]], readonly [B, ...B[]], readonly [A, readonly A[]], readonly [B, readonly B[]]>
}
```

Added in v1.0.0
