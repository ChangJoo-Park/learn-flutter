---
title: 클래스, 생성자, 팩토리
---

## 클래스 기본

Dart는 완전한 객체 지향 언어로, 클래스와 객체 개념을 중심으로 설계되었습니다. Dart에서 모든 것이 객체이며, 모든 객체는 클래스의 인스턴스입니다.

### 클래스 정의하기

```dart
class Person {
  // 필드(속성)
  String name;
  int age;

  // 생성자
  Person(this.name, this.age);

  // 메서드
  void introduce() {
    print('안녕하세요, 저는 $name이고 $age살입니다.');
  }

  // 게터(Getter)
  bool get isAdult => age >= 18;

  // 세터(Setter)
  set setAge(int newAge) {
    if (newAge >= 0) {
      age = newAge;
    }
  }
}

// 클래스 사용 예시
void main() {
  final person = Person('홍길동', 30);
  person.introduce();  // 안녕하세요, 저는 홍길동이고 30살입니다.

  print('성인 여부: ${person.isAdult}');  // 성인 여부: true

  person.setAge = 25;
  print('변경된 나이: ${person.age}');  // 변경된 나이: 25
}
```

### private 멤버

Dart에서는 식별자 앞에 밑줄(`_`)을 붙여 라이브러리 수준에서 private 멤버를 정의합니다. private 멤버는 클래스가 정의된 파일 외부에서 접근할 수 없습니다.

```dart
// person.dart 파일
class Person {
  String name;
  int _age;  // private 필드

  Person(this.name, this._age);

  void introduce() {
    print('안녕하세요, 저는 $name이고 $_age살입니다.');
  }

  int get age => _age;  // private 필드에 접근하는 public 게터

  void _privateMethod() {  // private 메서드
    print('이 메서드는 클래스 내부에서만 호출할 수 있습니다.');
  }

  void publicMethod() {
    _privateMethod();  // private 메서드 호출
  }
}

// main.dart 파일
import 'person.dart';

void main() {
  final person = Person('홍길동', 30);
  print(person.name);  // 홍길동
  print(person.age);   // 30

  // 다음 코드는 컴파일 오류 발생
  // print(person._age);           // 오류: '_age' is not defined
  // person._privateMethod();      // 오류: '_privateMethod' is not defined

  person.publicMethod();  // OK: 클래스 내부에서 private 메서드 호출
}
```

## 생성자

Dart에서는 다양한 방식으로 생성자를 정의할 수 있습니다.

### 기본 생성자

```dart
class Person {
  String name;
  int age;

  // 기본 생성자
  Person(this.name, this.age);
}
```

### 이름이 있는 생성자

한 클래스에 여러 생성자를 정의하고 싶을 때 이름이 있는 생성자를 사용합니다:

```dart
class Person {
  String name;
  int age;

  // 기본 생성자
  Person(this.name, this.age);

  // 이름이 있는 생성자
  Person.guest() {
    name = '손님';
    age = 0;
  }

  Person.child(this.name) {
    age = 10;
  }

  Person.adult(this.name) {
    age = 18;
  }
}

void main() {
  final person1 = Person('홍길동', 30);
  final person2 = Person.guest();
  final person3 = Person.child('아이');
  final person4 = Person.adult('성인');

  print('${person1.name}, ${person1.age}');  // 홍길동, 30
  print('${person2.name}, ${person2.age}');  // 손님, 0
  print('${person3.name}, ${person3.age}');  // 아이, 10
  print('${person4.name}, ${person4.age}');  // 성인, 18
}
```

### 초기화 리스트

생성자 본문이 실행되기 전에 인스턴스 변수를 초기화해야 할 때 초기화 리스트를 사용합니다:

```dart
class Person {
  String name;
  int age;
  final DateTime birthDate;

  // 초기화 리스트 사용
  Person(this.name, this.age)
      : birthDate = DateTime.now().subtract(Duration(days: 365 * age));

  // 여러 필드 초기화
  Person.custom(String userName, int userAge)
      : name = userName.toUpperCase(),
        age = userAge > 0 ? userAge : 0,
        birthDate = DateTime.now().subtract(Duration(days: 365 * userAge));
}
```

### 상수 생성자

인스턴스가 변경 불가능한 객체일 때 상수 생성자를 사용합니다:

```dart
class ImmutablePoint {
  final int x;
  final int y;

  // 상수 생성자
  const ImmutablePoint(this.x, this.y);
}

void main() {
  // 동일한 인스턴스를 참조
  var point1 = const ImmutablePoint(1, 2);
  var point2 = const ImmutablePoint(1, 2);

  print(identical(point1, point2));  // true: 같은 인스턴스

  // 다른 인스턴스
  var point3 = ImmutablePoint(1, 2);  // const 없이 생성
  var point4 = ImmutablePoint(1, 2);

  print(identical(point3, point4));  // false: 다른 인스턴스
}
```

### 리다이렉팅 생성자

한 생성자에서 같은 클래스의 다른 생성자를 호출할 때 리다이렉팅 생성자를 사용합니다:

```dart
class Person {
  String name;
  int age;

  // 주 생성자
  Person(this.name, this.age);

  // 리다이렉팅 생성자
  Person.adult(String name) : this(name, 18);

  Person.child(String name) : this(name, 10);

  Person.fromJson(Map<String, dynamic> json)
      : this(json['name'] as String, json['age'] as int);
}

void main() {
  final person1 = Person.adult('홍길동');
  print('${person1.name}, ${person1.age}');  // 홍길동, 18

  final person2 = Person.fromJson({'name': '김철수', 'age': 25});
  print('${person2.name}, ${person2.age}');  // 김철수, 25
}
```

## 팩토리 생성자

팩토리 생성자는 매번 새 인스턴스를 생성하지 않아도 되는 생성자입니다. 캐싱, 인스턴스 재사용, 하위 클래스 인스턴스 반환 등의 경우에 유용합니다.

```dart
class Logger {
  final String name;

  // 로거 인스턴스 캐시
  static final Map<String, Logger> _cache = <String, Logger>{};

  // private 생성자
  Logger._internal(this.name);

  // 팩토리 생성자
  factory Logger(String name) {
    // 캐시에 이미 있으면 기존 인스턴스 반환
    return _cache.putIfAbsent(
      name,
      () => Logger._internal(name),
    );
  }

  void log(String message) {
    print('[$name] $message');
  }
}

void main() {
  final logger1 = Logger('UI');
  final logger2 = Logger('API');
  final logger3 = Logger('UI');  // 캐시된 인스턴스 재사용

  print(identical(logger1, logger3));  // true: 같은 인스턴스
  print(identical(logger1, logger2));  // false: 다른 인스턴스

  logger1.log('버튼 클릭됨');  // [UI] 버튼 클릭됨
  logger2.log('데이터 로드 중');  // [API] 데이터 로드 중
}
```

### 하위 클래스 인스턴스 반환

팩토리 생성자를 사용하여 조건에 따라 하위 클래스의 인스턴스를 반환할 수 있습니다:

```dart
abstract class Shape {
  // 팩토리 생성자
  factory Shape(String type) {
    switch (type) {
      case 'circle':
        return Circle(10);
      case 'rectangle':
        return Rectangle(10, 20);
      default:
        throw ArgumentError('지원하지 않는 도형 타입: $type');
    }
  }

  double get area;
}

class Circle implements Shape {
  final double radius;

  Circle(this.radius);

  @override
  double get area => 3.14 * radius * radius;
}

class Rectangle implements Shape {
  final double width;
  final double height;

  Rectangle(this.width, this.height);

  @override
  double get area => width * height;
}

void main() {
  final circle = Shape('circle');
  final rectangle = Shape('rectangle');

  print('원 면적: ${circle.area}');  // 원 면적: 314.0
  print('사각형 면적: ${rectangle.area}');  // 사각형 면적: 200.0
}
```

### fromJson 팩토리 생성자

JSON 데이터로부터 객체를 생성하는 패턴은 매우 일반적입니다:

```dart
class User {
  final String name;
  final int age;
  final String email;

  User(this.name, this.age, this.email);

  // JSON에서 User 객체 생성
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      json['name'] as String,
      json['age'] as int,
      json['email'] as String,
    );
  }

  // User 객체를 JSON으로 변환
  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'age': age,
      'email': email,
    };
  }
}

void main() {
  final jsonData = {
    'name': '홍길동',
    'age': 30,
    'email': 'hong@example.com',
  };

  final user = User.fromJson(jsonData);
  print('${user.name}, ${user.age}, ${user.email}');  // 홍길동, 30, hong@example.com

  final json = user.toJson();
  print(json);  // {name: 홍길동, age: 30, email: hong@example.com}
}
```

## 정적 멤버

클래스의 특정 인스턴스가 아닌 클래스 자체에 속하는 멤버를 정의할 때 `static` 키워드를 사용합니다.

```dart
class MathUtils {
  // 정적 상수
  static const double PI = 3.14159;

  // 정적 변수
  static int calculationCount = 0;

  // 정적 메서드
  static double square(double num) {
    calculationCount++;
    return num * num;
  }

  static double cube(double num) {
    calculationCount++;
    return num * num * num;
  }
}

void main() {
  print('원주율: ${MathUtils.PI}');  // 원주율: 3.14159

  final sq = MathUtils.square(5);
  print('5의 제곱: $sq');  // 5의 제곱: 25.0

  final cb = MathUtils.cube(3);
  print('3의 세제곱: $cb');  // 3의 세제곱: 27.0

  print('계산 횟수: ${MathUtils.calculationCount}');  // 계산 횟수: 2
}
```

정적 멤버는 인스턴스를 생성하지 않고도 접근할 수 있으며, 클래스의 모든 인스턴스가 공유합니다.

## 추상 클래스와 인터페이스

### 추상 클래스

추상 클래스는 직접 인스턴스화할 수 없으며, 다른 클래스가 구현해야 하는 메서드와 프로퍼티를 정의합니다.

```dart
abstract class Animal {
  String name;

  Animal(this.name);

  // 추상 메서드 (구현 없음)
  void makeSound();

  // 구현된 메서드
  void sleep() {
    print('$name is sleeping');
  }
}

class Dog extends Animal {
  Dog(String name) : super(name);

  // 추상 메서드 구현
  @override
  void makeSound() {
    print('$name says Woof!');
  }
}

class Cat extends Animal {
  Cat(String name) : super(name);

  @override
  void makeSound() {
    print('$name says Meow!');
  }
}

void main() {
  // Animal animal = Animal('Generic');  // 오류: 추상 클래스는 인스턴스화할 수 없음

  final dog = Dog('Bobby');
  dog.makeSound();  // Bobby says Woof!
  dog.sleep();      // Bobby is sleeping

  final cat = Cat('Whiskers');
  cat.makeSound();  // Whiskers says Meow!
  cat.sleep();      // Whiskers is sleeping
}
```

### 인터페이스

Dart에는 별도의 `interface` 키워드가 없습니다. 모든 클래스가 암묵적으로 인터페이스 역할을 할 수 있습니다. 클래스를 인터페이스로 구현하려면 `implements` 키워드를 사용합니다.

```dart
// 인터페이스 역할을 하는 클래스
class Vehicle {
  void move() {
    print('Vehicle is moving');
  }

  void stop() {
    print('Vehicle stopped');
  }
}

// Vehicle 인터페이스 구현
class Car implements Vehicle {
  @override
  void move() {
    print('Car is driving');
  }

  @override
  void stop() {
    print('Car stopped');
  }
}

class Airplane implements Vehicle {
  @override
  void move() {
    print('Airplane is flying');
  }

  @override
  void stop() {
    print('Airplane landed');
  }
}

void main() {
  final car = Car();
  car.move();  // Car is driving
  car.stop();  // Car stopped

  final airplane = Airplane();
  airplane.move();  // Airplane is flying
  airplane.stop();  // Airplane landed

  // 다형성: Vehicle 인터페이스를 구현한 객체는 Vehicle 타입 변수에 할당 가능
  Vehicle vehicle = Car();
  vehicle.move();  // Car is driving
}
```

## 상속

Dart에서는 `extends` 키워드를 사용하여 클래스를 상속받습니다. Dart는 단일 상속만 지원합니다.

```dart
class Person {
  String name;
  int age;

  Person(this.name, this.age);

  void introduce() {
    print('안녕하세요, 저는 $name이고 $age살입니다.');
  }
}

class Student extends Person {
  String school;

  // 상위 클래스 생성자 호출
  Student(String name, int age, this.school) : super(name, age);

  // 메서드 오버라이드
  @override
  void introduce() {
    super.introduce();  // 상위 클래스 메서드 호출
    print('저는 $school에 다니고 있습니다.');
  }

  // 새로운 메서드 추가
  void study() {
    print('$name이(가) 공부하고 있습니다.');
  }
}

void main() {
  final person = Person('홍길동', 30);
  person.introduce();  // 안녕하세요, 저는 홍길동이고 30살입니다.

  final student = Student('김철수', 20, '서울대학교');
  student.introduce();  // 안녕하세요, 저는 김철수이고 20살입니다.
                        // 저는 서울대학교에 다니고 있습니다.
  student.study();      // 김철수이(가) 공부하고 있습니다.
}
```

## 믹스인(Mixin)

믹스인은 클래스 간에 코드를 재사용하는 방법을 제공합니다. `with` 키워드를 사용하여 믹스인의 기능을 클래스에 추가할 수 있습니다.

```dart
// 믹스인 정의
mixin Swimming {
  void swim() {
    print('수영하고 있습니다.');
  }
}

mixin Flying {
  void fly() {
    print('날고 있습니다.');
  }
}

// 믹스인 사용
class Animal {
  String name;

  Animal(this.name);

  void eat() {
    print('$name이(가) 먹고 있습니다.');
  }
}

class Bird extends Animal with Flying {
  Bird(String name) : super(name);
}

class Fish extends Animal with Swimming {
  Fish(String name) : super(name);
}

class Duck extends Animal with Swimming, Flying {
  Duck(String name) : super(name);
}

void main() {
  final bird = Bird('참새');
  bird.eat();   // 참새이(가) 먹고 있습니다.
  bird.fly();   // 날고 있습니다.

  final fish = Fish('금붕어');
  fish.eat();   // 금붕어이(가) 먹고 있습니다.
  fish.swim();  // 수영하고 있습니다.

  final duck = Duck('오리');
  duck.eat();   // 오리이(가) 먹고 있습니다.
  duck.swim();  // 수영하고 있습니다.
  duck.fly();   // 날고 있습니다.
}
```

믹스인 제한:

```dart
// on 키워드로 믹스인을 특정 클래스에만 사용하도록 제한
mixin CanFly on Bird {
  void fly() {
    print('새처럼 날고 있습니다.');
  }
}

class Bird {
  String name;
  Bird(this.name);
}

class Eagle extends Bird with CanFly {
  Eagle(String name) : super(name);
}

// 다음 코드는 컴파일 오류 발생
// class Airplane with CanFly { }  // 오류: 'on Bird'로 제한됨
```

## 생성자 초기화 패턴

### 기본값과 명명된 매개변수

```dart
class Person {
  String name;
  int age;
  String? address;  // nullable 필드

  // 명명된 매개변수와 기본값
  Person({
    required this.name,
    required this.age,
    this.address,
  });
}

void main() {
  final person1 = Person(name: '홍길동', age: 30);
  final person2 = Person(name: '김철수', age: 25, address: '서울시');
}
```

### 초기화 간소화

```dart
class Point {
  final int x;
  final int y;

  // 간결한 생성자 문법
  const Point(this.x, this.y);

  // 명명된 매개변수
  const Point.origin()
      : x = 0,
        y = 0;
}
```

## 연산자 오버로딩

클래스에 대한 연산자 동작을 재정의할 수 있습니다:

```dart
class Vector {
  final double x;
  final double y;

  const Vector(this.x, this.y);

  // 덧셈 연산자 오버로딩
  Vector operator +(Vector other) {
    return Vector(x + other.x, y + other.y);
  }

  // 뺄셈 연산자 오버로딩
  Vector operator -(Vector other) {
    return Vector(x - other.x, y - other.y);
  }

  // 비교 연산자 오버로딩
  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Vector &&
           other.x == x &&
           other.y == y;
  }

  // hashCode 오버라이드 (== 연산자를 오버라이드할 때 항상 필요)
  @override
  int get hashCode => x.hashCode ^ y.hashCode;

  @override
  String toString() => 'Vector($x, $y)';
}

void main() {
  final v1 = Vector(1, 2);
  final v2 = Vector(3, 4);

  final sum = v1 + v2;
  print(sum);  // Vector(4.0, 6.0)

  final diff = v2 - v1;
  print(diff);  // Vector(2.0, 2.0)

  print(v1 == Vector(1, 2));  // true
  print(v1 == v2);            // false
}
```

## 결론

Dart의 클래스 시스템은 강력하고 유연합니다. 생성자와 팩토리를 통해 다양한 객체 생성 패턴을 구현할 수 있으며, 상속, 믹스인, 인터페이스 구현을 통해 코드 재사용과 다형성을 달성할 수 있습니다.

이러한 객체 지향 기능을 잘 활용하면 유지 보수하기 쉽고 확장 가능한 코드를 작성할 수 있습니다. 다음 장에서는 Dart의 비동기 프로그래밍에 대해 알아보겠습니다.
