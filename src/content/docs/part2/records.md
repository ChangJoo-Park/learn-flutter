---
title: 레코드 & 패턴매칭
---

## 레코드(Records)

레코드는 Dart 3.0에서 도입된 새로운 컬렉션 타입으로, 여러 필드를 그룹화하여 단일 객체로 전달할 수 있게 해줍니다. 클래스와 달리 명시적인 정의가 필요 없고, 불변(immutable)이며, 구조적으로 타입이 지정됩니다.

### 레코드 기본

레코드는 괄호(`()`)를 사용하여 생성하며, 쉼표로 구분된 여러 값을 담을 수 있습니다:

```dart
// 간단한 레코드
var person = ('홍길동', 30);
print(person);  // (홍길동, 30)

// 위치 기반 필드 접근
print(person.$1);  // 홍길동
print(person.$2);  // 30
```

### 명명된 필드가 있는 레코드

레코드에 이름이 있는 필드를 포함할 수 있습니다:

```dart
// 명명된 필드가 있는 레코드
var person = (name: '홍길동', age: 30);

// 명명된 필드 접근
print(person.name);  // 홍길동
print(person.age);   // 30

// 혼합 사용
var data = ('홍길동', age: 30, active: true);
print(data.$1);      // 홍길동
print(data.age);     // 30
print(data.active);  // true
```

### 레코드 타입 지정

레코드에 명시적인 타입을 지정할 수 있습니다:

```dart
// 타입이 명시된 레코드
(String, int) person = ('홍길동', 30);

// 명명된 필드가 있는 레코드 타입
({String name, int age}) person = (name: '홍길동', age: 30);

// 혼합 타입
(String, {int age, bool active}) data = ('홍길동', age: 30, active: true);
```

### 레코드의 유용성

#### 1. 여러 값 반환

함수에서 여러 값을 반환할 때 유용합니다:

```dart
// 여러 값 반환
(String, int) getUserInfo() {
  return ('홍길동', 30);
}

void main() {
  var (name, age) = getUserInfo();
  print('이름: $name, 나이: $age');  // 이름: 홍길동, 나이: 30
}
```

#### 2. 구조 분해 할당

레코드는 구조 분해 할당을 지원합니다:

```dart
var person = (name: '홍길동', age: 30);

// 구조 분해
var (name: userName, age: userAge) = person;
print('이름: $userName, 나이: $userAge');  // 이름: 홍길동, 나이: 30

// 간단한 구조 분해
var (:name, :age) = person;
print('이름: $name, 나이: $age');  // 이름: 홍길동, 나이: 30
```

#### 3. 그룹화된 데이터 전달

여러 값을 그룹화하여 전달할 때 유용합니다:

```dart
void printPersonInfo((String, int) person) {
  print('이름: ${person.$1}, 나이: ${person.$2}');
}

void printUserDetails({String name, int age, String? address}) {
  print('이름: $name, 나이: $age, 주소: ${address ?? '정보 없음'}');
}

void main() {
  printPersonInfo(('홍길동', 30));  // 이름: 홍길동, 나이: 30

  var userDetails = (name: '김철수', age: 25, address: '서울시');
  printUserDetails(userDetails);  // 이름: 김철수, 나이: 25, 주소: 서울시
}
```

### 레코드 비교

레코드는 값 기반 비교를 지원합니다:

```dart
void main() {
  var person1 = (name: '홍길동', age: 30);
  var person2 = (name: '홍길동', age: 30);
  var person3 = (name: '김철수', age: 25);

  print(person1 == person2);  // true (동일한 값)
  print(person1 == person3);  // false (다른 값)

  // 위치 기반 레코드도 같음
  var p1 = ('홍길동', 30);
  var p2 = ('홍길동', 30);
  print(p1 == p2);  // true
}
```

### 레코드 사용 예제

#### 1. 통계 계산

```dart
(double min, double max, double average) calculateStats(List<double> values) {
  if (values.isEmpty) {
    return (0, 0, 0);
  }
  double sum = 0;
  double min = values[0];
  double max = values[0];

  for (var value in values) {
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return (min, max, sum / values.length);
}

void main() {
  var numbers = [10.5, 25.3, 17.2, 8.7, 30.1];
  var (min, max, avg) = calculateStats(numbers);

  print('최소값: $min');   // 최소값: 8.7
  print('최대값: $max');   // 최대값: 30.1
  print('평균값: $avg');   // 평균값: 18.36
}
```

#### 2. API 응답 처리

```dart
(bool success, {String? data, String? error}) fetchUserData(String userId) {
  // 서버 요청 시뮬레이션
  if (userId == 'user123') {
    return (true, data: '{"name": "홍길동", "email": "hong@example.com"}', error: null);
  } else {
    return (false, data: null, error: '사용자를 찾을 수 없습니다.');
  }
}

void main() {
  // 성공 케이스
  var (success: isSuccess, data: userData, error: _) = fetchUserData('user123');

  if (isSuccess && userData != null) {
    print('사용자 데이터: $userData');
  }

  // 실패 케이스
  var result = fetchUserData('unknown');

  if (!result.success) {
    print('오류: ${result.error}');  // 오류: 사용자를 찾을 수 없습니다.
  }
}
```

## 패턴 매칭(Pattern Matching)

패턴 매칭은 Dart 3.0에서 도입된 기능으로, 데이터 구조에서 특정 패턴을 검색하고 추출하는 강력한 방법을 제공합니다.

### 패턴 매칭 기본

패턴 매칭을 사용하면 복잡한 데이터 구조에서 데이터를 쉽게 추출하고 검사할 수 있습니다:

```dart
// 레코드 패턴 매칭
var person = ('홍길동', 30);

var (name, age) = person;
print('이름: $name, 나이: $age');  // 이름: 홍길동, 나이: 30

// 리스트 패턴 매칭
var numbers = [1, 2, 3];

var [first, second, third] = numbers;
print('$first, $second, $third');  // 1, 2, 3

// 맵 패턴 매칭
var user = {'name': '홍길동', 'age': 30};

var {'name': userName, 'age': userAge} = user;
print('이름: $userName, 나이: $userAge');  // 이름: 홍길동, 나이: 30
```

### switch 문에서의 패턴 매칭

패턴 매칭은 `switch` 문에서 특히 강력합니다:

```dart
void describe(Object obj) {
  switch (obj) {
    case int i when i > 0:
      print('양수: $i');
    case int i when i < 0:
      print('음수: $i');
    case int i when i == 0:
      print('0');
    case String s when s.isEmpty:
      print('빈 문자열');
    case String s:
      print('문자열: $s');
    case List<int> list:
      print('정수 리스트: $list');
    case (String, int) pair:
      print('문자열-정수 쌍: ${pair.$1}, ${pair.$2}');
    case (String name, int age):
      print('이름: $name, 나이: $age');
    default:
      print('기타 객체: $obj');
  }
}

void main() {
  describe(42);             // 양수: 42
  describe(-10);            // 음수: -10
  describe(0);              // 0
  describe('');             // 빈 문자열
  describe('안녕하세요');      // 문자열: 안녕하세요
  describe([1, 2, 3]);      // 정수 리스트: [1, 2, 3]
  describe(('홍길동', 30));   // 이름: 홍길동, 나이: 30
  describe(true);           // 기타 객체: true
}
```

### if-case 문

패턴 매칭은 `if-case` 문에서도 사용할 수 있습니다:

```dart
void processValue(Object value) {
  if (value case String s when s.length > 5) {
    print('긴 문자열: $s');
  } else if (value case int n when n > 10) {
    print('큰 정수: $n');
  } else if (value case (String name, int age)) {
    print('이름: $name, 나이: $age');
  } else {
    print('처리할 수 없는 값: $value');
  }
}

void main() {
  processValue('안녕하세요, 반갑습니다');  // 긴 문자열: 안녕하세요, 반갑습니다
  processValue(42);                  // 큰 정수: 42
  processValue(('홍길동', 30));        // 이름: 홍길동, 나이: 30
  processValue(true);                // 처리할 수 없는 값: true
}
```

### 논리 OR 패턴

여러 패턴을 `|` 연산자로 결합할 수 있습니다:

```dart
Object value = 42;

switch (value) {
  case String s | int i:
    print('문자열 또는 정수: $value');
  case List<dynamic> l | Map<dynamic, dynamic> m:
    print('리스트 또는 맵');
  default:
    print('기타 타입');
}
```

### 중첩 패턴 매칭

패턴은 중첩될 수 있어 복잡한 데이터 구조에서도 사용할 수 있습니다:

```dart
// 복잡한 데이터 구조
var person = {
  'name': '홍길동',
  'age': 30,
  'address': {
    'city': '서울',
    'zipcode': '12345'
  },
  'hobbies': ['독서', '여행', '음악']
};

// 중첩 패턴 매칭
if (person case {'name': String name, 'address': {'city': String city}}) {
  print('$name은(는) $city에 살고 있습니다.');  // 홍길동은(는) 서울에 살고 있습니다.
}

// 리스트와 레코드의 중첩 패턴
var data = [('홍길동', 30), ('김철수', 25)];

if (data case [(String s, int i), var rest]) {
  print('첫 번째 사람: $s, $i살');  // 첫 번째 사람: 홍길동, 30살
  print('나머지: $rest');         // 나머지: (김철수, 25)
}
```

### var 패턴과 와일드카드 패턴

변수에 값을 캡처하거나 값을 무시할 수 있습니다:

```dart
// var 패턴 (값 캡처)
var list = [1, 2, 3, 4, 5];

if (list case [var first, var second, ...]) {
  print('처음 두 값: $first, $second');  // 처음 두 값: 1, 2
}

// 와일드카드 패턴 (값 무시)
var record = ('홍길동', 30, '서울');

if (record case (String name, _, var city)) {
  print('$name은(는) $city에 살고 있습니다.');  // 홍길동은(는) 서울에 살고 있습니다.
}
```

### 일정한 리스트 패턴

리스트의 특정 위치에 있는 값을 추출할 수 있습니다:

```dart
var numbers = [1, 2, 3, 4, 5];

switch (numbers) {
  case [var first, var second, ...var rest]:
    print('첫 번째: $first');   // 첫 번째: 1
    print('두 번째: $second');  // 두 번째: 2
    print('나머지: $rest');     // 나머지: [3, 4, 5]
  default:
    print('빈 리스트 또는 다른 형태');
}

// 특정 패턴 검색
var list = [1, 2, 3, 4, 5];

if (list case [_, _, 3, ..., 5]) {
  print('리스트가 패턴과 일치합니다.');  // 리스트가 패턴과 일치합니다.
}
```

### 객체 패턴

클래스 인스턴스의 속성을 추출할 수도 있습니다:

```dart
class Person {
  final String name;
  final int age;

  Person(this.name, this.age);
}

void describePerson(Person person) {
  switch (person) {
    case Person(name: 'Unknown', age: var a):
      print('알 수 없는 사람, 나이: $a');
    case Person(name: var n, age: > 18):
      print('성인: $n');
    case Person(name: var n):
      print('미성년자: $n');
  }
}

void main() {
  describePerson(Person('홍길동', 30));  // 성인: 홍길동
  describePerson(Person('김영희', 15));  // 미성년자: 김영희
}
```

### 타입 패턴과 조건 패턴

```dart
void process(dynamic value) {
  switch (value) {
    // 타입 패턴
    case int():
      print('정수: $value');

    // 타입 패턴과 조건 패턴
    case String() when value.length > 5:
      print('긴 문자열: $value');
    case String():
      print('짧은 문자열: $value');

    // 리스트 + 조건 패턴
    case List<int> l when l.every((e) => e > 0):
      print('양수 리스트: $value');

    // 레코드 + 조건 패턴
    case (String n, int a) when a >= 18:
      print('성인: $n, $a살');
    case (String n, int a):
      print('미성년자: $n, $a살');

    default:
      print('기타 값: $value');
  }
}

void main() {
  process(42);                 // 정수: 42
  process('Hello');            // 짧은 문자열: Hello
  process('안녕하세요, 반갑습니다');  // 긴 문자열: 안녕하세요, 반갑습니다
  process([1, 2, 3]);          // 양수 리스트: [1, 2, 3]
  process([-1, 2, 3]);         // 기타 값: [-1, 2, 3]
  process(('홍길동', 30));       // 성인: 홍길동, 30살
  process(('김영희', 15));       // 미성년자: 김영희, 15살
}
```

## 실전 예제

### 1. REST API 응답 처리

```dart
// API 응답 시뮬레이션
Map<String, dynamic> fetchUserResponse() {
  return {
    'status': 'success',
    'data': {
      'user': {
        'id': 123,
        'name': '홍길동',
        'email': 'hong@example.com',
        'addresses': [
          {'type': 'home', 'city': '서울', 'zipcode': '12345'},
          {'type': 'work', 'city': '부산', 'zipcode': '67890'},
        ]
      }
    }
  };
}

void main() {
  var response = fetchUserResponse();

  // 패턴 매칭으로 응답 처리
  switch (response) {
    case {'status': 'success', 'data': {'user': var user}}:
      if (user case {'name': String name, 'email': String email, 'addresses': var addresses}) {
        print('사용자 이름: $name, 이메일: $email');

        if (addresses case List<Map<String, dynamic>> addressList) {
          for (var address in addressList) {
            if (address case {'type': 'home', 'city': String city}) {
              print('집 주소: $city');
            }
          }
        }
      }
    case {'status': 'error', 'message': String message}:
      print('오류: $message');
    default:
      print('알 수 없는 응답');
  }
}
```

### 2. 데이터 변환 및 검증

```dart
// 데이터 변환 및 검증
(bool isValid, {String? data, String? error}) validateUserData(Object input) {
  return switch (input) {
    Map<String, dynamic> map when map.containsKey('name') && map.containsKey('age') =>
      map['age'] is int && map['age'] > 0
        ? (true, data: '유효한 사용자 데이터', error: null)
        : (false, data: null, error: '나이는 양의 정수여야 합니다.'),

    (String name, var age) when age is int && age > 0 =>
      (true, data: '유효한 사용자 레코드', error: null),

    String s when RegExp(r'^[a-zA-Z0-9]+,\s*\d+$').hasMatch(s) =>
      (true, data: '유효한 사용자 문자열', error: null),

    _ =>
      (false, data: null, error: '지원하지 않는 형식')
  };
}

void main() {
  // 다양한 입력 형식 테스트
  var result1 = validateUserData({'name': '홍길동', 'age': 30});
  var result2 = validateUserData(('김철수', 25));
  var result3 = validateUserData('이영희, 20');
  var result4 = validateUserData({'name': '박지성', 'age': -5});
  var result5 = validateUserData(42);

  for (var result in [result1, result2, result3, result4, result5]) {
    if (result.isValid) {
      print('검증 성공: ${result.data}');
    } else {
      print('검증 실패: ${result.error}');
    }
  }
}
```

## 결론

레코드와 패턴 매칭은 Dart 3에서 도입된 강력한 기능으로, 코드를 더 간결하고 표현력 있게 만들 수 있습니다. 레코드는 여러 값을 그룹화하고 반환하는 간편한 방법을 제공하며, 패턴 매칭은 복잡한 데이터 구조에서 값을 쉽게 추출하고 분석할 수 있게 해줍니다.

이러한 기능은 다음과 같은 상황에서 특히 유용합니다:

- 함수에서 여러 값 반환
- 데이터 구조에서 특정 패턴 검색
- 조건부 로직 간소화
- API 응답 처리
- 데이터 변환 및 검증

Dart의 레코드와 패턴 매칭을 활용하면 더 선언적이고 안전한 코드를 작성할 수 있으며, 이는 Flutter 애플리케이션에서도 큰 도움이 됩니다.

다음 장에서는 Dart의 비동기 프로그래밍에 대해 알아보겠습니다.
