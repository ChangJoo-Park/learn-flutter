---
title: 개발 환경 구성
banner:
  content: |
    안녕하세요! 이 페이지를 보시는 분들에게 설문을 받고 있습니다.
    <a href="https://tally.so/r/w559Vv" target="_blank">여기를 눌러서 참여부탁드려요!</a>
---

Flutter 개발을 시작하기 위해 필요한 환경을 구성해 보겠습니다. 이 과정에는 Flutter SDK 설치, 코드 에디터 설정, 그리고 개발 도구 구성이 포함됩니다.

### 여러 버전을 사용하고 싶을 때

가이드에 있는 공식적인 방법도 좋지만 여러 버전을 사용하고 싶을 때는 [Flutter Version Manager](https://fvm.app) 또는 [mise](https://mise.jdx.dev)를 사용하세요. Flutter의 최신 버전 업데이트 이후에 바로 사용하는 경우 패키지가 호환이 안되는 경우가 있어 버전을 유지하는데 어려움을 겪을 수 있습니다.

저는 mise를 조금 더 추천 드립니다. Flutter Version Manager와 달리 Flutter 외에 앱 개발에 필요한 Ruby, Node.js 등의 버전도 관리할 수 있습니다.

## Flutter SDK 설치

### Windows에서 설치

1. [Flutter 공식 사이트](https://flutter.dev/docs/get-started/install/windows)에서 Flutter SDK를 다운로드합니다.
2. 다운로드한 zip 파일을 원하는 위치에 압축 해제합니다 (예: `C:\dev\flutter`).
3. 환경 변수 설정:
   - 시스템 환경 변수에서 `Path` 변수에 Flutter SDK의 `bin` 폴더 경로를 추가합니다.
   - 예: `C:\dev\flutter\bin`
4. 명령 프롬프트를 열고 다음 명령어를 실행하여 설치를 확인합니다:
   ```bash
   flutter doctor
   ```

### macOS에서 설치

1. **Homebrew를 이용한 설치** (권장):

   ```bash
   brew install --cask flutter
   ```

2. **수동 설치**:
   - [Flutter 공식 사이트](https://flutter.dev/docs/get-started/install/macos)에서 Flutter SDK를 다운로드합니다.
   - 다운로드한 zip 파일을 원하는 위치에 압축 해제합니다 (예: `~/development/flutter`).
   - 환경 변수 설정: `.zshrc` 또는 `.bash_profile` 파일에 다음 내용을 추가합니다:
     ```bash
     export PATH="$PATH:~/development/flutter/bin"
     ```
   - 터미널을 열고 다음 명령어를 실행하여 설치를 확인합니다:
     ```bash
     flutter doctor
     ```

### Linux에서 설치

1. [Flutter 공식 사이트](https://flutter.dev/docs/get-started/install/linux)에서 Flutter SDK를 다운로드합니다.
2. 다운로드한 tar.xz 파일을 원하는 위치에 압축 해제합니다:
   ```bash
   tar xf flutter_linux_<version>-stable.tar.xz -C ~/development
   ```
3. 환경 변수 설정: `.bashrc` 또는 `.zshrc` 파일에 다음 내용을 추가합니다:
   ```bash
   export PATH="$PATH:~/development/flutter/bin"
   ```
4. 터미널을 열고 다음 명령어를 실행하여 설치를 확인합니다:
   ```bash
   flutter doctor
   ```

## Visual Studio Code 설정

Visual Studio Code는 Flutter 개발을 위한 권장 에디터입니다.

### VS Code 설치

1. [Visual Studio Code 공식 사이트](https://code.visualstudio.com/)에서 에디터를 다운로드하고 설치합니다.
2. VS Code를 실행합니다.

### Flutter와 Dart 플러그인 설치

1. VS Code의 Extensions 탭(`Ctrl+Shift+X` 또는 `Cmd+Shift+X`)을 엽니다.
2. "Flutter"를 검색하고 Flutter 확장 프로그램을 설치합니다 (Dart 확장 프로그램도 자동으로 설치됩니다).
3. VS Code를 재시작합니다.

### Dart DevTools 설정

Dart DevTools는 Flutter 앱 디버깅에 유용한 도구입니다.

1. VS Code에서 Command Palette(`Ctrl+Shift+P` 또는 `Cmd+Shift+P`)를 엽니다.
2. "Flutter: Open DevTools"를 입력하고 선택합니다.
3. 브라우저에서 DevTools가 열립니다.

## 에뮬레이터 / 실기기 연결

### Android 에뮬레이터 설정

1. [Android Studio](https://developer.android.com/studio)를 다운로드하고 설치합니다.
2. Android Studio를 실행하고 "SDK Manager"를 엽니다.
3. "SDK Tools" 탭에서 "Android SDK Build-Tools", "Android SDK Command-line Tools", "Android Emulator", "Android SDK Platform-Tools"를 설치합니다.
4. "AVD Manager"를 열고 "Create Virtual Device"를 클릭합니다.
5. 원하는 디바이스를 선택하고 시스템 이미지를 다운로드한 후 에뮬레이터를 생성합니다.
6. 에뮬레이터를 실행합니다.

### iOS 시뮬레이터 설정 (macOS만 해당)

1. App Store에서 Xcode를 설치합니다.
2. Xcode를 실행하고 필요한 구성 요소를 설치합니다.
3. 터미널에서 다음 명령어를 실행하여, Flutter와 Xcode 간의 라이센스 동의를 진행합니다:
   ```bash
   sudo xcodebuild -license
   ```
4. iOS 시뮬레이터를 실행합니다:
   ```bash
   open -a Simulator
   ```

### 실제 안드로이드 기기 연결

1. 안드로이드 디바이스의 설정에서 "개발자 옵션"을 활성화합니다:
   - 설정 > 휴대폰 정보 > 소프트웨어 정보 > 빌드 번호를 7번 탭합니다.
2. 개발자 옵션에서 "USB 디버깅"을 활성화합니다.
3. USB 케이블로 디바이스를 컴퓨터에 연결합니다.
4. 디바이스에 표시되는 USB 디버깅 권한 요청을 수락합니다.
5. 터미널에서 다음 명령어로 연결된 디바이스를 확인합니다:
   ```bash
   flutter devices
   ```

### 실제 iOS 기기 연결 (macOS만 해당)

1. Apple Developer 계정이 필요합니다.
2. Xcode를 열고 "Preferences > Accounts"에서 Apple ID를 추가합니다.
3. USB 케이블로 iOS 기기를 Mac에 연결합니다.
4. Xcode에서 프로젝트를 열고 디바이스를 선택한 후 "Trust"를 선택합니다.
5. 터미널에서 다음 명령어로 연결된 디바이스를 확인합니다:
   ```bash
   flutter devices
   ```

## Flutter Doctor로 확인하기

설치 과정이 완료되면 다음 명령어를 실행하여 환경 설정이 올바르게 되었는지 확인합니다:

```bash
flutter doctor -v
```

이 명령어는 Flutter SDK, Android toolchain, iOS toolchain (macOS만 해당), VS Code 등의 설치 상태를 확인하고, 문제가 있다면 해결 방법을 제안합니다.

## 추가 설정 (선택사항)

### Git 설정

Flutter 프로젝트는 Git을 이용한 버전 관리를 권장합니다:

1. [Git 공식 사이트](https://git-scm.com/)에서 Git을 다운로드하고 설치합니다.
2. 터미널 또는 명령 프롬프트에서 Git 설정을 구성합니다:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### 추가 권장 VS Code 확장 프로그램

- **Awesome Flutter Snippets**: 유용한 Flutter 코드 스니펫 제공
- **Flutter Widget Snippets**: 위젯 코드 생성 지원
- **Pubspec Assist**: 의존성 관리 도우미
- **Error Lens**: 인라인 오류 하이라이팅
- **Git Lens**: Git 통합 향상

## 문제 해결

### "flutter: command not found" 오류

환경 변수가 올바르게 설정되지 않았을 수 있습니다. 시스템의 PATH 변수에 Flutter bin 디렉토리가 포함되어 있는지 확인하세요.

### Android Studio 설치 문제

안드로이드 설정에 문제가 있을 경우:

```bash
flutter doctor --android-licenses
```

명령어를 실행하여 Android 라이센스를 동의합니다.

### 에뮬레이터 성능 문제

Windows와 Linux 사용자는 BIOS에서 가상화 기술(Intel VT-x 또는 AMD-V)이 활성화되어 있는지 확인하세요.

## 결론

이제 Flutter 개발을 위한 환경 설정이 완료되었습니다. 다음 섹션에서는 첫 번째 Flutter 프로젝트를 생성하고 실행하는 방법을 알아보겠습니다.
