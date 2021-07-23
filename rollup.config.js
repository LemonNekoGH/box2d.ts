import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    file: "./dist/box2d.gc.js",
    name: "GCBox2D",
    format: "iife",
    sourcemap: true
  },
  plugins: [
    typescript({ clean: true, tsconfigOverride: { compilerOptions: { target: "ES2015", module: "ES2015", declaration: false } } }),
  ]
};
