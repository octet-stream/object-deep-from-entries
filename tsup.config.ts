import {defineConfig} from "tsup"

export default defineConfig({
  entry: {
    "object-deep-from-entries": "src/index.ts"
  },
  outDir: "lib",
  format: ["esm", "cjs"],
  dts: true,
  splitting: false
})
