import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { getCache } from "@beoe/cache";

const cache = await getCache();

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { sidebars } from "./sidebar.config.mjs";
// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  prefetch: false,
  integrations: [
    sitemap(),
    astroExpressiveCode({
      themes: ["dracula"],
      plugins: [pluginLineNumbers()],
    }),
    starlight({
      title: "Flutter 배우기",
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
  markdown: {
    rehypePlugins: [
      [
        rehypeMermaid,
        {
          strategy: "file",      // alternatively use "data-url"
          fsPath: "public/beoe", // add this to gitignore
          webPath: "/beoe",
          darkScheme: "class",
          cache,
        },
      ],
    ],
  },
  site: "https://changjoo-park.github.io/learn-flutter",
  base: "learn-flutter",
});
