// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  prefetch: true,
  trailingSlash: "always",
  integrations: [
    starlight({
      title: "My Own Flutter Book",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/withastro/starlight",
        },
      ],
      sidebar: [
        {
          label: "안내",
          items: [
            { label: "소개", slug: "introduction/introduction" },
            { label: "시작하기", slug: "introduction/getting-started" },
          ],
        },
        {
          label: "튜토리얼",
          items: [
            { label: "프로젝트 1. 카운터", slug: "tutorials/1_counter" },
            {
              label: "프로젝트 2. TodoList",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "개발 가이드",
          items: [
            { label: "프로젝트 1. 카운터", slug: "tutorials/1_counter" },
            {
              label: "프로젝트 2. TodoList",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "주요 컴포넌트",
          items: [
            { label: "프로젝트 1. 카운터", slug: "tutorials/1_counter" },
            {
              label: "프로젝트 2. TodoList",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "참조",
          autogenerate: { directory: "reference" },
        },
        {
          label: "리소스",
          items: [
            {
              label: "프로젝트 2. TodoList",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
      ],
    }),
  ],
});
