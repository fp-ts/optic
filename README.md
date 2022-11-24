<h3 align="center">
  <a href="https://fp-ts.github.io/codec/">
    <img src="./docs/fp-ts-logo.png">
  </a>
</h3>

<p align="center">
Access and transform immutable data
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@fp-ts/codec">
    <img src="https://img.shields.io/npm/dm/@fp-ts/codec.svg" alt="npm downloads" height="20">
  </a>
</p>

# Optics

```mermaid
flowchart TD
  Optic --> Iso
  Iso --> Lens
  Iso --> Prism
  Lens --> Optional
  Prism --> Optional
  Optional --> Traversal
  Optional --> Getter
  Getter --> Fold
  Traversal --> Fold
  Traversal --> Setter
```

# Installation

To install the **alpha** version:

```
npm install @fp-ts/optic
```

# Documentation

- [API Reference](https://fp-ts.github.io/codec/)

# License

The MIT License (MIT)
