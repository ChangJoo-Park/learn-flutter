// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { sidebars } from "./sidebar.config.mjs";
// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  prefetch: true,
  trailingSlash: "always",
  integrations: [
    astroExpressiveCode({
      themes: ["dracula"],
      plugins: [pluginLineNumbers()],
    }),
    starlight({
      title: "Flutter 문서",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: sidebars,
    }),
  ],
});
