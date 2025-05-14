# Dart 소개

## Dart란 무엇인가?

Dart는 Google에서 개발한 클라이언트 최적화 프로그래밍 언어로, 모든 플랫폼에서 빠르고 안정적인 애플리케이션을 개발하기 위해 설계되었습니다. Dart는 Flutter 프레임워크의 기반이 되는 언어이며, 웹, 모바일, 데스크톱 애플리케이션을 개발하는 데 사용됩니다.

## Dart의 역사

- **2011년**: Google I/O에서 처음 발표
- **2013년**: Dart 1.0 출시
- **2018년**: Dart 2.0 출시 (타입 안전성 강화)
- **2021년**: Dart 2.13 출시 (null 안전성 도입)
- **2023년**: Dart 3.0 출시 (레코드, 패턴 매칭 도입)

Dart는 초기에 JavaScript를 대체하기 위한 웹 프로그래밍 언어로 시작했지만, 현재는 Flutter를 통한 크로스 플랫폼 애플리케이션 개발에 주로 사용됩니다.

## Dart의 주요 특징

### 1. 객체 지향 언어

Dart는 클래스 기반의 객체 지향 언어입니다. 모든 것이 객체이며, 모든 객체는 클래스의 인스턴스입니다. 심지어 함수와 `null`도 객체입니다.

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void introduce() {
    print('안녕하세요, 저는 $name이고 $age살입니다.');
  }
}

void main() {
  final person = Person('홍길동', 30);
  person.introduce();  // 출력: 안녕하세요, 저는 홍길동이고 30살입니다.
}
```

### 2. 강력한 타입 시스템

Dart는 정적 타입 언어이지만, 타입 추론을 지원하여 타입 명시를 생략할 수 있습니다.

```dart
// 타입 명시
String name = '홍길동';
int age = 30;

// 타입 추론
var name = '홍길동';    // String으로 추론
var age = 30;         // int로 추론
final height = 175.5;  // double로 추론
```

### 3. 비동기 프로그래밍 지원

Dart는 `Future`, `Stream`, `async`, `await` 등을 통해 비동기 프로그래밍을 자연스럽게 지원합니다.

```dart
Future<String> fetchData() async {
  // 비동기 작업 시뮬레이션
  await Future.delayed(Duration(seconds: 2));
  return '데이터';
}

void main() async {
  print('데이터 요청 시작');
  final data = await fetchData();
  print('받은 데이터: $data');
}
```

### 4. Null 안전성

Dart 2.12부터 Null 안전성을 도입하여, 변수가 null이 될 수 있는지 여부를 타입 시스템에서 명시합니다.

```dart
// null이 될 수 없는 변수
String name = '홍길동';
// name = null;  // 컴파일 오류

// null이 될 수 있는 변수
String? nullableName = '홍길동';
nullableName = null;  // 허용됨
```

### 5. 다중 플랫폼 지원

Dart는 여러 플랫폼에서 실행될 수 있습니다:

- **네이티브 플랫폼**: Dart는 AoT(Ahead-of-Time) 컴파일을 통해 네이티브 바이너리로 컴파일됩니다. Flutter 앱은 이 방식으로 배포됩니다.
- **웹 플랫폼**: Dart는 JavaScript로 컴파일되어 브라우저에서 실행됩니다.
- **개발 환경**: Dart는 JIT(Just-in-Time) 컴파일을 통해 개발 중 핫 리로드와 같은 기능을 제공합니다.

### 6. 풍부한 표준 라이브러리

Dart는 다양한 기능을 제공하는 풍부한 표준 라이브러리를 포함하고 있습니다:

- 컬렉션 (`List`, `Map`, `Set` 등)
- 비동기 처리 (`Future`, `Stream`)
- 파일 I/O
- HTTP 클라이언트
- 정규 표현식
- 직렬화 지원

## Dart 실행 환경

Dart 코드는 다양한 환경에서 실행될 수 있습니다:

### 1. Dart VM

Dart Virtual Machine(VM)은 Dart 코드를 직접 실행하는 환경으로, 개발 중 코드를 빠르게 실행하고 디버깅할 수 있습니다.

```bash
dart run main.dart
```

### 2. Flutter

Flutter는 Dart를 사용하여 크로스 플랫폼 모바일 애플리케이션을 개발하는 프레임워크입니다.

```bash
flutter run
```

### 3. Web (Dart2JS)

Dart 코드는 JavaScript로 컴파일되어 웹 브라우저에서 실행될 수 있습니다.

```bash
dart compile js main.dart -o main.js
```

### 4. Native (Native AOT)

Dart 코드는 네이티브 바이너리로 컴파일되어 독립 실행 파일로 배포될 수 있습니다.

```bash
dart compile exe main.dart -o main
```

## Dart 패키지 생태계

Dart는 `pub.dev`라는 공식 패키지 저장소를 통해 풍부한 패키지 생태계를 제공합니다. 이 저장소에는 다양한 기능을 제공하는 수천 개의 오픈 소스 패키지가 있습니다.

패키지를 프로젝트에 추가하려면 `pubspec.yaml` 파일에 의존성을 추가합니다:

```yaml
dependencies:
  http: ^1.0.0
  path: ^1.8.0
```

그리고 다음 명령으로 패키지를 설치합니다:

```bash
dart pub get
```

## Dart와 다른 언어 비교

### Java와 비교

```dart
// Dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void sayHello() {
    print('Hello, I am $name');
  }
}

// Java
public class Person {
  private String name;
  private int age;

  public Person(String name, int age) {
    this.name = name;
    this.age = age;
  }

  public void sayHello() {
    System.out.println("Hello, I am " + name);
  }
}
```

### JavaScript와 비교

```dart
// Dart
void main() {
  final list = [1, 2, 3, 4, 5];
  final doubled = list.map((item) => item * 2).toList();
  print(doubled);  // [2, 4, 6, 8, 10]
}

// JavaScript
function main() {
  const list = [1, 2, 3, 4, 5];
  const doubled = list.map(item => item * 2);
  console.log(doubled);  // [2, 4, 6, 8, 10]
}
```

### Swift와 비교

```dart
// Dart
class Person {
  String name;
  int? age;

  Person(this.name, {this.age});
}

// Swift
class Person {
  let name: String
  var age: Int?

  init(name: String, age: Int? = nil) {
    self.name = name
    self.age = age
  }
}
```

## Dart의 장점

1. **통합 개발 환경**: 단일 언어로 모바일, 웹, 데스크톱 앱을 개발할 수 있습니다.
2. **생산성**: 핫 리로드, 풍부한 도구, 직관적인 문법으로 개발 생산성을 높입니다.
3. **성능**: AoT 컴파일을 통해 네이티브 성능에 가까운 실행 속도를 제공합니다.
4. **안정성**: 강력한 타입 시스템과 null 안전성으로 많은 런타임 오류를 방지합니다.
5. **확장성**: 표준 라이브러리와 풍부한 패키지 생태계를 통해 다양한 기능을 추가할 수 있습니다.

## Dart 개발 환경 설정

### VS Code에서 Dart 개발 환경 설정

1. Dart SDK 설치 (Flutter SDK를 설치했다면 이미 포함되어 있습니다)
2. VS Code 설치
3. Dart 확장 프로그램 설치
4. 새 Dart 프로젝트 생성:
   ```bash
   dart create my_dart_project
   ```
5. VS Code에서 프로젝트 열기
6. `main.dart` 파일 실행하기: F5 또는 "Run" 버튼 클릭

## 결론

Dart는 현대적인 애플리케이션 개발을 위한 강력하고 유연한 프로그래밍 언어입니다. 특히 Flutter와 함께 사용하면, 단일 코드베이스로 고품질의 크로스 플랫폼 애플리케이션을 개발할 수 있습니다.

다음 장에서는 Dart의 기본 문법과 변수에 대해 더 자세히 알아보겠습니다.
