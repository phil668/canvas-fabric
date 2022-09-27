// import { defineConfig, presetIcons } from "unocss";
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from "unocss";
import liuyue from "./src/icons/output/test.json";

import("./src/icons/output/test.json").then((i) => {
  console.log("i.default", i);
});

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        custom: {
          circle:
            '<svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"></circle></svg>',
          /* ... */
        },
        liuyue: () => import("./src/icons/output/test.json"),
        /* ... */
      },
    }),
    presetWebFonts({
      fonts: {
        sans: "DM Sans",
        serif: "DM Serif Display",
        mono: "DM Mono",
      },
    }),
  ],
  shortcuts: {
    btn: "text-25px mb-10px cursor-pointer hover:text-blue",
    "btn-primary":
      "inline-block px-6 py-2 border-2 border-blue-600 text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out",
  },
});
