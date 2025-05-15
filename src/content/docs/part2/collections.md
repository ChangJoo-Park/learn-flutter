---
title: 컬렉션과 반복문
---

Dart는 데이터를 저장하고 조작하기 위한 다양한 컬렉션 타입과 반복문을 제공합니다. 이 장에서는 Dart의 컬렉션 타입(List, Set, Map)과 이를 처리하기 위한 다양한 반복문 및 반복 연산을 알아보겠습니다.

<Aside type="tip">

아래 내용 외에 컬렉션 타입을 조작하는 일이 잦은 경우 [collection](https://pub.dev/packages/collection) 패키지를 사용하세요.

```sh
dart pub add collection
```

</Aside>


## 컬렉션 타입

### 1. List (리스트)

List는 순서가 있는 항목의 집합으로, 다른 언어의 배열과 유사합니다.

#### 리스트 생성

```dart
// 리터럴을 사용한 생성
var fruits = ['사과', '바나나', '오렌지'];

// 타입을 지정한 리스트
List<String> names = ['홍길동', '김철수', '이영희'];

// 빈 리스트 생성
var emptyList = <int>[];

// 생성자를 이용한 리스트 생성
var fixedList = List<int>.filled(5, 0); // [0, 0, 0, 0, 0]
var growableList = List<int>.empty(growable: true);
var generatedList = List<int>.generate(5, (i) => i * i); // [0, 1, 4, 9, 16]
```

#### 리스트 접근 및 조작

```dart
var fruits = ['사과', '바나나', '오렌지', '딸기', '포도'];

// 인덱스로 접근
print(fruits[0]); // 사과

// 길이 확인
print(fruits.length); // 5

// 첫 번째와 마지막 항목
print(fruits.first); // 사과
print(fruits.last); // 포도

// 추가
fruits.add('키위');
print(fruits); // [사과, 바나나, 오렌지, 딸기, 포도, 키위]

// 여러 항목 추가
fruits.addAll(['멜론', '수박']);
print(fruits); // [사과, 바나나, 오렌지, 딸기, 포도, 키위, 멜론, 수박]

// 삭제
fruits.remove('바나나');
print(fruits); // [사과, 오렌지, 딸기, 포도, 키위, 멜론, 수박]

// 인덱스로 삭제
fruits.removeAt(1);
print(fruits); // [사과, 딸기, 포도, 키위, 멜론, 수박]

// 조건으로 삭제
fruits.removeWhere((fruit) => fruit.length <= 2);
print(fruits); // [사과, 딸기, 포도, 키위, 멜론, 수박]

// 정렬
fruits.sort();
print(fruits); // [딸기, 멜론, 사과, 수박, 포도, 키위]

// 인덱스 찾기
print(fruits.indexOf('포도')); // 4

// 존재 여부 확인
print(fruits.contains('사과')); // true
print(fruits.contains('바나나')); // false
```

#### 리스트 변환

```dart
var numbers = [1, 2, 3, 4, 5];

// 매핑 (각 요소 변환)
var doubled = numbers.map((n) => n * 2).toList();
print(doubled); // [2, 4, 6, 8, 10]

// 필터링 (조건에 맞는 요소만 선택)
var evenNumbers = numbers.where((n) => n.isEven).toList();
print(evenNumbers); // [2, 4]

// fold (누적 연산)
var sum = numbers.fold<int>(0, (prev, curr) => prev + curr);
print(sum); // 15

// reduce (항목들을 하나로 결합)
var product = numbers.reduce((a, b) => a * b);
print(product); // 120

// 평탄화 (중첩 리스트를 단일 리스트로)
var nested = [[1, 2], [3, 4], [5]];
var flattened = nested.expand((list) => list).toList();
print(flattened); // [1, 2, 3, 4, 5]
```

#### 리스트 슬라이싱과 세부 조작

```dart
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 범위 추출 (sublist)
var slice = numbers.sublist(2, 5);
print(slice); // [3, 4, 5]

// 리스트 복사
var copy = List<int>.from(numbers);
print(copy); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 모든 요소 바꾸기
numbers.replaceRange(0, 3, [99, 98, 97]);
print(numbers); // [99, 98, 97, 4, 5, 6, 7, 8, 9, 10]

// 뒤집기
var reversed = numbers.reversed.toList();
print(reversed); // [10, 9, 8, 7, 6, 5, 4, 97, 98, 99]

// 리스트의 특정 부분 채우기
numbers.fillRange(5, 8, 0);
print(numbers); // [99, 98, 97, 4, 5, 0, 0, 0, 9, 10]
```

### 2. Set (집합)

Set은 중복되지 않는 항목의 컬렉션입니다.

#### 집합 생성

```dart
// 리터럴을 사용한 생성
var fruits = {'사과', '바나나', '오렌지'};

// 타입을 지정한 집합
Set<String> names = {'홍길동', '김철수', '이영희'};

// 빈 집합 생성
var emptySet = <int>{};

// 리스트에서 생성 (중복 제거됨)
var numbers = Set<int>.from([1, 2, 2, 3, 3, 3, 4, 5, 5]);
print(numbers); // {1, 2, 3, 4, 5}
```

#### 집합 연산

```dart
var set1 = {1, 2, 3, 4, 5};
var set2 = {4, 5, 6, 7, 8};

// 합집합
var union = set1.union(set2);
print(union); // {1, 2, 3, 4, 5, 6, 7, 8}

// 교집합
var intersection = set1.intersection(set2);
print(intersection); // {4, 5}

// 차집합
var difference = set1.difference(set2);
print(difference); // {1, 2, 3}

// 요소 추가
set1.add(6);
print(set1); // {1, 2, 3, 4, 5, 6}

// 여러 요소 추가
set1.addAll({7, 8, 9});
print(set1); // {1, 2, 3, 4, 5, 6, 7, 8, 9}

// 요소 삭제
set1.remove(9);
print(set1); // {1, 2, 3, 4, 5, 6, 7, 8}

// 존재 여부 확인
print(set1.contains(5)); // true
print(set1.contains(10)); // false

// 부분집합 확인
print({1, 2}.isSubsetOf(set1)); // true
print(set1.isSupersetOf({1, 2})); // true
```

#### 집합 변환 및 조작

```dart
var numbers = {1, 2, 3, 4, 5};

// 매핑 (집합으로 변환)
var doubled = numbers.map((n) => n * 2).toSet();
print(doubled); // {2, 4, 6, 8, 10}

// 필터링
var evenNumbers = numbers.where((n) => n.isEven).toSet();
print(evenNumbers); // {2, 4}

// 리스트로 변환
var numbersList = numbers.toList();
print(numbersList); // [1, 2, 3, 4, 5] (순서는 보장되지 않음)
```

### 3. Map (맵)

Map은 키-값 쌍의 컬렉션으로, 키를 사용하여 값을 검색할 수 있습니다.

#### 맵 생성

```dart
// 리터럴을 사용한 생성
var person = {
  'name': '홍길동',
  'age': 30,
  'isStudent': false
};

// 타입을 지정한 맵
Map<String, int> scores = {
  '수학': 90,
  '영어': 85,
  '과학': 95
};

// 빈 맵 생성
var emptyMap = <String, dynamic>{};

// 생성자를 이용한 맵 생성
var map1 = Map<String, int>();
var map2 = Map.from({'a': 1, 'b': 2});
var map3 = Map.of({'x': 10, 'y': 20});
```

#### 맵 접근 및 조작

```dart
var person = {
  'name': '홍길동',
  'age': 30,
  'isStudent': false
};

// 값 접근
print(person['name']); // 홍길동

// 키 확인
print(person.containsKey('age')); // true
print(person.containsKey('email')); // false

// 값 확인
print(person.containsValue(30)); // true
print(person.containsValue('김철수')); // false

// 키 목록과 값 목록
print(person.keys.toList()); // [name, age, isStudent]
print(person.values.toList()); // [홍길동, 30, false]

// 항목 추가/업데이트
person['email'] = 'hong@example.com';
person['age'] = 31;
print(person); // {name: 홍길동, age: 31, isStudent: false, email: hong@example.com}

// 항목 삭제
person.remove('isStudent');
print(person); // {name: 홍길동, age: 31, email: hong@example.com}

// 여러 항목 추가
person.addAll({
  'address': '서울시',
  'phone': '010-1234-5678'
});
print(person);
// {name: 홍길동, age: 31, email: hong@example.com, address: 서울시, phone: 010-1234-5678}

// 조건부 추가
person.putIfAbsent('gender', () => '남성');
print(person);
// {name: 홍길동, age: 31, email: hong@example.com, address: 서울시, phone: 010-1234-5678, gender: 남성}

// 이미 있는 키에는 추가되지 않음
person.putIfAbsent('gender', () => '여성');
print(person['gender']); // 남성 (변경되지 않음)
```

#### 맵 변환 및 조작

```dart
var scores = {
  '수학': 90,
  '영어': 85,
  '과학': 95,
  '국어': 80
};

// 매핑 변환
var scaledScores = scores.map((k, v) => MapEntry(k, v * 1.1));
print(scaledScores);
// {수학: 99.0, 영어: 93.5, 과학: 104.5, 국어: 88.0}

// 필터링
var highScores = scores.entries
    .where((entry) => entry.value >= 90)
    .fold(<String, int>{}, (map, entry) {
  map[entry.key] = entry.value;
  return map;
});
print(highScores); // {수학: 90, 과학: 95}

// forEach로 처리
scores.forEach((key, value) {
  print('$key: $value');
});
// 수학: 90
// 영어: 85
// 과학: 95
// 국어: 80
```

## 반복문

Dart는 컬렉션과 다른 이터러블(iterable) 객체를 처리하기 위한 다양한 반복문을 제공합니다.

### 1. for 반복문

#### 기본 for 반복문

```dart
// 기본 for 루프
for (int i = 0; i < 5; i++) {
  print(i); // 0, 1, 2, 3, 4
}

// 복잡한 조건과 증가식
for (int i = 10; i > 0; i -= 2) {
  print(i); // 10, 8, 6, 4, 2
}
```

#### for-in 반복문

```dart
var fruits = ['사과', '바나나', '오렌지'];

// 컬렉션 항목 반복
for (var fruit in fruits) {
  print(fruit); // 사과, 바나나, 오렌지
}

// 인덱스가 필요한 경우
for (int i = 0; i < fruits.length; i++) {
  print('${i + 1}번째 과일: ${fruits[i]}');
}
// 1번째 과일: 사과
// 2번째 과일: 바나나
// 3번째 과일: 오렌지
```

### 2. while과 do-while 반복문

```dart
// while 반복문
int count = 0;
while (count < 5) {
  print(count);
  count++;
}
// 0, 1, 2, 3, 4

// do-while 반복문 (최소 한 번은 실행됨)
int num = 5;
do {
  print(num);
  num--;
} while (num > 0);
// 5, 4, 3, 2, 1
```

### 3. forEach 메서드

```dart
var numbers = [1, 2, 3, 4, 5];

// 리스트의 forEach
numbers.forEach((number) {
  print(number * 2); // 2, 4, 6, 8, 10
});

// 맵의 forEach
var scores = {'수학': 90, '영어': 85, '과학': 95};
scores.forEach((subject, score) {
  print('$subject: $score점');
  // 수학: 90점
  // 영어: 85점
  // 과학: 95점
});
```

### 4. 반복 제어

```dart
// break로 반복 중단
for (int i = 0; i < 10; i++) {
  if (i == 5) break;
  print(i); // 0, 1, 2, 3, 4
}

// continue로 현재 반복 건너뛰기
for (int i = 0; i < 5; i++) {
  if (i == 2) continue;
  print(i); // 0, 1, 3, 4
}

// 레이블을 사용한 중첩 반복문 제어
outerLoop: for (int i = 0; i < 3; i++) {
  for (int j = 0; j < 3; j++) {
    if (i == 1 && j == 1) {
      break outerLoop; // 바깥 반복문까지 중단
    }
    print('$i, $j');
    // 0, 0
    // 0, 1
    // 0, 2
    // 1, 0
  }
}
```

## 컬렉션 처리 기법

### 1. 컬렉션 for와 if

Dart에서는 컬렉션 리터럴 내에 for 루프와 if 조건을 삽입할 수 있습니다.

```dart
// 컬렉션 for
var numbers = [1, 2, 3];
var doubled = [
  0,
  for (var n in numbers) n * 2,
  4
];
print(doubled); // [0, 2, 4, 6, 4]

// 컬렉션 if
bool includeZ = true;
var letters = ['a', 'b', if (includeZ) 'z'];
print(letters); // [a, b, z]

// 복합 사용
var items = [
  'home',
  if (userLoggedIn) 'profile',
  for (var item in defaultItems) item,
  if (isAdmin) 'admin'
];
```

### 2. 스프레드 연산자

스프레드 연산자(`...`)를 사용하여 컬렉션을 다른 컬렉션에 삽입할 수 있습니다.

```dart
var list1 = [1, 2, 3];
var list2 = [0, ...list1, 4, 5];
print(list2); // [0, 1, 2, 3, 4, 5]

// null 조건부 스프레드 연산자 (...?)
List<int>? nullableList;
var combined = [0, ...?nullableList, 1];
print(combined); // [0, 1]

// 맵에 사용
var map1 = {'a': 1, 'b': 2};
var map2 = {'c': 3, ...map1};
print(map2); // {c: 3, a: 1, b: 2}

// 집합에 사용
var set1 = {1, 2, 3};
var set2 = {0, ...set1, 4};
print(set2); // {0, 1, 2, 3, 4}
```

### 3. 제너레이터 함수

제너레이터 함수는 값의 시퀀스를 생성할 수 있습니다. Dart는 두 가지 유형의 제너레이터 함수를 지원합니다.

#### 동기 제너레이터 (sync\*)

`sync*`는 Iterable 객체를 생성합니다:

```dart
Iterable<int> getNumbers(int n) sync* {
  for (int i = 0; i < n; i++) {
    yield i;
  }
}

void main() {
  for (var num in getNumbers(5)) {
    print(num); // 0, 1, 2, 3, 4
  }
}
```

#### 비동기 제너레이터 (async\*)

`async*`는 Stream 객체를 생성합니다:

```dart
Stream<int> countStream(int n) async* {
  for (int i = 1; i <= n; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}

void main() async {
  await for (var num in countStream(5)) {
    print(num); // 1초마다 1, 2, 3, 4, 5 출력
  }
}
```

### 4. 고급 컬렉션 변환 기법

```dart
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// 연속 변환
var result = numbers
    .where((n) => n % 2 == 0) // 짝수만 선택
    .map((n) => n * n) // 제곱
    .takeWhile((n) => n <= 36) // 36 이하인 동안만
    .fold(0, (sum, n) => sum + n); // 합계 계산

print(result); // 4 + 16 + 36 = 56

// 그룹화
var fruits = ['사과', '바나나', '체리', '블루베리', '아보카도'];
var byFirstLetter = fruits.fold<Map<String, List<String>>>(
  {},
  (map, fruit) {
    var firstLetter = fruit[0];
    map[firstLetter] = (map[firstLetter] ?? [])..add(fruit);
    return map;
  },
);

print(byFirstLetter);
// {사: [사과], 바: [바나나], 체: [체리], 블: [블루베리], 아: [아보카도]}
```

## Dart 2.3 이상의 컬렉션 관련 기능

### 1. cascade notation (연쇄 표기법)

연쇄 표기법(`..`)을 사용하면 동일한 객체에서 연속적인 작업을 수행할 수 있습니다:

```dart
var list = [1, 2, 3]
  ..add(4)
  ..addAll([5, 6])
  ..remove(2)
  ..sort();

print(list); // [1, 3, 4, 5, 6]

// 중첩 객체에도 사용 가능
var map = {'user': {'name': '홍길동', 'age': 30}}
  ..['user']['email'] = 'hong@example.com'
  ..['user']['age'] = 31
  ..['active'] = true;

print(map);
// {user: {name: 홍길동, age: 31, email: hong@example.com}, active: true}
```

### 2. null-aware 연산자와 컬렉션

null-aware 연산자를 사용하면 null 처리가 더 간결해집니다:

```dart
// ?. 연산자 (null인 경우 실행하지 않음)
List<String>? nullableList;
nullableList?.add('항목'); // nullableList가 null이면 아무 일도 일어나지 않음

// ?? 연산자 (null인 경우 기본값 제공)
var list = nullableList ?? [];
list.add('항목');
print(list); // [항목]

// ??= 연산자 (null인 경우에만 값 할당)
Map<String, int>? scoresMap;
scoresMap ??= {};
scoresMap['수학'] = 90;
print(scoresMap); // {수학: 90}
```

## 실전 예제

### 1. 데이터 변환 파이프라인

```dart
class Student {
  final String name;
  final int age;
  final Map<String, int> scores;

  Student(this.name, this.age, this.scores);
}

void main() {
  final students = [
    Student('홍길동', 20, {'수학': 90, '영어': 85, '과학': 95}),
    Student('김철수', 22, {'수학': 75, '영어': 90, '과학': 85}),
    Student('이영희', 21, {'수학': 85, '영어': 92, '과학': 88}),
    Student('박민수', 23, {'수학': 95, '영어': 80, '과학': 92}),
  ];

  // 각 학생의 평균 점수 계산
  final averageScores = students.map((student) {
    final total = student.scores.values.fold<int>(0, (sum, score) => sum + score);
    final average = total / student.scores.length;
    return {'name': student.name, 'average': average};
  }).toList();

  print('평균 점수:');
  for (var item in averageScores) {
    print('${item['name']}: ${item['average']}');
  }

  // 평균 90점 이상인 학생
  final highPerformers = students.where((student) {
    final total = student.scores.values.fold<int>(0, (sum, score) => sum + score);
    final average = total / student.scores.length;
    return average >= 90;
  }).map((student) => student.name).toList();

  print('\n우수 학생: $highPerformers');

  // 과목별 최고 점수 및 학생
  final subjects = {'수학', '영어', '과학'};

  final topScoresBySubject = subjects.fold<Map<String, Map<String, dynamic>>>(
    {},
    (map, subject) {
      var topStudent = students.reduce((a, b) =>
          (a.scores[subject] ?? 0) > (b.scores[subject] ?? 0) ? a : b);

      map[subject] = {
        'student': topStudent.name,
        'score': topStudent.scores[subject]
      };
      return map;
    },
  );

  print('\n과목별 최고 점수:');
  topScoresBySubject.forEach((subject, data) {
    print('$subject: ${data['student']} (${data['score']}점)');
  });
}
```

### 2. 복잡한 필터링과 정렬

```dart
class Product {
  final String id;
  final String name;
  final double price;
  final List<String> categories;
  final bool inStock;

  Product(this.id, this.name, this.price, this.categories, this.inStock);
}

void main() {
  final products = [
    Product('p1', '스마트폰', 850000, ['전자제품', '통신기기'], true),
    Product('p2', '노트북', 1200000, ['전자제품', '컴퓨터'], false),
    Product('p3', '헤드폰', 120000, ['전자제품', '오디오'], true),
    Product('p4', '키보드', 98000, ['전자제품', '컴퓨터', '주변기기'], true),
    Product('p5', '마우스', 45000, ['전자제품', '컴퓨터', '주변기기'], true),
    Product('p6', '모니터', 550000, ['전자제품', '컴퓨터', '주변기기'], false),
  ];

  // 1. 재고가 있는 제품만 필터링
  final inStockProducts = products.where((p) => p.inStock).toList();

  // 2. 컴퓨터 관련 제품만 필터링
  final computerProducts = products
      .where((p) => p.categories.contains('컴퓨터'))
      .toList();

  // 3. 가격 기준 정렬 (오름차순)
  final sortedByPrice = List<Product>.from(products)
    ..sort((a, b) => a.price.compareTo(b.price));

  // 4. 복합 필터: 재고 있는 주변기기 중 가격이 100,000원 미만인 제품
  final affordablePeripherals = products
      .where((p) => p.inStock &&
                    p.categories.contains('주변기기') &&
                    p.price < 100000)
      .toList();

  // 5. 카테고리별 제품 그룹화
  final productsByCategory = <String, List<Product>>{};

  for (var product in products) {
    for (var category in product.categories) {
      productsByCategory[category] ??= [];
      productsByCategory[category]!.add(product);
    }
  }

  // 결과 출력
  print('재고 있는 제품: ${inStockProducts.map((p) => p.name).toList()}');
  print('컴퓨터 관련 제품: ${computerProducts.map((p) => p.name).toList()}');
  print('저렴한 주변기기: ${affordablePeripherals.map((p) => p.name).toList()}');

  print('\n카테고리별 제품:');
  productsByCategory.forEach((category, categoryProducts) {
    print('$category: ${categoryProducts.map((p) => p.name).toList()}');
  });
}
```

## 결론

Dart의 컬렉션과 반복문은 강력하고 유연한 도구를 제공하여 데이터를 효율적으로 처리할 수 있게 해줍니다. List, Set, Map과 같은 기본 컬렉션 타입은 다양한 메서드를 제공하며, 컬렉션 for, 스프레드 연산자, 제너레이터 함수 등의 기능은 복잡한 데이터 처리 작업을 간결하게 표현할 수 있게 해줍니다.

다음 장에서는 Dart의 예외 처리에 대해 알아보겠습니다.
