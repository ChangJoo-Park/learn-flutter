export const sidebars = [
  {
    label: "📦 Part 1. 시작하기",
    items: [
      { label: "개발 환경 구성", slug: "part1/setup" },
      { label: "첫 프로젝트 생성 및 실행", slug: "part1/first-project" },
      { label: "Flutter 프로젝트 구조 이해", slug: "part1/project-structure" },
    ],
  },
  {
    label: "💡 Part 2. Dart 언어 기초",
    items: [
      { label: "Dart 소개", slug: "part2/dart-intro" },
      { label: "기본 문법 및 변수", slug: "part2/basic-syntax" },
      { label: "타입 시스템 & 제네릭", slug: "part2/type-system" },
      { label: "클래스, 생성자, 팩토리", slug: "part2/classes" },
      { label: "비동기 프로그래밍", slug: "part2/async" },
      { label: "컬렉션과 반복문", slug: "part2/collections" },
      { label: "예외 처리", slug: "part2/exceptions" },
      { label: "Extension / Mixin", slug: "part2/extensions" },
      { label: "레코드 & 패턴매칭", slug: "part2/records" },
    ],
  },
  {
    label: "🧱 Part 3. Flutter의 기본 구성 요소",
    items: [
      { label: "위젯 개념과 주요 위젯", slug: "part3/widgets" },
      { label: "Stateless / Stateful 위젯", slug: "part3/stateless-stateful" },
      { label: "Widget Tree 이해", slug: "part3/widget-tree" },
      { label: "주요 위젯", slug: "part3/basic-widgets" },
      { label: "레이아웃 위젯", slug: "part3/layout-widgets" },
    ],
  },
  {
    label: "🎨 Part 4. 상태 관리",
    items: [
      { label: "상태 관리 입문", slug: "part4/state-management-intro" },
      {
        label: "setState, ValueNotifier",
        slug: "part4/setstate-valuenotifier",
      },
      { label: "InheritedWidget, Provider", slug: "part4/inherited-provider" },
      { label: "Riverpod 소개 및 실습", slug: "part4/riverpod" },
    ],
  },
  {
    label: "🚦 Part 5. 네비게이션과 화면 구성",
    items: [
      { label: "Navigator 1.0", slug: "part5/navigator1" },
      { label: "Navigator 2.0", slug: "part5/navigator2" },
      { label: "go_router 사용법", slug: "part5/go-router" },
      {
        label: "라우트 가드, ShellRoute, DeepLink",
        slug: "part5/advanced-routing",
      },
      { label: "실습: 복수 화면 전환", slug: "part5/multi-screen" },
      {
        label: "Drawer, BottomNavigationBar, TabBar",
        slug: "part5/navigation-widgets",
      },
    ],
  },
  {
    label: "🔌 Part 6. 외부와의 연동",
    items: [
      { label: "Dio를 통한 API 통신", slug: "part6/dio" },
      {
        label: "JSON 직렬화 (freezed, json_serializable)",
        slug: "part6/json-serialization",
      },
    ],
  },
  {
    label: "🧪 Part 7. 테스트와 디버깅",
    items: [
      { label: "단위 테스트", slug: "part7/unit-test" },
      { label: "위젯 테스트", slug: "part7/widget-test" },
      { label: "통합 테스트", slug: "part7/integration-test" },
      // { label: "Flutter DevTools", slug: "part7/devtools" },
      // { label: "로그 관리", slug: "part7/logging" },
    ],
  },
  {
    label: "🚀 Part 8. 앱 배포 및 운영",
    items: [
      { label: "빌드 모드", slug: "part8/build-modes" },
      { label: "Android / iOS 배포", slug: "part8/deploy-procedure" },
      { label: "Codemagic CI/CD", slug: "part8/cicd-codemagic" },
      { label: "환경 분리 및 flavor", slug: "part8/environment-flavors" },
      { label: "사용자 분석 도구", slug: "part8/analytics-tools" },
      { label: "에러 추적", slug: "part8/error-tracking" },
    ],
  },
  {
    label: "🧭 Part 9. 프로젝트 구조 & 아키텍처",
    items: [
      { label: "클린 아키텍처", slug: "part9/clean-architecture" },
      { label: "기능별 vs 계층별 폴더 구조", slug: "part9/folder-structure" },
      { label: "멀티 모듈 아키텍처", slug: "part9/multi-module" },
    ],
  },
  {
    label: "🌍 Part 10. 보완 학습",
    items: [
      { label: "CustomPainter와 RenderBox", slug: "part10/custom-painting" },
      { label: "위젯 캐싱", slug: "part10/widget-caching" },
      { label: "애니메이션", slug: "part10/animations" },
      { label: "접근성", slug: "part10/accessibility" },
      { label: "다국어 처리", slug: "part10/internationalization" },
      { label: "퍼포먼스 튜닝", slug: "part10/performance" },
      { label: "추천 패키지", slug: "part10/recommended-packages" },
    ],
  },
  {
    label: "📚 부록",
    items: [
      { label: "개발 도구와 링크", slug: "appendix/tools" },
      { label: "Flutter 오류 대응법", slug: "appendix/error-handling" },
      { label: "코드 템플릿", slug: "appendix/code-templates" },
      { label: "FAQ", slug: "appendix/faq" },
      { label: "소셜 로그인", slug: "appendix/social-login" },
      { label: "iOS 라이브 액티비티", slug: "appendix/live-activities" },
      { label: "WidgetBook", slug: "appendix/widgetbook" },
    ],
  },
];
