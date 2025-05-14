---
title: 통합 테스트
---

통합 테스트(Integration Test)는 앱의 다양한 부분들이 함께 작동하는 방식을 검증하는 테스트입니다. 단위 테스트가 작은 코드 조각을, 위젯 테스트가 UI 컴포넌트를 검증한다면, 통합 테스트는 실제 디바이스나 에뮬레이터에서 앱 전체의 동작을 확인합니다.

## 통합 테스트의 필요성

통합 테스트는 다음과 같은 이유로 중요합니다:

1. **실제 환경 검증**: 실제 디바이스나 에뮬레이터에서 앱의 동작을 테스트합니다.
2. **전체 기능 흐름 검증**: 사용자 시나리오에 따른 앱의 기능 흐름을 종합적으로 테스트합니다.
3. **성능 이슈 발견**: 실제 환경에서 발생할 수 있는 성능 문제를 조기에 발견합니다.
4. **기기별 호환성 검증**: 다양한 화면 크기와 OS 버전에서의 동작을 검증합니다.
5. **백엔드 연동 검증**: 실제 또는 테스트용 백엔드와의 통합 작동을 검증합니다.

## 테스트 종류별 특징

## 통합 테스트 설정

Flutter에서 통합 테스트를 수행하려면 `integration_test` 패키지를 사용합니다:

### 1. 패키지 추가

`pubspec.yaml` 파일에 다음 의존성을 추가합니다:

```yaml
dev_dependencies:
  integration_test:
    sdk: flutter
  flutter_test:
    sdk: flutter
```

### 2. 프로젝트 구조 설정

통합 테스트는 프로젝트 루트의 `integration_test` 디렉토리에 작성합니다:

```
my_app/
  ├── lib/
  ├── test/                 # 단위 및 위젯 테스트
  ├── integration_test/     # 통합 테스트
  │    └── app_test.dart
  └── pubspec.yaml
```

## 기본 통합 테스트 작성하기

간단한 카운터 앱의 통합 테스트 예제를 살펴보겠습니다:

```dart
// integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('통합 테스트', () {
    testWidgets('카운터 증가 테스트', (WidgetTester tester) async {
      // 앱 실행
      app.main();
      await tester.pumpAndSettle();

      // 초기 상태 확인 - 카운터가 0인지
      expect(find.text('0'), findsOneWidget);

      // FloatingActionButton 찾기
      final Finder fab = find.byType(FloatingActionButton);

      // 버튼 탭하기
      await tester.tap(fab);
      await tester.pumpAndSettle();

      // 탭 후 카운터가 1로 증가했는지 확인
      expect(find.text('1'), findsOneWidget);

      // 한 번 더 탭하기
      await tester.tap(fab);
      await tester.pumpAndSettle();

      // 카운터가 2로 증가했는지 확인
      expect(find.text('2'), findsOneWidget);
    });
  });
}
```

### 주요 단계 설명

1. **초기화**: `IntegrationTestWidgetsFlutterBinding.ensureInitialized()`로 통합 테스트 환경을 초기화합니다.
2. **앱 실행**: `app.main()`으로 앱을 시작합니다.
3. **UI 안정화**: `tester.pumpAndSettle()`로 모든 애니메이션이 완료될 때까지 기다립니다.
4. **위젯 찾기**: `find`를 사용하여 상호작용할 위젯을 찾습니다.
5. **상호작용**: `tester.tap()`으로 위젯과 상호작용합니다.
6. **검증**: `expect`로 예상 결과를 확인합니다.

## 통합 테스트 실행하기

통합 테스트를 실행하는 방법은 여러 가지가 있습니다:

### 1. 명령줄에서 실행

```bash
flutter test integration_test/app_test.dart
```

### 2. 여러 디바이스에서 실행

```bash
flutter test integration_test --device-id=all
```

### 3. Firebase Test Lab에서 실행

통합 테스트를 Firebase Test Lab에서 실행하면 다양한 기기에서 테스트할 수 있습니다.

#### Android의 경우:

먼저 테스트 APK 파일들을 빌드합니다:

```bash
flutter build apk --profile
flutter build apk --profile --target=integration_test/app_test.dart
```

그런 다음 Firebase Test Lab으로 업로드하여 실행합니다:

```bash
gcloud firebase test android run \
  --type instrumentation \
  --app build/app/outputs/apk/profile/app-profile.apk \
  --test build/app/outputs/apk/androidTest/profile/app-profile-androidTest.apk \
  --device model=Pixel2,version=28
```

#### iOS의 경우:

XCUITest 파일을 빌드하고 Firebase Test Lab으로 업로드합니다:

```bash
flutter build ios --profile --no-codesign
pushd ios
xcodebuild build-for-testing \
  -workspace Runner.xcworkspace \
  -scheme Runner \
  -configuration Debug \
  -derivedDataPath ../build/ios_integ
popd

gcloud firebase test ios run \
  --xcode-version=10.0 \
  --test build/ios_integ/Build/Products/Runner_iphoneos14.5-arm64.xctestrun
```

## 고급 통합 테스트 기법

### 1. 스크린샷 캡처하기

테스트 과정에서 스크린샷을 캡처하여 UI 상태를 기록할 수 있습니다:

```dart
testWidgets('스크린샷 캡처 테스트', (WidgetTester tester) async {
  app.main();
  await tester.pumpAndSettle();

  // 초기 화면 스크린샷
  await takeScreenshot(tester, 'initial_screen');

  // 버튼 탭
  await tester.tap(find.byType(FloatingActionButton));
  await tester.pumpAndSettle();

  // 탭 후 화면 스크린샷
  await takeScreenshot(tester, 'after_tap');
});

Future<void> takeScreenshot(WidgetTester tester, String name) async {
  final Directory dir = Directory('screenshots');
  if (!dir.existsSync()) {
    dir.createSync();
  }

  final ByteData bytes = await tester.takeScreenshot();
  final File file = File('${dir.path}/$name.png');
  file.writeAsBytesSync(bytes.buffer.asUint8List());
}
```

### 2. 성능 프로파일링

테스트 중 앱의 성능을 측정할 수 있습니다:

```dart
testWidgets('성능 테스트', (WidgetTester tester) async {
  app.main();
  await tester.pumpAndSettle();

  final Stopwatch stopwatch = Stopwatch()..start();

  // 성능 테스트할 동작 수행
  for (int i = 0; i < 10; i++) {
    await tester.tap(find.byType(FloatingActionButton));
    await tester.pumpAndSettle();
  }

  stopwatch.stop();
  print('10회 탭 수행 시간: ${stopwatch.elapsedMilliseconds}ms');

  // 성능 기준 검증
  expect(stopwatch.elapsedMilliseconds, lessThan(2000)); // 2초 이내여야 함
});
```

### 3. 네트워크 요청 모킹

통합 테스트에서 실제 네트워크 요청을 모킹하려면, 앱을 실행하기 전에 `HttpOverrides`를 설정합니다:

```dart
import 'dart:io';

class MockHttpClient implements HttpClient {
  // HttpClient 메서드 구현...
}

class MockHttpOverrides extends HttpOverrides {
  @override
  HttpClient createHttpClient(SecurityContext? context) {
    return MockHttpClient();
  }
}

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    HttpOverrides.global = MockHttpOverrides();
  });

  testWidgets('네트워크 요청 모킹 테스트', (WidgetTester tester) async {
    app.main();
    await tester.pumpAndSettle();

    // 네트워크 요청이 포함된 동작 테스트
    await tester.tap(find.byType(ElevatedButton));
    await tester.pumpAndSettle();

    // 모킹된 응답에 따른 UI 상태 검증
    expect(find.text('모킹된 데이터'), findsOneWidget);
  });
}
```

### 4. 실제 사용자 흐름 테스트

실제 사용자 흐름을 시뮬레이션하는 종합적인 테스트를 작성할 수 있습니다:

```dart
testWidgets('사용자 로그인 및 데이터 조회 흐름', (WidgetTester tester) async {
  app.main();
  await tester.pumpAndSettle();

  // 로그인 화면에서 이메일 필드 찾기
  expect(find.byKey(const Key('email_field')), findsOneWidget);

  // 이메일 입력
  await tester.enterText(find.byKey(const Key('email_field')), 'test@example.com');
  await tester.pumpAndSettle();

  // 비밀번호 입력
  await tester.enterText(find.byKey(const Key('password_field')), 'password123');
  await tester.pumpAndSettle();

  // 로그인 버튼 탭
  await tester.tap(find.byKey(const Key('login_button')));
  await tester.pumpAndSettle();

  // 로그인 후 홈 화면으로 이동했는지 확인
  expect(find.text('홈 화면'), findsOneWidget);

  // 데이터 조회 버튼 탭
  await tester.tap(find.byKey(const Key('fetch_data_button')));
  await tester.pumpAndSettle();

  // 로딩 인디케이터 표시 확인
  expect(find.byType(CircularProgressIndicator), findsOneWidget);

  // 데이터 로딩 완료 대기 (최대 10초)
  await tester.pumpAndSettle(const Duration(seconds: 10));

  // 데이터가 정상적으로 표시되었는지 확인
  expect(find.byType(ListView), findsOneWidget);
  expect(find.byType(ListTile), findsWidgets);
});
```

## 테스트 실행 구조

통합 테스트가 실행되는 방식을 이해하면 디버깅에 도움이 됩니다:

## 통합 테스트 모범 사례

### 1. 주요 사용자 경로 테스트하기

모든 기능을 통합 테스트하는 것은 비효율적입니다. 대신, 다음과 같은 주요 사용자 경로(Critical User Paths)에 집중하세요:

- 사용자 등록 및 로그인
- 주요 데이터 조회 및 생성
- 결제 프로세스
- 앱의 핵심 기능

### 2. 테스트 분리 및 구성

복잡한 통합 테스트는 논리적인 단계로 분리하세요:

```dart
void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('사용자 계정 테스트', () {
    testWidgets('회원가입', signUpTest);
    testWidgets('로그인', loginTest);
    testWidgets('프로필 수정', editProfileTest);
  });

  group('콘텐츠 관리 테스트', () {
    testWidgets('콘텐츠 조회', viewContentTest);
    testWidgets('콘텐츠 생성', createContentTest);
    testWidgets('콘텐츠 편집', editContentTest);
  });
}

// 각 테스트 함수 구현
Future<void> signUpTest(WidgetTester tester) async {
  // 회원가입 테스트 로직
}

Future<void> loginTest(WidgetTester tester) async {
  // 로그인 테스트 로직
}

// 기타 테스트 함수...
```

### 3. 공통 기능 추출

여러 테스트에서 반복되는 로직은 헬퍼 함수로 추출하세요:

```dart
// 로그인 헬퍼 함수
Future<void> loginToApp(WidgetTester tester, {String email = 'test@example.com', String password = 'password123'}) async {
  await tester.enterText(find.byKey(const Key('email_field')), email);
  await tester.pumpAndSettle();

  await tester.enterText(find.byKey(const Key('password_field')), password);
  await tester.pumpAndSettle();

  await tester.tap(find.byKey(const Key('login_button')));
  await tester.pumpAndSettle();

  // 로그인 성공 확인
  expect(find.text('홈 화면'), findsOneWidget);
}

// 테스트에서 사용
testWidgets('데이터 조회 테스트', (WidgetTester tester) async {
  app.main();
  await tester.pumpAndSettle();

  // 로그인 헬퍼 함수 사용
  await loginToApp(tester);

  // 추가 테스트 로직...
});
```

### 4. 테스트 환경 설정

테스트별로 앱 상태를 초기화하여 테스트간 독립성을 유지하세요:

```dart
setUp(() async {
  // 선택적: 앱 상태 초기화 (예: SharedPreferences 초기화)
  SharedPreferences.setMockInitialValues({});

  // 선택적: 네트워크 요청 모킹
  HttpOverrides.global = MockHttpOverrides();
});

tearDown(() async {
  // 테스트 후 정리 작업
  HttpOverrides.global = null;
});
```

### 5. 테스트 안정성 개선

통합 테스트는 불안정할 수 있으므로, 테스트 안정성을 높이는 방법을 적용하세요:

```dart
// 요소가 나타날 때까지 기다리기
Future<void> waitForElement(WidgetTester tester, Finder finder, {Duration timeout = const Duration(seconds: 10)}) async {
  final end = DateTime.now().add(timeout);
  while (DateTime.now().isBefore(end)) {
    if (finder.evaluate().isNotEmpty) {
      return;
    }
    await tester.pump(const Duration(milliseconds: 100));
  }

  // 시간 초과시 오류
  throw TimeoutException('요소를 찾을 수 없습니다: $finder', timeout);
}

// 사용 예
testWidgets('비동기 데이터 로딩 테스트', (WidgetTester tester) async {
  app.main();
  await tester.pumpAndSettle();

  await tester.tap(find.byType(ElevatedButton));
  await tester.pump(); // 첫 프레임만 업데이트

  // 로딩 인디케이터 확인
  expect(find.byType(CircularProgressIndicator), findsOneWidget);

  // 데이터가 로드될 때까지 기다림
  await waitForElement(tester, find.byType(ListView));

  // 데이터 검증
  expect(find.byType(ListTile), findsWidgets);
});
```

## CI/CD 통합

통합 테스트를 CI/CD 파이프라인에 통합하면 코드 품질을 지속적으로 검증할 수 있습니다:

### GitHub Actions 예제

```yaml
name: Flutter Integration Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: "3.10.0"
          channel: "stable"

      - name: Install dependencies
        run: flutter pub get

      - name: Run integration tests
        run: flutter test integration_test/app_test.dart

      # 선택적: 실제 기기에서 테스트 (Android)
      - name: Build and run Android integration tests
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 29
          arch: x86_64
          profile: Nexus 6
          script: flutter test integration_test/app_test.dart -d `flutter devices | grep emulator | cut -d" " -f1`
```

## Codemagic 예제

```yaml
workflows:
  integration-test:
    name: Integration Tests
    instance_type: mac_mini_m1
    environment:
      flutter: stable
    scripts:
      - name: Get dependencies
        script: flutter pub get
      - name: Run integration tests on iOS Simulator
        script: |
          xcrun simctl create Flutter-iPhone com.apple.CoreSimulator.SimDeviceType.iPhone-11 com.apple.CoreSimulator.SimRuntime.iOS-14-4
          xcrun simctl boot Flutter-iPhone
          flutter test integration_test/app_test.dart -d Flutter-iPhone
```

## 결론

통합 테스트는 Flutter 앱의 최종 품질을 보장하는 데 중요한 단계입니다. 단위 테스트와 위젯 테스트가 앱의 개별 부분을 검증한다면, 통합 테스트는 전체 앱이 실제 사용자 시나리오에서 올바르게 작동하는지 확인합니다.

통합 테스트는 시간과 리소스가 많이 소요되므로, 모든 기능을 테스트하기보다는 주요 사용자 경로와 비즈니스 크리티컬한 기능에 집중하는 것이 좋습니다. 테스트를 구조화하고 공통 기능을 추출하여 유지보수성을 높이세요.

다음 장에서는 테스팅 도구에 대해 더 자세히 알아보겠습니다. Mockito, golden test, coverage 등의 도구를 활용하여 Flutter 앱 테스트를 더욱 효과적으로 수행하는 방법을 살펴볼 것입니다.
