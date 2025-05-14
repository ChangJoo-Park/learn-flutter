# Flutter 온보딩 핸드북 목차

## 📦 Part 1. 시작하기: 환경 설정과 첫 프로젝트

- Flutter 소개 및 특징
- 개발 환경 구성
  - Flutter SDK 설치
  - Visual Studio Code 설정
  - 에뮬레이터 / 실기기 연결
- 첫 프로젝트 생성 및 실행
- Flutter 프로젝트 구조 이해

## 💡 Part 2. Dart 언어 기초

- Dart 소개
- 기본 문법 및 변수
- 타입 시스템 & 제네릭
- 클래스, 생성자, 팩토리
- 비동기 프로그래밍 (Future, async/await, Stream)
- 컬렉션과 반복문
- 예외 처리
- Extension / Mixin
- 레코드 & 패턴매칭 (Dart 3 이상)

## 🧱 Part 3. Flutter의 기본 구성 요소

### 위젯 개념과 주요 위젯

- Stateless / Stateful 위젯
- Widget Tree 이해
- 주요 위젯
  - Text, Button, Image, Icon
  - Container, SizedBox, Padding
  - TextField, Form, GestureDetector, InkWell
  - Visibility, Offstage, Divider, Tooltip

### 레이아웃 위젯

- Row, Column, Flex
- Stack, Align, Positioned
- Expanded, Flexible, Spacer
- SingleChildScrollView, Wrap
- AspectRatio, LayoutBuilder
- OrientationBuilder, MediaQuery
- ConstrainedBox, IntrinsicHeight 등

## 🎨 Part 4. 상태 관리

- 상태 관리 입문
  - setState, ValueNotifier
  - InheritedWidget, Provider
  - Riverpod 소개 및 실습
- 실습: TodoList 개선 (상태 관리 포함)

## 🚦 Part 5. 네비게이션과 화면 구성

- Navigator 1.0 (push/pop)
- Navigator 2.0 개념
- go_router 사용법
- 라우트 가드, ShellRoute, DeepLink
- 실습: 복수 화면 전환 및 데이터 전달
- Drawer, BottomNavigationBar, TabBar

## 🔌 Part 6. 외부와의 연동 (서버 & Firebase)

- Dio를 통한 API 통신
  - Interceptor, cancelToken, 오류 처리
- JSON 직렬화 (`json_serializable`, `freezed`)
- Firebase 연동
  - 초기 설정
  - Firebase Cloud Messaging
  - Firebase Auth & Firestore (간단히)
  - Firebase Analytics / Crashlytics

## 🧪 Part 7. 테스트와 디버깅

- 단위 테스트 (unit)
- 위젯 테스트 (widget)
- 통합 테스트 (integration)
- mockito, golden test, coverage
- Flutter DevTools 사용법
- 로그 관리 (talker)

## 🚀 Part 8. 앱 배포 및 운영

- 빌드 모드 (debug / profile / release)
- Android / iOS 배포 절차
  - keystore, signing, TestFlight
- Codemagic을 활용한 CI/CD 구성
- 환경 분리 및 flavor 설정
- 사용자 분석 도구
  - Firebase Analytics
  - Posthog
- 에러 추적
  - Crashlytics, Sentry

## 🧭 Part 9. 프로젝트 구조 & 아키텍처

- 기능별 vs 계층별 폴더 구조
- 클린 아키텍처 도입하기
- 의존성 주입 개념
- 패키지 작성 및 관리
  - pub.dev 탐색 / dev_dependencies 구분
  - internal 패키지 분리 전략
- 모노레포 구조 및 melos 도입
- 사내 Flutter 코드 스타일 가이드

## 🌍 Part 10. 보완 학습: 확장성과 품질

- CustomPainter와 RenderBox 이해
- 위젯 캐싱
- RepaintBoundary
- 애니메이션 구성 (Hero, AnimatedXXX)
- 접근성 (Semantics 등)
- 다국어 처리 (intl, flutter_localizations)
- 퍼포먼스 튜닝 체크리스트
- 추천 패키지 모음

## 📚 부록

- 개발 도구와 링크 모음
  - 공식 문서, 블로그, 영상 추천
- Flutter 오류 대응법 가이드
- 코드 템플릿 및 예제 모음 링크
- 자주 묻는 질문 (FAQ)
- 소셜 로그인
  - 네이버 로그인
  - 카카오 로그인
  - 애플 로그인
- iOS 라이브 액티비티
- WidgetBook 문서화
- 주석
- 코드 스타일
- llms.txt
