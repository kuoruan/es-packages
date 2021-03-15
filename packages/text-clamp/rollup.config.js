import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      exports: "auto",
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "es",
    },
    {
      name: "TextClamp",
      file: pkg["umd:main"],
      format: "umd",
      plugins: [
        terser({
          output: {
            comments: false,
          },
        }),
      ],
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [typescript()],
};
