import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import autoPreprocess from "svelte-preprocess";
import rootImport from "rollup-plugin-root-import";

const production = !process.env.ROLLUP_WATCH;

export default {
  input: "src/svelte.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: "public/build/bundle.js",
  },
  plugins: [
    rootImport({
      // Will first look in `client/src/*` and then `common/src/*`.
      root: `${__dirname}/src`,
      useInput: "prepend",

      // If we don't find the file verbatim, try adding these extensions
      extensions: [".js", ".svelte", ".css"],
    }),
    svelte({
      preprocess: autoPreprocess({
        postcss: {
          plugins: [require("postcss-import"), require("postcss-nested")],
        },
      }),
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file - better for performance
      css: (css) => {
        css.write("public/build/bundle.css");
      },
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload("public"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
