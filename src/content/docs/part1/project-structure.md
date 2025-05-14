# Flutter 프로젝트 구조 이해

Flutter 프로젝트는 여러 디렉토리와 파일로 구성되어 있으며, 각각은 프로젝트의 특정 측면을 담당합니다. 이 구조를 이해하면 Flutter 앱을 더 효율적으로 개발하고 관리할 수 있습니다.

## Flutter 프로젝트의 기본 구조

기본적인 Flutter 프로젝트 구조는 다음과 같습니다:

```
my_flutter_app/
├── .dart_tool/
├── .idea/
├── android/
├── build/
├── ios/
├── lib/
├── linux/
├── macos/
├── test/
├── web/
├── windows/
├── .gitignore
├── .metadata
├── analysis_options.yaml
├── pubspec.lock
├── pubspec.yaml
└── README.md
```

이제 각 디렉토리와 파일의 역할을 자세히 살펴보겠습니다.

## 주요 디렉토리

### lib/ 디렉토리

`lib/` 디렉토리는 Flutter 프로젝트의 핵심으로, 앱의 Dart 소스 코드가 저장되는 위치입니다.

```
lib/
├── main.dart       # 앱의 진입점
├── models/         # 데이터 모델
├── screens/        # 화면 UI
├── widgets/        # 재사용 가능한 위젯
├── services/       # 비즈니스 로직, API 호출 등
└── utils/          # 유틸리티 기능
```

**중요: 기본적으로 생성되는 것은 `main.dart` 파일뿐이며, 나머지 폴더 구조는 개발자가 필요에 따라 생성하고 구성합니다.**

#### main.dart

`main.dart` 파일은 앱의 진입점으로, `main()` 함수와 루트 위젯을 포함합니다:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}
```

### test/ 디렉토리

`test/` 디렉토리는 앱의 자동화된 테스트 코드를 포함합니다. 단위 테스트, 위젯 테스트 등을 이 디렉토리에 작성합니다.

```
test/
├── widget_test.dart          # 위젯 테스트
└── unit/
    └── models_test.dart      # 단위 테스트
```

기본적으로 생성되는 `widget_test.dart` 파일은 앱의 메인 위젯을 테스트하는 간단한 예제를 포함합니다:

```dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:my_flutter_app/main.dart';

void main() {
  testWidgets('Counter increments smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const MyApp());
    expect(find.text('0'), findsOneWidget);
    expect(find.text('1'), findsNothing);
    await tester.tap(find.byIcon(Icons.add));
    await tester.pump();
    expect(find.text('0'), findsNothing);
    expect(find.text('1'), findsOneWidget);
  });
}
```

### android/ 디렉토리

`android/` 디렉토리는 Android 플랫폼 관련 코드와 설정을 포함합니다.

```
android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── AndroidManifest.xml      # 앱 선언 및 권한
│   │   │   ├── kotlin/                  # Kotlin 소스 코드
│   │   │   └── res/                     # 리소스 (아이콘, 문자열 등)
│   │   └── profile/
│   ├── build.gradle                    # 앱 수준 빌드 설정
│   └── ...
├── build.gradle                        # 프로젝트 수준 빌드 설정
├── gradle/
├── gradle.properties
└── ...
```

특히 중요한 파일들:

- **AndroidManifest.xml**: 앱의 이름, 아이콘, 필요한 권한 등을 정의합니다.
- **build.gradle**: 앱의 버전, 의존성, 빌드 설정 등을 구성합니다.

### ios/ 디렉토리

`ios/` 디렉토리는 iOS 플랫폼 관련 코드와 설정을 포함합니다.

```
ios/
├── Runner/
│   ├── AppDelegate.swift               # iOS 앱 진입점
│   ├── Info.plist                      # 앱 구성 및 권한
│   ├── Assets.xcassets/                # 이미지 에셋
│   └── ...
├── Runner.xcodeproj/                   # Xcode 프로젝트 파일
└── ...
```

특히 중요한 파일들:

- **Info.plist**: 앱 이름, 버전, 권한 등의 메타데이터를 포함합니다.
- **AppDelegate.swift**: iOS 앱의 진입점 및 초기화 로직을 포함합니다.

### web/, macos/, linux/, windows/ 디렉토리

이 디렉토리들은 각각 웹, macOS, 리눅스, 윈도우 플랫폼을 위한 코드와 설정을 포함합니다. 구조는 플랫폼마다 다르지만, 모두 해당 플랫폼의 네이티브 코드와 구성을 담고 있습니다.

## 주요 설정 파일

### pubspec.yaml

`pubspec.yaml`은 Flutter 프로젝트의 핵심 설정 파일로, 앱의 메타데이터, 의존성, 에셋 등을 정의합니다:

```yaml
name: my_flutter_app
description: A new Flutter project.

# The following defines the version and build number for your application.
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

# Dependencies
dependencies:
  flutter:
    sdk: flutter
  http: ^1.0.0
  shared_preferences: ^2.1.1

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^2.0.0

# Flutter-specific configurations
flutter:
  uses-material-design: true

  # Assets
  assets:
    - assets/images/
    - assets/fonts/

  # Fonts
  fonts:
    - family: Roboto
      fonts:
        - asset: assets/fonts/Roboto-Regular.ttf
        - asset: assets/fonts/Roboto-Bold.ttf
          weight: 700
```

주요 항목들:

- **name**: 앱의 패키지 이름
- **version**: 앱의 버전(`버전 코드+빌드 번호` 형식)
- **dependencies**: 앱이 사용하는 패키지 의존성
- **dev_dependencies**: 개발 시에만 필요한 패키지 의존성
- **flutter**: Flutter 특화 설정 (에셋, 폰트, 테마 등)

### analysis_options.yaml

`analysis_options.yaml`은 Dart 코드 분석기의 설정을 정의하여 코드 품질과 일관성을 유지하는 데 도움을 줍니다:

```yaml
include: package:flutter_lints/flutter.yaml

linter:
  rules:
    - avoid_print
    - avoid_empty_else
    - prefer_const_constructors
    - sort_child_properties_last

analyzer:
  errors:
    missing_required_param: error
    missing_return: error
```

### .gitignore

`.gitignore` 파일은 Git 버전 관리 시스템에서 무시해야 할 파일들을 지정합니다. Flutter 프로젝트에서는 빌드 결과물, 임시 파일, IDE 파일 등이 여기에 포함됩니다.

## 추가 디렉토리와 파일 (선택적)

개발자들은 프로젝트의 규모와 복잡성에 따라 추가 디렉토리를 생성할 수 있습니다:

### assets/ 디렉토리

```
assets/
├── images/       # 이미지 파일
├── fonts/        # 폰트 파일
└── data/         # JSON, CSV 등의 데이터 파일
```

이 디렉토리는 `pubspec.yaml`에 명시적으로 등록해야 합니다:

```yaml
flutter:
  assets:
    - assets/images/
    - assets/fonts/
    - assets/data/
```

### l10n/ 또는 i18n/ 디렉토리

다국어 지원을 위한 디렉토리:

```
l10n/
├── app_en.arb   # 영어 번역
├── app_ko.arb   # 한국어 번역
└── app_ja.arb   # 일본어 번역
```

## 프로젝트 구조화 패턴

Flutter 앱의 구조는 프로젝트의 성격과 팀의 선호도에 따라 달라질 수 있습니다. 일반적으로 많이 사용되는 패턴은 다음과 같습니다:

### 기능별 구조 (Feature-First)

앱의 기능별로 디렉토리를 구성하는 방식:

```
lib/
├── main.dart
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   ├── widgets/
│   │   ├── models/
│   │   └── services/
│   ├── home/
│   ├── profile/
│   └── settings/
└── shared/
    ├── widgets/
    ├── utils/
    └── constants/
```

이 구조는 기능이 많은 대규모 앱에 적합합니다.

### 계층별 구조 (Layer-First)

앱의 아키텍처 계층별로 디렉토리를 구성하는 방식:

```
lib/
├── main.dart
├── screens/       # 모든 화면 UI
├── widgets/       # 모든 재사용 위젯
├── models/        # 모든 데이터 모델
├── services/      # 모든 서비스 로직
├── repositories/  # 데이터 액세스 로직
└── utils/         # 유틸리티 함수
```

이 구조는 작거나 중간 규모의 앱에 적합합니다.

### MVVM 또는 Clean Architecture

보다 체계적인 아키텍처 패턴을 적용한 구조:

```
lib/
├── main.dart
├── ui/
│   ├── screens/
│   └── widgets/
├── viewmodels/
├── models/
├── services/
├── repositories/
└── core/
    ├── utils/
    └── constants/
```

이 구조는 코드의 유지 관리성과 테스트 가능성을 높이는 데 도움이 됩니다.

## 모범 사례 및 권장 사항

### 1. 명확한 명명 규칙

- 파일 이름: `snake_case.dart` (예: `user_profile.dart`)
- 클래스 이름: `PascalCase` (예: `UserProfile`)
- 변수 및 함수 이름: `camelCase` (예: `userName`, `getUserInfo()`)

### 2. 프로젝트 구조 일관성 유지

- 처음부터 명확한 구조 계획 수립
- 프로젝트 전체에 동일한 규칙 적용
- 팀 내 구조 합의 및 문서화

### 3. 관련 코드 그룹화

- 관련된 코드는 함께 위치
- 너무 깊은 중첩 디렉토리 피하기 (일반적으로 3-4 수준 이내)
- 디렉토리 이름은 내용을 명확히 반영

### 4. 불필요한 분할 피하기

- 파일이 너무 많아지면 관리가 어려울 수 있음
- 단일 위젯이나 작은 기능을 여러 파일로 나누지 않기
- 너무 큰 파일도 피하기 (일반적으로 300-500줄 이내)

## 기타 고려 사항

### 환경 구성

다양한 환경(개발, 스테이징, 프로덕션)에 대한 구성을 지원하기 위해 다음과 같은 접근 방식을 사용할 수 있습니다:

```
lib/
├── main.dart             # 공통 진입점
├── main_dev.dart         # 개발 환경 진입점
├── main_staging.dart     # 스테이징 환경 진입점
├── main_prod.dart        # 프로덕션 환경 진입점
└── config/
    ├── app_config.dart   # 환경 설정 클래스
    ├── dev_config.dart
    ├── staging_config.dart
    └── prod_config.dart
```

### 라우팅 구성

앱의 화면 전환을 관리하기 위한 라우팅 구성:

```
lib/
├── router/
│   ├── app_router.dart   # 라우터 설정
│   └── routes.dart       # 라우트 상수
```

### 상태 관리

선택한 상태 관리 솔루션에 따라 구조가 달라질 수 있습니다:

```
lib/
├── providers/          # Riverpod/Provider
├── blocs/              # Flutter_bloc
├── stores/             # MobX
└── state/              # 기타 상태 관리
```

## 결론

Flutter 프로젝트 구조는 규모와 복잡성에 따라 다양하게 적용할 수 있습니다. 중요한 것은 팀이 이해하기 쉽고 유지 관리가 용이한 일관된 구조를 선택하는 것입니다. 프로젝트가 성장함에 따라 구조도 진화할 수 있으므로, 리팩토링과 개선에 열린 자세를 유지하는 것이 좋습니다.

이제 Flutter 개발 환경 설정과 프로젝트 구조에 대한 이해를 바탕으로, 다음 챕터에서 Dart 언어 기초를 배워보겠습니다.
