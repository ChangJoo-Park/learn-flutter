# 기본 문법 및 변수

## Dart 프로그램의 구조

Dart 프로그램은 최상위 함수, 변수, 클래스 등으로 구성됩니다. 모든 Dart 프로그램은 `main()` 함수에서 시작합니다.

```dart
// 가장 기본적인 Dart 프로그램
void main() {
  print('안녕하세요, Dart!');
}
```

`main()` 함수는 프로그램의 진입점이며, `void`는 반환 값이 없음을 의미합니다. 커맨드라인에서 인자를 받을 때는 다음과 같이 작성할 수 있습니다.

```dart
void main(List<String> arguments) {
  print('프로그램 인자: $arguments');
}
```

## 주석

Dart에서는 세 가지 유형의 주석을 사용할 수 있습니다.

```dart
// 한 줄 주석

/*
  여러 줄 주석
  여러 줄에 걸쳐 작성할 수 있습니다.
*/

/// 문서화 주석
/// 다트독(dartdoc) 도구가 API 문서를 생성할 때 사용합니다.
/// 클래스, 함수, 변수 등의 설명을 작성할 때 유용합니다.
```

## 기본 데이터 타입

Dart는 다음과 같은 기본 데이터 타입을 제공합니다:

```dart
// 숫자 타입
int integerValue = 42;        // 정수
double doubleValue = 3.14;    // 실수
num numValue = 10;            // int나 double의 상위 타입

// 문자열 타입
String greeting = '안녕하세요';

// 불리언 타입
bool isTrue = true;
bool isFalse = false;

// 리스트 (배열)
List<int> numbers = [1, 2, 3, 4, 5];

// 맵 (key-value 쌍)
Map<String, dynamic> person = {
  'name': '홍길동',
  'age': 30,
  'isStudent': false
};

// 집합 (중복 없는 컬렉션)
Set<String> uniqueNames = {'홍길동', '김철수', '이영희'};
```

## 변수 선언

Dart에서는 다양한 방법으로 변수를 선언할 수 있습니다.

### var

타입을 명시적으로 선언하지 않고, 초기값에서 타입을 추론합니다.

```dart
var name = '홍길동';    // String으로 추론
var age = 30;         // int로 추론
var height = 175.5;   // double로 추론

// 타입이 추론된 후에는 다른 타입의 값을 할당할 수 없습니다.
name = '김철수';      // 가능 (String → String)
// name = 42;        // 오류 (String → int)
```

### 명시적 타입

변수의 타입을 명시적으로 선언합니다.

```dart
String name = '홍길동';
int age = 30;
double height = 175.5;
```

### final과 const

한 번 할당하면 변경할 수 없는 상수 변수를 선언합니다.

```dart
// final: 런타임에 값이 결정되는 상수
final String name = '홍길동';
final currentTime = DateTime.now();  // 타입 추론 가능

// const: 컴파일 타임에 값이 결정되는 상수
const int maxUsers = 100;
const double pi = 3.14159;

// name = '김철수';    // 오류: final 변수는 재할당 불가
// maxUsers = 200;     // 오류: const 변수는 재할당 불가
```

`final`과 `const`의 차이점:

- `final`: 런타임에 값이 결정됩니다. 런타임에 계산되는 값도 가능합니다.
- `const`: 컴파일 타임에 값이 결정됩니다. 컴파일 시점에 알 수 있는 상수값만 가능합니다.

```dart
// 런타임 값을 사용하는 예
final now = DateTime.now();       // 가능
// const today = DateTime.now();  // 오류: 컴파일 시점에 값을 알 수 없음
```

### late

`late` 키워드는 변수를 나중에 초기화할 것임을 나타냅니다. Null 안전성이 도입된 Dart 2.12 이후에 유용합니다.

```dart
late String name;

void initName() {
  name = '홍길동';  // 나중에 값 할당
}

void main() {
  initName();
  print(name);  // '홍길동'

  // late 변수는 초기화 전에 접근하면 런타임 오류 발생
  late String address;
  // print(address);  // 오류: 초기화되지 않은 late 변수에 접근
}
```

### 동적 타입 (dynamic)

`dynamic` 타입은 변수의 타입을 런타임까지 확정하지 않습니다. 타입 안전성이 필요하지 않을 때 사용합니다.

```dart
dynamic value = '문자열';
print(value);  // '문자열'

value = 42;
print(value);  // 42

value = true;
print(value);  // true
```

## 문자열

Dart에서는 작은따옴표(`'`) 또는 큰따옴표(`"`)를 사용하여 문자열을 생성할 수 있습니다.

```dart
String single = '작은따옴표 문자열';
String double = "큰따옴표 문자열";
```

### 문자열 보간(Interpolation)

문자열 내에서 변수나 표현식을 사용할 수 있습니다.

```dart
String name = '홍길동';
int age = 30;

// $변수명 형태로 변수 값을 포함할 수 있습니다.
String message = '제 이름은 $name이고, 나이는 $age살입니다.';

// ${표현식} 형태로 표현식 결과를 포함할 수 있습니다.
String ageNextYear = '내년에는 ${age + 1}살이 됩니다.';
```

### 여러 줄 문자열

여러 줄에 걸친 문자열은 삼중 따옴표(`'''` 또는 `"""`)를 사용합니다.

```dart
String multiLine = '''
이것은
여러 줄에 걸친
문자열입니다.
''';

String anotherMultiLine = """
이것도
여러 줄에 걸친
문자열입니다.
""";
```

### 원시 문자열 (Raw String)

문자열 앞에 `r`을 붙이면 이스케이프 시퀀스를 처리하지 않는 원시 문자열이 됩니다.

```dart
String escaped = 'C:\\Program Files\\Dart';  // 이스케이프 시퀀스 사용
String raw = r'C:\Program Files\Dart';       // 원시 문자열 (이스케이프 처리 안 함)
```

## 연산자

### 산술 연산자

```dart
int a = 10;
int b = 3;

print(a + b);  // 13 (덧셈)
print(a - b);  // 7 (뺄셈)
print(a * b);  // 30 (곱셈)
print(a / b);  // 3.3333333333333335 (나눗셈, 결과는 double)
print(a ~/ b); // 3 (정수 나눗셈, 결과는 int)
print(a % b);  // 1 (나머지)
```

### 증감 연산자

```dart
int a = 10;

a++;        // 후위 증가 (a = a + 1)
++a;        // 전위 증가
print(a);   // 12

a--;        // 후위 감소 (a = a - 1)
--a;        // 전위 감소
print(a);   // 10
```

### 할당 연산자

```dart
int a = 10;

a += 5;      // a = a + 5
print(a);    // 15

a -= 3;      // a = a - 3
print(a);    // 12

a *= 2;      // a = a * 2
print(a);    // 24

a ~/= 5;     // a = a ~/ 5
print(a);    // 4
```

### 비교 연산자

```dart
int a = 10;
int b = 5;

print(a == b);   // false (같음)
print(a != b);   // true (다름)
print(a > b);    // true (초과)
print(a < b);    // false (미만)
print(a >= b);   // true (이상)
print(a <= b);   // false (이하)
```

### 논리 연산자

```dart
bool condition1 = true;
bool condition2 = false;

print(condition1 && condition2);  // false (AND)
print(condition1 || condition2);  // true (OR)
print(!condition1);              // false (NOT)
```

### 타입 테스트 연산자

```dart
var value = '문자열';

print(value is String);       // true (value가 String 타입인지 확인)
print(value is! int);         // true (value가 int 타입이 아닌지 확인)

// as 연산자는 타입 변환에 사용됩니다.
dynamic someValue = 'Dart';
String text = someValue as String;
```

### 조건 연산자

```dart
// 조건 ? 값1 : 값2
int a = 10;
int b = 5;
int max = a > b ? a : b;  // a가 b보다 크면 a, 아니면 b
print(max);  // 10

// ?? 연산자: 왼쪽 피연산자가 null이면 오른쪽 피연산자 반환
String? name;
String displayName = name ?? '이름 없음';
print(displayName);  // '이름 없음'
```

### 캐스케이드 연산자 (..)

객체에 대해 연속적인 작업을 수행할 수 있는 캐스케이드 연산자입니다.

```dart
class Person {
  String name = '';
  int age = 0;

  void introduce() {
    print('내 이름은 $name이고, 나이는 $age살입니다.');
  }
}

void main() {
  var person = Person()
    ..name = '홍길동'
    ..age = 30
    ..introduce();

  // 위 코드는 다음과 동일합니다:
  // var person = Person();
  // person.name = '홍길동';
  // person.age = 30;
  // person.introduce();
}
```

## null 안전성

Dart 2.12부터 도입된 null 안전성을 활용하면 null 참조 오류를 컴파일 타임에 방지할 수 있습니다.

### nullable과 non-nullable 타입

```dart
// non-nullable 타입 (null을 할당할 수 없음)
String name = '홍길동';
// name = null;  // 컴파일 오류

// nullable 타입 (null을 할당할 수 있음)
String? nullableName = '홍길동';
nullableName = null;  // 허용됨
```

### null 검사와 null 조건 접근

```dart
String? name = getNullableName();

// null 검사 후 사용
if (name != null) {
  print('이름의 길이: ${name.length}');
}

// 조건 프로퍼티 접근 (?.): 객체가 null이면 전체 표현식이 null이 됨
print('이름의 길이: ${name?.length}');

// null 병합 연산자 (??): 왼쪽 피연산자가 null이면 오른쪽 피연산자 반환
print('이름: ${name ?? '이름 없음'}');

// null 정의 연산자 (??=): 변수가 null이면 값을 할당
name ??= '이름 없음';
```

### Non-null 단언 연산자 (!)

변수가 null이 아님을 컴파일러에게 알려주는 연산자입니다. 변수가 실제로 null이면 런타임 오류가 발생합니다.

```dart
String? name = '홍길동';

// name이 null이 아니라고 확신할 때 사용
String nonNullName = name!;

// 그러나 실제로 null이면 런타임 오류 발생
name = null;
// String error = name!;  // 런타임 오류: null 참조
```

## 결론

이 장에서는 Dart의 기본 문법과 변수 선언, 데이터 타입, 연산자, null 안전성 등에 대해 알아보았습니다. 이러한 기본 개념은 Dart 프로그래밍의 토대가 되며, Flutter를 활용한 앱 개발에도 필수적입니다.

다음 장에서는 Dart의 타입 시스템과 제네릭에 대해 더 자세히 알아보겠습니다.
