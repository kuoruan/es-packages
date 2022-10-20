import typescript from "@rollup/plugin-typescript";
import { yourFunction } from "rollup-plugin-your-function";
import { minify } from "terser";

import pkg from "./package.json" assert { type: "json" };

const terser = () =>
  yourFunction({
    output: true,
    name: "terser",
    fn: async (source, options) =>
      minify(source, {
        module: /^esm?$/.test(options.outputOptions.format),
        toplevel: options.outputOptions.format === "cjs",
        sourceMap: true,
      }),
  });

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
