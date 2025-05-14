---
title: 타입 시스템 & 제네릭
---

## Dart 타입 시스템 개요

Dart는 정적 타입 언어로, 컴파일 시간에 타입 검사를 수행합니다. 그러나 타입 추론을 지원하여 타입 선언을 생략할 수 있는 유연성도 제공합니다. Dart 2부터는 타입 안전성이 강화되었고, Dart 2.12부터는 null 안전성이 도입되었습니다.

## 기본 타입

### 기본 제공 타입

Dart에는 다음과 같은 기본 타입이 있습니다:

```dart
// 숫자 타입
int integer = 42;
double decimal = 3.14;
num number = 10;  // int나 double의 상위 타입

// 문자열
String text = '안녕하세요';

// 불리언
bool flag = true;

// 리스트(배열)
List<int> numbers = [1, 2, 3];

// 맵(딕셔너리)
Map<String, dynamic> person = {'name': '홍길동', 'age': 30};

// 집합
Set<String> uniqueNames = {'홍길동', '김철수', '이영희'};

// 심볼
Symbol symbol = #symbolName;
```

### 특수 타입

Dart에는 특수한 용도의 타입도 있습니다:

```dart
// void: 값을 반환하지 않는 함수의 반환 타입
void printMessage() {
  print('메시지 출력');
}

// dynamic: 모든 타입을 허용하는 동적 타입
dynamic dynamicValue = '문자열';
dynamicValue = 42;  // 타입 변경 가능

// Object: 모든 객체의 기본 타입
Object objectValue = 'Hello';

// Null: null 값의 타입 (Dart 2.12 이전)
```

## 타입 추론

Dart는 변수의 초기값을 기반으로 타입을 추론할 수 있습니다:

```dart
// 타입 추론
var name = '홍길동';      // String 타입으로 추론
var age = 30;           // int 타입으로 추론
var height = 175.5;     // double 타입으로 추론
var active = true;      // bool 타입으로 추론
var items = [1, 2, 3];  // List<int> 타입으로 추론

// 함수에서도 반환 타입 추론
var getName = () {
  return '홍길동';  // String 반환 타입으로 추론
};

// 컬렉션에서도 타입 추론
var people = [      // List<Map<String, Object>> 타입으로 추론
  {'name': '홍길동', 'age': 30},
  {'name': '김철수', 'age': 25},
];
```

## 타입 체크와 캐스팅

### is와 is! 연산자

타입을 확인하기 위해 `is`와 `is!` 연산자를 사용합니다:

```dart
Object value = '문자열';

if (value is String) {
  // value는 이 블록 내에서 String 타입으로 취급됨 (스마트 캐스팅)
  print('문자열 길이: ${value.length}');
}

if (value is! int) {
  print('정수가 아닙니다');
}
```

### as 연산자

타입 캐스팅을 위해 `as` 연산자를 사용합니다:

```dart
Object value = '문자열';

// String으로 캐스팅
String text = value as String;
print(text.toUpperCase());

// 잘못된 캐스팅은 런타임 오류 발생
// int number = value as int;  // 오류: String을 int로 캐스팅 불가
```

## 제네릭(Generics)

제네릭은 타입을 매개변수로 사용하여 코드를 재사용할 수 있게 해주는 기능입니다.

### 제네릭 클래스

```dart
// 제네릭 클래스 정의
class Box<T> {
  T value;

  Box(this.value);

  T getValue() {
    return value;
  }

  void setValue(T newValue) {
    value = newValue;
  }
}

// 제네릭 클래스 사용
void main() {
  // String 타입의 Box
  var stringBox = Box<String>('안녕하세요');
  print(stringBox.getValue());  // '안녕하세요'

  // int 타입의 Box
  var intBox = Box<int>(42);
  print(intBox.getValue());  // 42

  // 타입 추론을 통한 인스턴스화
  var doubleBox = Box(3.14);  // Box<double>로 추론
}
```

### 제네릭 함수

```dart
// 제네릭 함수 정의
T first<T>(List<T> items) {
  return items.first;
}

// 제네릭 함수 사용
void main() {
  var names = ['홍길동', '김철수', '이영희'];
  var firstString = first<String>(names);
  print(firstString);  // '홍길동'

  var numbers = [1, 2, 3, 4, 5];
  var firstInt = first(numbers);  // 타입 추론으로 T는 int로 결정
  print(firstInt);  // 1
}
```

### 제네릭 타입 제한

특정 타입이나 상위 타입으로 제한할 수 있습니다:

```dart
// 상위 타입 제한
class NumberBox<T extends num> {
  T value;

  NumberBox(this.value);

  void square() {
    // T가 num의 하위 타입이므로 곱셈 연산 가능
    print(value * value);
  }
}

void main() {
  var intBox = NumberBox<int>(10);
  intBox.square();  // 100

  var doubleBox = NumberBox<double>(2.5);
  doubleBox.square();  // 6.25

  // var stringBox = NumberBox<String>('오류');  // 컴파일 오류: String은 num의 하위 타입이 아님
}
```

### 다양한 제네릭 적용

```dart
// 다중 타입 매개변수
class Pair<K, V> {
  K first;
  V second;

  Pair(this.first, this.second);
}

// 제네릭 확장
class IntBox extends Box<int> {
  IntBox(int value) : super(value);

  void increment() {
    setValue(getValue() + 1);
  }
}

// 제네릭 타입 별칭
typedef StringList = List<String>;
typedef KeyValueMap<K, V> = Map<K, V>;
```

## 컬렉션 타입과 제네릭

### List와 제네릭

```dart
// 타입 지정 리스트
List<String> names = ['홍길동', '김철수', '이영희'];
List<int> scores = [90, 85, 95];

// 컬렉션 리터럴로 생성
var fruits = <String>['사과', '바나나', '오렌지'];

// 생성자로 생성
var numbers = List<int>.filled(5, 0);  // [0, 0, 0, 0, 0]
var evens = List<int>.generate(5, (i) => i * 2);  // [0, 2, 4, 6, 8]

// 제네릭 메서드 사용
var filteredNames = names.where((name) => name.length > 2).toList();
var mappedScores = scores.map((score) => score * 1.1).toList();
```

### Map과 제네릭

```dart
// 타입 지정 맵
Map<String, int> ages = {
  '홍길동': 30,
  '김철수': 25,
  '이영희': 28,
};

// 컬렉션 리터럴로 생성
var scores = <String, double>{
  '수학': 90.5,
  '영어': 85.0,
  '과학': 95.5,
};

// 생성자로 생성
var config = Map<String, dynamic>();
config['debug'] = true;
config['timeout'] = 30;
```

### Set과 제네릭

```dart
// 타입 지정 집합
Set<String> uniqueNames = {'홍길동', '김철수', '이영희'};

// 컬렉션 리터럴로 생성
var colors = <String>{'빨강', '파랑', '녹색'};

// 생성자로 생성
var numbers = Set<int>.from([1, 2, 3, 3, 4]);  // {1, 2, 3, 4}
```

## 타입 시스템의 고급 기능

### typedef

함수 타입 또는 타입 별칭을 정의할 수 있습니다:

```dart
// 함수 타입 정의
typedef IntOperation = int Function(int a, int b);

int add(int a, int b) => a + b;
int subtract(int a, int b) => a - b;

void calculate(IntOperation operation, int x, int y) {
  print('결과: ${operation(x, y)}');
}

void main() {
  calculate(add, 10, 5);      // 결과: 15
  calculate(subtract, 10, 5); // 결과: 5
}
```

Dart 2.13부터는 함수 타입뿐만 아니라 모든 타입의 별칭을 정의할 수 있습니다:

```dart
// 타입 별칭 정의
typedef StringList = List<String>;
typedef UserInfo = Map<String, dynamic>;

void printNames(StringList names) {
  for (var name in names) {
    print(name);
  }
}

void displayUserInfo(UserInfo user) {
  print('이름: ${user['name']}, 나이: ${user['age']}');
}

void main() {
  StringList names = ['홍길동', '김철수', '이영희'];
  printNames(names);

  UserInfo user = {'name': '홍길동', '나이': 30};
  displayUserInfo(user);
}
```

### 타입 프로모션

Dart는 타입 검사 이후 변수의 타입을 자동으로 더 구체적인 타입으로 승격(프로모션)합니다:

```dart
Object value = '안녕하세요';

// 타입 검사 후 자동으로 String으로 프로모션됨
if (value is String) {
  // 이 블록 내에서는 value가 String 타입으로 취급됨
  print('대문자: ${value.toUpperCase()}');
  print('길이: ${value.length}');
}

// 블록 밖에서는 다시 원래 타입 (Object)
// print(value.length);  // 오류: Object에는 length 속성이 없음
```

### 유니온 타입 (Dart 3)

Dart 3부터는 유니온 타입을 지원합니다:

```dart
Object value = '문자열';

// as 대신 패턴 매칭으로 타입 처리
switch (value) {
  case String():
    print('문자열: $value');
  case int():
    print('정수: $value');
  default:
    print('기타 타입: $value');
}
```

## 실전 예제: 제네릭 활용

### 데이터 캐싱 클래스

```dart
class Cache<T> {
  final Map<String, T> _cache = {};

  T? get(String key) {
    return _cache[key];
  }

  void set(String key, T value) {
    _cache[key] = value;
  }

  bool has(String key) {
    return _cache.containsKey(key);
  }

  void remove(String key) {
    _cache.remove(key);
  }

  void clear() {
    _cache.clear();
  }
}

// 사용 예
void main() {
  var stringCache = Cache<String>();
  stringCache.set('greeting', '안녕하세요');
  print(stringCache.get('greeting'));  // '안녕하세요'

  var userCache = Cache<Map<String, dynamic>>();
  userCache.set('user1', {'name': '홍길동', 'age': 30});
  var user = userCache.get('user1');
  print('사용자: ${user?['name']}, 나이: ${user?['age']}');
}
```

### Result 타입

성공 또는 실패 결과를 나타내는 제네릭 클래스:

```dart
abstract class Result<S, E> {
  Result();

  factory Result.success(S value) = Success<S, E>;
  factory Result.failure(E error) = Failure<S, E>;

  bool get isSuccess;
  bool get isFailure;
  S? get value;
  E? get error;

  void when({
    required void Function(S value) success,
    required void Function(E error) failure,
  });
}

class Success<S, E> extends Result<S, E> {
  final S _value;

  Success(this._value);

  @override
  bool get isSuccess => true;

  @override
  bool get isFailure => false;

  @override
  S get value => _value;

  @override
  E? get error => null;

  @override
  void when({
    required void Function(S value) success,
    required void Function(E error) failure,
  }) {
    success(_value);
  }
}

class Failure<S, E> extends Result<S, E> {
  final E _error;

  Failure(this._error);

  @override
  bool get isSuccess => false;

  @override
  bool get isFailure => true;

  @override
  S? get value => null;

  @override
  E get error => _error;

  @override
  void when({
    required void Function(S value) success,
    required void Function(E error) failure,
  }) {
    failure(_error);
  }
}

// 사용 예
Result<String, Exception> fetchData() {
  try {
    // 데이터 가져오기 로직
    return Result.success('데이터');
  } catch (e) {
    return Result.failure(Exception('데이터를 가져오는 중 오류 발생: $e'));
  }
}

void main() {
  var result = fetchData();

  result.when(
    success: (data) {
      print('성공: $data');
    },
    failure: (error) {
      print('실패: $error');
    },
  );
}
```

![fpdart code](https://raw.githubusercontent.com/SandroMaglione/fpdart/main/resources/screenshots/screenshot_fpdart.png)

[fpdart](https://pub.dev/packages/fpdart)를 이용하면 Result외에 더 다양한 함수형 프로그래밍 기능을 사용하실 수 있습니다.

## 결론

Dart의 타입 시스템과 제네릭은 타입 안전성과 코드 재사용성을 동시에 얻을 수 있게 해줍니다. 정적 타입 시스템은 컴파일 시간에 많은 오류를 잡아낼 수 있으며, 제네릭은 다양한 타입에 대해 동일한 로직을 적용할 수 있게 해줍니다.

다음 장에서는 Dart의 클래스, 생성자, 팩토리 등 객체 지향 프로그래밍의 핵심 개념에 대해 알아보겠습니다.
