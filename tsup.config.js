import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  outDir: "dist",
  dts: true,
  clean: true,
  format: "esm",
  minify: true,
  sourcemap: "inline",
});
