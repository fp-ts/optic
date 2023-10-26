/// <reference types="vitest" />
import path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    include: ["./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["./test/**/util.ts"]
  },
  resolve: {
    alias: {
      "@fp-ts/optic/test": path.resolve(__dirname, "/test"),
      "@fp-ts/optic": path.resolve(__dirname, "/src")
    }
  }
})
