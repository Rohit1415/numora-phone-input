import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/styles/index.css"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: true,
  outDir: "dist",
  external: ["react", "react-dom"]
});
