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
      title: "Flutter 문서",
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
          label: "기본 컴포넌트",
          items: [
            { label: "Container", slug: "tutorials/1_counter" },
						{ label: "레이아웃", slug: "tutorials/1_counter" },
						{ label: "폼 엘리먼트", slug: "tutorials/1_counter" },
						{ label: "폼 엘리먼트", slug: "tutorials/1_counter" },
          ],
        },
        {
          label: "커스텀 컴포넌트",
          items: [
            { label: "Container", slug: "tutorials/1_counter" },
            {
              label: "프로젝트 2. TodoList",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "네이티브와의 소통",
          items: [
            { label: "소개", slug: "tutorials/1_counter" },
            {
              label: "MethodChannel",
              slug: "tutorials/2_todo_list",
            },
						{
              label: "iOS에 이벤트 전달",
              slug: "tutorials/2_todo_list",
            },
						{
              label: "Android에 이벤트 전달",
              slug: "tutorials/2_todo_list",
            },
						{
              label: "네이티브에서 Flutter로",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "상태 관리",
          items: [
            { label: "소개", slug: "tutorials/1_counter" },
            {
              label: "InheritedWidget",
              slug: "tutorials/2_todo_list",
            },
            {
              label: "riverpod",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "에셋 관리",
          items: [
            { label: "소개", slug: "tutorials/1_counter" },
            { label: "flutter_gen", slug: "tutorials/1_counter" },
            {
              label: "활용 패턴",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
				{
          label: "패키지",
          items: [
            { label: "소개", slug: "tutorials/1_counter" },
            {
              label: "패키지 관리",
              slug: "tutorials/2_todo_list",
            },
            {
              label: "패키지 작성",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "모노레포",
          items: [
            { label: "소개", slug: "tutorials/1_counter" },
            {
              label: "melos vs dart workspace",
              slug: "tutorials/2_todo_list",
            },
            {
              label: "모노레포 활용 패턴",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "운영",
          items: [
						{ label: "배포 환경", slug: "tutorials/1_counter" },
						{ label: "자동 배포 (Codemagic)", slug: "tutorials/1_counter" },
						{ label: "Apple Appstore", slug: "tutorials/1_counter" },
						{ label: "Google Play", slug: "tutorials/1_counter" },
						{
              label: "사용자 분석 (Firebase Analytics)",
              slug: "tutorials/2_todo_list",
            },
						{
              label: "사용자 분석 (Posthog)",
              slug: "tutorials/2_todo_list",
            },
            {
              label: "오류 추적 (Sentry)",
              slug: "tutorials/2_todo_list",
            },
            {
              label: "오류 추적 (Firebase Crashlytics)",
              slug: "tutorials/2_todo_list",
            },
          ],
        },
        {
          label: "참조",
          items: [
            {
              label: "의존성 관리",
              slug: "tutorials/2_todo_list",
            },
						{ label: "Flutter Hooks", slug: "tutorials/1_counter" },
						{ label: "추천 패키지", slug: "tutorials/1_counter" },

          ],
        },
      ],
    }),
  ],
});
