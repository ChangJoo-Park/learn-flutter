---
title: Extension / Mixin
---

Dart는 코드 재사용과 확장성을 위한 다양한 방법을 제공합니다. 이 장에서는 두 가지 강력한 기능인 Extension과 Mixin에 대해 알아보겠습니다. 이 두 기능은 기존 클래스를 수정하지 않고도 기능을 확장하거나 여러 클래스 간에 코드를 효율적으로 공유할 수 있게 해줍니다.

## Extension(확장)

Extension은 기존 클래스(심지어 라이브러리 클래스나 외부 라이브러리의 클래스)에 새로운 기능을 추가할 수 있는 방법입니다. 원본 클래스의 소스 코드를 수정하거나 상속할 필요 없이 새로운 메서드, 프로퍼티, 연산자를 추가할 수 있습니다.

### 기본 구문

```dart
extension <확장명> on <대상 타입> {
  // 메서드, 게터, 세터, 연산자 등 추가
}
```

확장명은 선택 사항이지만, 확장을 명시적으로 가져오거나 충돌을 해결할 때 유용합니다.

### 예제: String 확장

```dart
// String 클래스에 기능 추가
extension StringExtension on String {
  // 첫 글자만 대문자로 변환
  String get capitalize => isNotEmpty ? '${this[0].toUpperCase()}${substring(1)}' : '';

  // 문자열이 이메일인지 확인
  bool get isValidEmail => RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);

  // 문자열을 n번 반복
  String repeat(int n) => List.filled(n, this).join();

  // 문자열의 모든 단어를 대문자로 시작하도록 변환
  String toTitleCase() {
    return split(' ')
        .map((word) => word.isNotEmpty ? '${word[0].toUpperCase()}${word.substring(1)}' : '')
        .join(' ');
  }
}

void main() {
  String name = 'john doe';
  print(name.capitalize); // John doe
  print(name.toTitleCase()); // John Doe
  print('hello'.repeat(3)); // hellohellohello
  print('test@example.com'.isValidEmail); // true
  print('invalid.email'.isValidEmail); // false
}
```

### 예제: int 확장

```dart
extension IntExtension on int {
  // 초를 시:분:초 형식으로 변환
  String toTimeString() {
    int h = this ~/ 3600;
    int m = (this % 3600) ~/ 60;
    int s = this % 60;
    return '${h.toString().padLeft(2, '0')}:${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  // 숫자가 소수인지 확인
  bool get isPrime {
    if (this <= 1) return false;
    if (this <= 3) return true;
    if (this % 2 == 0 || this % 3 == 0) return false;
    int i = 5;
    while (i * i <= this) {
      if (this % i == 0 || this % (i + 2) == 0) return false;
      i += 6;
    }
    return true;
  }

  // 숫자의 팩토리얼 계산
  int get factorial {
    if (this < 0) throw ArgumentError('음수의 팩토리얼은 정의되지 않습니다.');
    if (this <= 1) return 1;
    return this * (this - 1).factorial;
  }
}

void main() {
  int seconds = 3665;
  print(seconds.toTimeString()); // 01:01:05

  print(7.isPrime); // true
  print(8.isPrime); // false

  print(5.factorial); // 120
}
```

### 예제: List 확장

```dart
extension ListExtension<T> on List<T> {
  // 리스트의 첫 번째 요소 (안전하게 가져오기)
  T? get firstOrNull => isEmpty ? null : first;

  // 리스트의 마지막 요소 (안전하게 가져오기)
  T? get lastOrNull => isEmpty ? null : last;

  // 중복 제거
  List<T> get distinct => toSet().toList();

  // 리스트 분할
  List<List<T>> chunk(int size) {
    return List.generate(
      (length / size).ceil(),
      (i) => sublist(i * size, (i + 1) * size > length ? length : (i + 1) * size),
    );
  }
}

void main() {
  List<int> numbers = [1, 2, 3, 4, 5, 1, 2];
  print(numbers.distinct); // [1, 2, 3, 4, 5]

  List<String> fruits = ['사과', '바나나', '오렌지', '딸기', '포도'];
  print(fruits.chunk(2)); // [[사과, 바나나], [오렌지, 딸기], [포도]]

  List<int> empty = [];
  print(empty.firstOrNull); // null
  print(empty.lastOrNull); // null
}
```

### 확장 게터와 세터

```dart
extension NumberParsing on String {
  int? get asIntOrNull => int.tryParse(this);
  double? get asDoubleOrNull => double.tryParse(this);

  bool get asBool {
    final lower = toLowerCase();
    return lower == 'true' || lower == '1' || lower == 'yes' || lower == 'y';
  }
}

void main() {
  print('42'.asIntOrNull); // 42
  print('3.14'.asDoubleOrNull); // 3.14
  print('abc'.asIntOrNull); // null
  print('true'.asBool); // true
  print('YES'.asBool); // true
}
```

### 정적 확장 멤버

확장은 정적 메서드와 프로퍼티도 포함할 수 있습니다:

```dart
extension DateTimeExtension on DateTime {
  // 인스턴스 메서드
  String get formattedDate => '$year-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';

  // 정적 메서드
  static DateTime fromFormattedString(String formattedString) {
    final parts = formattedString.split('-');
    if (parts.length != 3) {
      throw FormatException('잘못된 날짜 형식: $formattedString');
    }
    return DateTime(int.parse(parts[0]), int.parse(parts[1]), int.parse(parts[2]));
  }

  // 정적 프로퍼티
  static DateTime get tomorrow => DateTime.now().add(Duration(days: 1));
}

void main() {
  final now = DateTime.now();
  print(now.formattedDate); // 예: 2023-11-15

  // 정적 메서드 호출
  final date = DateTimeExtension.fromFormattedString('2023-11-15');
  print(date); // 2023-11-15 00:00:00.000

  // 정적 프로퍼티 접근
  print(DateTimeExtension.tomorrow);
}
```

### 확장과 타입 매개변수

제네릭 타입에 대한 확장도 정의할 수 있습니다:

```dart
extension OptionalExtension<T> on T? {
  // null인 경우 기본값 반환
  T orDefault(T defaultValue) => this ?? defaultValue;

  // null이 아닌 경우에만 변환 함수 적용
  R? mapIf<R>(R Function(T) mapper) => this != null ? mapper(this as T) : null;

  // 조건부 실행
  void ifPresent(void Function(T) action) {
    if (this != null) {
      action(this as T);
    }
  }
}

void main() {
  String? nullableString = null;
  print(nullableString.orDefault('기본값')); // 기본값

  int? nullableNumber = 42;
  print(nullableNumber.orDefault(0)); // 42

  // 변환 예제
  String? name = '홍길동';
  int? length = name.mapIf((n) => n.length); // 3

  // 조건부 실행
  name.ifPresent((n) => print('안녕하세요, $n님!')); // 안녕하세요, 홍길동님!
  nullableString.ifPresent((s) => print(s)); // 아무것도 출력되지 않음
}
```

### 확장 충돌 해결

동일한 타입에 대해 동일한 이름의 메서드나 프로퍼티를 정의하는 여러 확장이 범위 내에 있는 경우, 충돌이 발생합니다. 이를 해결하기 위해서는 확장을 명시적으로 지정해야 합니다:

```dart
extension NumberParsing on String {
  int parseInt() => int.parse(this);
}

extension StringParsing on String {
  int parseInt() => int.parse(this) * 2; // 다른 구현
}

void main() {
  // 컴파일 오류: 모호한 호출
  // print('42'.parseInt());

  // 확장을 명시적으로 지정하여 해결
  print(NumberParsing('42').parseInt()); // 42
  print(StringParsing('42').parseInt()); // 84
}
```

## Mixin(믹스인)

Mixin은 여러 클래스 계층 구조 간에 코드를 재사용하는 방법입니다. 단일 상속만 지원하는 Dart에서 믹스인을 사용하면 여러 클래스의 기능을 결합할 수 있습니다.

### 기본 구문

```dart
mixin <믹스인명> [on <상위클래스>] {
  // 메서드, 게터, 세터 등
}

class <클래스명> [extends <상위클래스>] with <믹스인1>, <믹스인2>, ... {
  // 클래스 정의
}
```

### 간단한 믹스인 예제

```dart
// Logger 믹스인 정의
mixin Logger {
  void log(String message) {
    print('로그: $message');
  }

  void error(String message) {
    print('오류: $message');
  }

  void warn(String message) {
    print('경고: $message');
  }
}

// 유효성 검사 믹스인 정의
mixin Validator {
  bool isValid(String value) {
    return value.isNotEmpty;
  }

  void validate(String value) {
    if (!isValid(value)) {
      throw ArgumentError('유효하지 않은 값: $value');
    }
  }
}

// 믹스인을 사용한 클래스 정의
class User with Logger, Validator {
  String name;

  User(this.name) {
    validate(name);
    log('새 사용자 생성: $name');
  }

  void changeName(String newName) {
    try {
      validate(newName);
      name = newName;
      log('이름 변경됨: $name');
    } catch (e) {
      error('이름 변경 실패: $e');
    }
  }
}

void main() {
  final user = User('홍길동');
  user.changeName('김철수');

  // 빈 문자열은 유효성 검사에 실패
  user.changeName('');
}

// 출력:
// 로그: 새 사용자 생성: 홍길동
// 로그: 이름 변경됨: 김철수
// 오류: 이름 변경 실패: ArgumentError: 유효하지 않은 값:
```

### on 키워드를 사용한 믹스인 제한

믹스인이 특정 클래스나 해당 하위 클래스에서만 사용될 수 있도록 제한할 수 있습니다:

```dart
class Animal {
  String name;
  Animal(this.name);

  void eat() {
    print('$name이(가) 먹고 있습니다.');
  }
}

// Animal 클래스나 그 하위 클래스에서만 사용 가능한 믹스인
mixin Swimmer on Animal {
  void swim() {
    print('$name이(가) 수영하고 있습니다.');
    // Animal의 메서드 호출 가능
    eat();
  }
}

class Dog extends Animal with Swimmer {
  Dog(String name) : super(name);

  void bark() {
    print('$name: 멍멍!');
  }
}

// 다음 코드는 컴파일 오류 발생
// class Fish with Swimmer { // 오류: Swimmer는 Animal의 하위 클래스에서만 사용 가능
//   String name;
//   Fish(this.name);
// }

void main() {
  final dog = Dog('바둑이');
  dog.swim(); // 바둑이이(가) 수영하고 있습니다. + 바둑이이(가) 먹고 있습니다.
  dog.bark(); // 바둑이: 멍멍!
}
```

### 믹스인에서 변수 선언

믹스인에서도 변수를 선언할 수 있습니다:

```dart
mixin Counter {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
  }

  void reset() {
    _count = 0;
  }
}

class ClickCounter with Counter {
  String name;

  ClickCounter(this.name);

  void click() {
    increment();
    print('$name 버튼이 $count번 클릭되었습니다.');
  }
}

void main() {
  final button = ClickCounter('제출');
  button.click(); // 제출 버튼이 1번 클릭되었습니다.
  button.click(); // 제출 버튼이 2번 클릭되었습니다.
  button.reset();
  button.click(); // 제출 버튼이 1번 클릭되었습니다.
}
```

### 믹스인 충돌 해결

여러 믹스인에서 동일한 이름의 메서드나 프로퍼티를 정의하는 경우, 충돌이 발생합니다. 이 경우 마지막으로 적용된 믹스인의 메서드가 우선합니다:

```dart
mixin A {
  void method() {
    print('A의 메서드');
  }
}

mixin B {
  void method() {
    print('B의 메서드');
  }
}

// 순서에 따라 결과가 달라짐
class MyClass1 with A, B {}
class MyClass2 with B, A {}

void main() {
  MyClass1().method(); // B의 메서드 (B가 A 이후에 적용됨)
  MyClass2().method(); // A의 메서드 (A가 B 이후에 적용됨)
}
```

충돌을 명시적으로 해결하기 위해 클래스에서 메서드를 오버라이드할 수 있습니다:

```dart
class MyClass with A, B {
  @override
  void method() {
    print('MyClass의 메서드');
    super.method(); // B의 메서드 호출 (마지막으로 적용된 믹스인)
  }
}

void main() {
  MyClass().method();
  // 출력:
  // MyClass의 메서드
  // B의 메서드
}
```

### super 호출과 믹스인 순서

믹스인 내에서 `super` 키워드를 사용하면 믹스인 적용 순서에 따라 결정되는 상위 구현을 호출합니다:

```dart
mixin A {
  void method() {
    print('A의 메서드');
  }
}

mixin B {
  void method() {
    print('B의 메서드');
    super.method(); // 상위 구현 호출
  }
}

mixin C {
  void method() {
    print('C의 메서드');
    super.method(); // 상위 구현 호출
  }
}

class Base {
  void method() {
    print('Base의 메서드');
  }
}

class MyClass extends Base with A, B, C {}

void main() {
  MyClass().method();
  // 출력:
  // C의 메서드
  // B의 메서드
  // A의 메서드
  // Base의 메서드
}
```

위 예제에서 호출 순서는 다음과 같습니다:

1. `MyClass`에 적용된 마지막 믹스인 `C`의 `method()`
2. `C`에서 `super.method()`를 호출하면 `B`의 `method()` 호출
3. `B`에서 `super.method()`를 호출하면 `A`의 `method()` 호출
4. `A`에서 `super.method()`가 명시적으로 호출되지 않았지만, 암시적으로 `Base`의 `method()` 호출

### 클래스와 믹스인 비교

클래스와 믹스인 모두 코드 재사용 메커니즘을 제공하지만, 다음과 같은 차이점이 있습니다:

1. **인스턴스화**: 클래스는 인스턴스화할 수 있지만, 믹스인은 단독으로 인스턴스화할 수 없습니다.
2. **상속**: 믹스인은 다중 상속과 유사한 기능을 제공합니다.
3. **한정**: `on` 키워드를 사용하여 믹스인을 특정 클래스에만 적용되도록 제한할 수 있습니다.

```dart
// 클래스로 정의
class Logger {
  void log(String message) {
    print('로그: $message');
  }
}

// 믹스인으로 정의
mixin LoggerMixin {
  void log(String message) {
    print('로그: $message');
  }
}

// 클래스 사용
class UserService1 {
  final Logger logger = Logger();

  void doSomething() {
    logger.log('작업 수행 중');
  }
}

// 믹스인 사용
class UserService2 with LoggerMixin {
  void doSomething() {
    log('작업 수행 중'); // 직접 호출 가능
  }
}

void main() {
  // 클래스는 인스턴스화 가능
  Logger().log('직접 로깅');

  // 믹스인은 인스턴스화 불가능
  // LoggerMixin().log('직접 로깅'); // 오류

  UserService1().doSomething();
  UserService2().doSomething();
}
```

## 실전 예제: 확장과 믹스인 결합

다음 예제는 확장과 믹스인을 결합하여 데이터 검증, 직렬화, 로깅 기능을 갖춘 시스템을 구현합니다:

```dart
// JSON 직렬화 믹스인
mixin JsonSerializable {
  Map<String, dynamic> toJson();

  String stringify() {
    return jsonEncode(toJson());
  }
}

// 유효성 검사 믹스인
mixin Validatable {
  bool validate();

  List<String> getValidationErrors();

  void validateOrThrow() {
    if (!validate()) {
      throw ValidationException(getValidationErrors());
    }
  }
}

// 로깅 믹스인
mixin Loggable {
  String get logTag => runtimeType.toString();

  void log(String message) {
    print('[$logTag] $message');
  }

  void logInfo(String message) => log('INFO: $message');
  void logError(String message) => log('ERROR: $message');
}

// 예외 클래스
class ValidationException implements Exception {
  final List<String> errors;

  ValidationException(this.errors);

  @override
  String toString() => 'ValidationException: ${errors.join(', ')}';
}

// 날짜 확장
extension DateTimeExtension on DateTime {
  String get formattedDate => '$year-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';

  bool isSameDay(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }
}

// User 모델 클래스
class User with JsonSerializable, Validatable, Loggable {
  final String id;
  final String name;
  final String email;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.createdAt,
  }) {
    logInfo('새 사용자 생성: $name');
  }

  @override
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'created_at': createdAt.formattedDate,
    };
  }

  @override
  bool validate() {
    return id.isNotEmpty &&
           name.isNotEmpty &&
           email.contains('@') &&
           email.contains('.');
  }

  @override
  List<String> getValidationErrors() {
    final errors = <String>[];

    if (id.isEmpty) errors.add('ID는 비어있을 수 없습니다.');
    if (name.isEmpty) errors.add('이름은 비어있을 수 없습니다.');
    if (!email.contains('@') || !email.contains('.')) {
      errors.add('유효한 이메일이 아닙니다.');
    }

    return errors;
  }
}

// String 확장: 이메일 검증
extension EmailValidation on String {
  bool get isValidEmail => RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
}

void main() {
  try {
    // 유효한 사용자
    final user1 = User(
      id: 'user123',
      name: '홍길동',
      email: 'hong@example.com',
      createdAt: DateTime.now(),
    );

    user1.validateOrThrow();
    user1.logInfo('사용자 유효성 검사 통과');
    print(user1.stringify());

    // 유효하지 않은 사용자
    final user2 = User(
      id: 'user456',
      name: '',
      email: 'invalid-email',
      createdAt: DateTime.now(),
    );

    user2.validateOrThrow(); // 예외 발생
  } catch (e) {
    print('오류 발생: $e');
  }

  // 확장 메서드 사용
  final date = DateTime.now();
  print('오늘 날짜: ${date.formattedDate}');

  // 이메일 유효성 검사 확장 사용
  print('test@example.com은 유효한 이메일인가? ${'test@example.com'.isValidEmail}');
  print('invalid-email은 유효한 이메일인가? ${'invalid-email'.isValidEmail}');
}
```

## 결론

Extension과 Mixin은 Dart에서 코드를 재사용하고 확장하는 강력한 방법을 제공합니다:

1. **Extension**은 기존 클래스(자신이 작성하지 않은 클래스도 포함)에 새로운 기능을 추가할 수 있게 해주며, 원본 코드를 수정하지 않고도 기능을 확장할 수 있습니다.

2. **Mixin**은 여러 클래스 계층 구조 간에 코드를 재사용하는 방법을 제공하며, 여러 클래스의 기능을 한 클래스에 결합할 수 있습니다.

이러한 기능을 적절히 활용하면 코드의 가독성, 재사용성, 유지 관리성을 크게 향상시킬 수 있습니다. Flutter 개발에서도 위젯 확장, 공통 기능 추출 등 다양한 상황에서 이러한 패턴을 활용할 수 있습니다.

다음 파트에서는 Flutter 위젯과 기본 UI 구성 요소에 대해 알아보겠습니다.
