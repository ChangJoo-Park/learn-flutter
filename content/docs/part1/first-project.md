# 첫 프로젝트 생성 및 실행

이제 Flutter SDK와 개발 환경이 설정되었으므로, 첫 번째 Flutter 프로젝트를 생성하고 실행해 보겠습니다.

## 프로젝트 생성하기

Flutter 프로젝트는 다양한 방법으로 생성할 수 있습니다. 터미널을 사용하거나 Visual Studio Code 또는 Android Studio와 같은 IDE를 사용할 수 있습니다.

### 터미널을 이용한 생성

1. 터미널을 열고 프로젝트를 생성할 디렉토리로 이동합니다.
2. 다음 명령어를 실행하여 새 Flutter 프로젝트를 생성합니다:

```bash
flutter create my_first_app
```

이 명령어는 `my_first_app`이라는 이름의 새 Flutter 프로젝트를 생성합니다.

3. 프로젝트 디렉토리로 이동합니다:

```bash
cd my_first_app
```

### VS Code를 이용한 생성

1. Visual Studio Code를 실행합니다.
2. Command Palette(`Ctrl+Shift+P` 또는 `Cmd+Shift+P`)를 열고 "Flutter: New Project"를 입력하고 선택합니다.
3. 프로젝트 이름을 입력합니다 (예: "my_first_app").
4. 프로젝트를 저장할 디렉토리를 선택합니다.
5. VS Code가 자동으로 새 Flutter 프로젝트를 생성합니다.

### Android Studio를 이용한 생성

1. Android Studio를 실행합니다.
2. "Create New Flutter Project"를 선택합니다.
3. "Flutter Application"을 선택하고 "Next"를 클릭합니다.
4. 프로젝트 이름과 저장 위치, Flutter SDK 경로를 지정하고 "Next"를 클릭합니다.
5. 추가 정보를 입력하고 "Finish"를 클릭합니다.

## 프로젝트 구조 탐색

Flutter 프로젝트가 생성되면, 다음과 같은 기본 파일 구조가 만들어집니다:

```
my_first_app/
├── .dart_tool/        # Dart 도구 관련 파일
├── .idea/             # IDE 설정 (Android Studio)
├── android/           # 안드로이드 특화 코드
├── build/             # 빌드 출력 파일
├── ios/               # iOS 특화 코드
├── lib/               # Dart 코드
│   └── main.dart      # 앱의 진입점
├── linux/             # Linux 특화 코드
├── macos/             # macOS 특화 코드
├── test/              # 테스트 코드
├── web/               # 웹 특화 코드
├── windows/           # Windows 특화 코드
├── .gitignore         # Git 무시 파일
├── .metadata          # Flutter 메타데이터
├── analysis_options.yaml # Dart 분석 설정
├── pubspec.lock       # 의존성 버전 잠금 파일
├── pubspec.yaml       # 프로젝트 설정 및 의존성
└── README.md          # 프로젝트 설명
```

이 중에서 가장 중요한 파일은 다음과 같습니다:

- **lib/main.dart**: 앱의 메인 코드가 위치한 파일입니다.
- **pubspec.yaml**: 앱의 메타데이터와 의존성을 정의하는 파일입니다.
- **android/**, **ios/**: 플랫폼별 설정이 포함된 디렉토리입니다.

## 기본 앱 코드 이해하기

기본적으로 생성된 `lib/main.dart` 파일을 살펴보겠습니다. 이 파일은 간단한 카운터 앱을 구현하고 있습니다:

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
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              'You have pushed the button this many times:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: 'Increment',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

이 코드의 주요 구성 요소를 간략하게 설명하면:

1. **main() 함수**: 앱의 진입점으로, `runApp()`을 호출하여 앱을 시작합니다.
2. **MyApp 클래스**: 앱의 전체적인 테마와 구조를 정의하는 StatelessWidget입니다.
3. **MyHomePage 클래스**: 앱의 홈 화면을 정의하는 StatefulWidget입니다.
4. **\_MyHomePageState 클래스**: 홈 화면의 상태를 관리하는 State 클래스입니다.

## 앱 실행하기

이제 생성된 Flutter 앱을 실행해 보겠습니다.

### 터미널에서 실행

프로젝트 디렉토리에서 다음 명령어를 실행합니다:

```bash
flutter run
```

이 명령어는 연결된 기기나 에뮬레이터에서 앱을 실행합니다. 여러 기기가 연결되어 있다면, 실행할 기기를 선택하라는 메시지가 표시됩니다.

특정 기기에서 실행하려면 다음과 같이 명령할 수 있습니다:

```bash
flutter run -d <device_id>
```

기기 ID는 `flutter devices` 명령어로 확인할 수 있습니다.

### VS Code에서 실행

1. VS Code에서 프로젝트를 엽니다.
2. 하단 상태 표시줄에서 기기 선택기를 클릭하여 실행할 기기를 선택합니다.
3. F5 키를 누르거나 "Run > Start Debugging"을 선택합니다.

### Android Studio에서 실행

1. Android Studio에서 프로젝트를 엽니다.
2. 상단 도구 모음에서 기기 선택기를 사용하여 실행할 기기를 선택합니다.
3. 실행 버튼(▶)을 클릭합니다.

## 앱 수정하기

이제 앱을 조금 수정해 보겠습니다. `lib/main.dart` 파일을 열고 다음과 같이 변경해 보세요:

1. 앱 제목 변경:

```dart
return MaterialApp(
  title: '내 첫 번째 Flutter 앱',
  // ...
```

2. 홈 화면 타이틀 변경:

```dart
home: const MyHomePage(title: '내 첫 번째 Flutter 앱'),
```

3. 카운터 텍스트 변경:

```dart
const Text(
  '버튼을 눌러 카운터를 증가시키세요:',
),
```

## 핫 리로드 사용하기

Flutter의 가장 강력한 기능 중 하나는 핫 리로드입니다. 이는 앱을 다시 시작하지 않고도 코드 변경 사항을 즉시 확인할 수 있게 해줍니다.

1. 앱이 실행 중인 상태에서 코드를 수정합니다.
2. 변경 사항을 저장합니다.
3. VS Code 또는 Android Studio에서는 자동으로 핫 리로드가 실행됩니다.
4. 터미널에서 실행 중인 경우, `r` 키를 눌러 핫 리로드를 실행합니다.

핫 리로드는 상태를 유지하므로, 예를 들어 카운터 값은 리셋되지 않습니다.

## 핫 리스타트 사용하기

때로는 변경 사항이 핫 리로드로 적용되지 않을 수 있습니다. 이런 경우 핫 리스타트를 사용할 수 있습니다:

1. VS Code 또는 Android Studio에서 핫 리스타트 버튼을 클릭합니다.
2. 터미널에서 실행 중인 경우, `R` 키(대문자)를 눌러 핫 리스타트를 실행합니다.

핫 리스타트는 앱을 다시 시작하지만, 컴파일 과정은 건너뛰므로 일반적인 재시작보다 빠릅니다.

## 더 많은 기기에서 실행하기

Flutter 앱은 다양한 플랫폼에서 실행할 수 있습니다.

### 웹에서 실행하기

웹 버전을 실행하려면 다음 명령어를 사용합니다:

```bash
flutter run -d chrome
```

또는 VS Code와 Android Studio에서 Chrome을 기기로 선택할 수 있습니다.

### 데스크톱에서 실행하기

데스크톱 버전을 실행하려면 다음 명령어를 사용합니다:

```bash
# Windows
flutter run -d windows

# macOS
flutter run -d macos

# Linux
flutter run -d linux
```

## 릴리즈 모드로 실행하기

기본적으로 `flutter run` 명령어는 디버그 모드로 앱을 실행합니다. 릴리즈 모드로 실행하려면 다음 명령어를 사용합니다:

```bash
flutter run --release
```

릴리즈 모드는 디버그 정보가 제거되고 성능이 최적화된 버전입니다.

## 앱 빌드하기

개발이 완료된 앱을 배포 가능한 형태로 빌드하려면 다음 명령어를 사용합니다:

```bash
# Android APK
flutter build apk

# Android App Bundle
flutter build appbundle

# iOS
flutter build ios

# 웹
flutter build web

# Windows
flutter build windows

# macOS
flutter build macos

# Linux
flutter build linux
```

## 결론

축하합니다! 첫 번째 Flutter 앱을 성공적으로 생성하고 실행했습니다. 이 기본 앱을 출발점으로 삼아, Flutter의 다양한 위젯과 기능을 탐색하며 더 복잡한 앱을 개발할 수 있습니다.

다음 섹션에서는 Flutter 프로젝트의 구조를 더 자세히 살펴보고, 앱 개발에 필요한 주요 개념들을 배워보겠습니다.
