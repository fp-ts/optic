---
"@fp-ts/optic": minor
---

- update to effect 3.0.0
- remove `experimental` module
- rename `ReadonlyArray` module to `Array`
- remove `data` folder:

  Before

  ```ts
  import * as StringOptic from "@fp-ts/optic/data/String";
  ```

  Now

  ```ts
  import * as StringOptic from "@fp-ts/optic/String";
  ```
