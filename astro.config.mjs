import { rehypeMermaid } from "@beoe/rehype-mermaid";
import { getCache } from "@beoe/cache";
import starlightGiscus from 'starlight-giscus'
const googleAnalyticsId = 'G-FTYYK8J5MY'

const cache = await getCache();

// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { sidebars } from "./sidebar.config.mjs";
import starlightLlmsTxt from 'starlight-llms-txt'


// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  prefetch: false,
  base: "learn-flutter",
  site: "https://changjoo-park.github.io/",
  integrations: [
    sitemap(),
    astroExpressiveCode({
      themes: ["dracula"],
      plugins: [pluginLineNumbers()],
    }),
    starlight({
      credits: true,
      title: "Flutter 배우기",
      customCss: [
        './src/styles/custom.css',
      ],
      head: [
        // Adding google analytics
        {
          tag: 'script',
          attrs: {
            src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
          },
        },
        {
          tag: 'script',
          content: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${googleAnalyticsId}');
          `,
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/changjoo-park/learn-flutter",
        },
      ],
      editLink: {
        text: "Edit this page on GitHub",
        icon: "github",
        href: "https://github.com/changjoo-park/learn-flutter/edit/main/docs/",
      },
      sidebar: sidebars,
      plugins: [
        starlightLlmsTxt({
          projectName: "Flutter 배우기",
        }),
        starlightGiscus({
          repo: 'changjoo-park/learn-flutter',
          repoId: 'R_kgDOOpJgKQ',
          category: 'Q&A',
          categoryId: 'DIC_kwDOOpJgKc4CqIHA',
          inputPosition: 'top',
          mapping: 'pathname',
          reactionsEnabled: true,
          emitMetadata: true,
          theme: 'preferred_color_scheme',
          lang: 'ko',
        })
      ],
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
});
