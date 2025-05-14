---
title: 예외 처리
---

소프트웨어 개발에서 오류는 피할 수 없는 부분입니다. Dart는 예외(Exception)를 사용하여 프로그램 실행 중 발생하는 오류를 처리합니다. 이 장에서는 Dart의 예외 처리 메커니즘, 내장 예외 타입, 사용자 정의 예외 생성 및 효과적인 예외 처리 전략에 대해 알아보겠습니다.

## 예외의 개념

예외는 프로그램 실행 중 발생하는 비정상적인 상황이나 오류입니다. 예외가 발생하면 프로그램의 정상적인 흐름이 중단되고, 해당 예외를 처리하는 코드로 제어가 이동합니다.

### 예외와 오류의 차이

Dart에서는 모든 예외가 `Exception` 또는 `Error` 클래스의 하위 타입입니다:

- **Exception**: 프로그램이 복구할 수 있는 오류 상황을 나타냅니다.
- **Error**: 프로그래밍 오류나 시스템 오류와 같이 일반적으로 복구할 수 없는 심각한 문제를 나타냅니다.

## 내장 예외 타입

Dart는 다양한 내장 예외 타입을 제공합니다:

### Exception 하위 타입

```dart
// 포맷 예외
FormatException('잘못된 형식의 입력입니다.');

// 상태 예외
StateError('객체가 잘못된 상태입니다.');

// 타입 오류
TypeError(); // 예: 잘못된 타입 캐스팅

// 인수 오류
ArgumentError('잘못된 인수가 제공되었습니다.');
ArgumentError.notNull('필수 매개변수가 null입니다.');
ArgumentError.value(42, 'age', '0보다 커야 합니다.');

// 범위 오류
RangeError('인덱스가 범위를 벗어났습니다.');
RangeError.index(10, [1, 2, 3], 'index', '인덱스가 범위를 벗어났습니다.', 3);
RangeError.range(42, 0, 10, 'value', '값이 허용 범위를 벗어났습니다.');

// 동시성 예외
ConcurrentModificationError('반복 중 컬렉션이 수정되었습니다.');

// 타임아웃 예외
TimeoutException('작업이 시간 초과되었습니다.', Duration(seconds: 5));
```

### Error 하위 타입

```dart
// 어설션 오류
AssertionError('조건이 false입니다.');

// 형식 오류
TypeError();

// 캐스트 오류 (다운캐스팅 실패)
CastError();

// 널 참조 오류
NoSuchMethodError.withInvocation(null, Invocation.method(Symbol('toString'), []));

// 스택 오버플로우
StackOverflowError();

// 외부 오류
OutOfMemoryError();
```

## 예외 처리 기본

### 1. try-catch-finally

기본적인 예외 처리 구문은 다음과 같습니다:

```dart
try {
  // 예외가 발생할 수 있는 코드
  int result = 12 ~/ 0; // 0으로 나누기 시도
  print('결과: $result'); // 이 코드는 실행되지 않음
} catch (e) {
  // 모든 예외 처리
  print('예외 발생: $e');
} finally {
  // 예외 발생 여부와 관계없이 항상 실행
  print('finally 블록 실행');
}

// 출력:
// 예외 발생: IntegerDivisionByZeroException
// finally 블록 실행
```

### 2. 특정 예외 타입 잡기

여러 종류의 예외를 다르게 처리할 수 있습니다:

```dart
try {
  // 예외가 발생할 수 있는 코드
  dynamic value = 'not a number';
  int number = int.parse(value);
  print('숫자: $number');
} on FormatException catch (e) {
  // FormatException 처리
  print('숫자로 변환할 수 없음: $e');
} on TypeError catch (e) {
  // TypeError 처리
  print('타입 오류 발생: $e');
} catch (e, s) {
  // 기타 모든 예외 처리, 스택 트레이스 포함
  print('기타 예외 발생: $e');
  print('스택 트레이스: $s');
}
```

### 3. 예외 다시 던지기(rethrow)

예외를 잡은 후 처리하고 다시 상위 호출자에게 전파할 수 있습니다:

```dart
void processFile(String filename) {
  try {
    // 파일 처리 코드
    var file = File(filename);
    var contents = file.readAsStringSync();
    // 파일 내용 처리...
  } catch (e) {
    // 로그 기록
    print('파일 처리 중 오류 발생: $e');

    // 오류를 상위 호출자에게 전달
    rethrow;
  }
}

void main() {
  try {
    processFile('존재하지_않는_파일.txt');
  } catch (e) {
    print('메인에서 오류 처리: $e');
  }
}
```

## 사용자 정의 예외

특정 상황에 맞는 예외를 직접 정의할 수 있습니다:

```dart
// 사용자 정의 예외 클래스 정의
class InsufficientBalanceException implements Exception {
  final double balance;
  final double withdrawal;

  InsufficientBalanceException(this.balance, this.withdrawal);

  @override
  String toString() {
    return '잔액 부족: 현재 잔액 $balance, 출금 요청액 $withdrawal';
  }
}

// 사용자 정의 예외 사용
class BankAccount {
  double balance = 0;
  final String owner;

  BankAccount(this.owner, [this.balance = 0]);

  void deposit(double amount) {
    if (amount <= 0) {
      throw ArgumentError('입금액은 0보다 커야 합니다.');
    }
    balance += amount;
  }

  void withdraw(double amount) {
    if (amount <= 0) {
      throw ArgumentError('출금액은 0보다 커야 합니다.');
    }

    if (amount > balance) {
      throw InsufficientBalanceException(balance, amount);
    }

    balance -= amount;
  }
}

// 사용 예시
void main() {
  var account = BankAccount('홍길동', 1000);

  try {
    account.withdraw(1500);
  } on InsufficientBalanceException catch (e) {
    print('출금 실패: $e');
    // 출금 실패: 잔액 부족: 현재 잔액 1000.0, 출금 요청액 1500.0
  } on ArgumentError catch (e) {
    print('인수 오류: $e');
  } catch (e) {
    print('기타 예외: $e');
  }
}
```

## 비동기 코드에서의 예외 처리

### 1. async-await와 try-catch

비동기 함수에서도 동기 코드와 마찬가지로 try-catch를 사용할 수 있습니다:

```dart
Future<String> fetchData() async {
  await Future.delayed(Duration(seconds: 1));
  throw Exception('데이터를 가져올 수 없습니다.');
}

Future<void> processData() async {
  try {
    String data = await fetchData();
    print('데이터: $data');
  } catch (e) {
    print('데이터 처리 중 오류 발생: $e');
  } finally {
    print('데이터 처리 완료');
  }
}

void main() async {
  await processData();

  // 출력:
  // 데이터 처리 중 오류 발생: Exception: 데이터를 가져올 수 없습니다.
  // 데이터 처리 완료
}
```

### 2. Future의 catchError

`Future`의 메서드 체인을 사용할 때는 `catchError`를 사용할 수 있습니다:

```dart
Future<String> fetchData() {
  return Future.delayed(Duration(seconds: 1))
      .then((_) => throw Exception('네트워크 오류'));
}

void main() {
  fetchData()
      .then((data) => print('데이터: $data'))
      .catchError((e) => print('오류 발생: $e'))
      .whenComplete(() => print('작업 완료'));

  // 출력:
  // 오류 발생: Exception: 네트워크 오류
  // 작업 완료
}
```

### 3. 특정 예외만 처리하기

`catchError`에서 특정 예외만 처리할 수 있습니다:

```dart
Future<void> processTask() async {
  return Future.delayed(Duration(seconds: 1))
      .then((_) => throw TimeoutException('시간 초과', Duration(seconds: 1)))
      .then((_) => print('작업 완료'));
}

void main() {
  processTask()
      .catchError(
        (e) => print('타임아웃 발생: $e'),
        test: (e) => e is TimeoutException,
      )
      .catchError(
        (e) => print('기타 오류: $e'),
      )
      .whenComplete(() => print('모든 작업 완료'));

  // 출력:
  // 타임아웃 발생: TimeoutException: 시간 초과
  // 모든 작업 완료
}
```

## 스트림(Stream)에서의 예외 처리

### 1. try-catch와 await for

```dart
Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    if (i == 4) {
      throw Exception('4는 불길한 숫자입니다!');
    }
    yield i;
  }
}

Future<void> readStream() async {
  try {
    await for (var number in countStream(5)) {
      print('숫자: $number');
    }
    print('스트림 읽기 완료');
  } catch (e) {
    print('스트림 처리 중 오류 발생: $e');
  }
}

// 출력:
// 숫자: 1
// 숫자: 2
// 숫자: 3
// 스트림 처리 중 오류 발생: Exception: 4는 불길한 숫자입니다!
```

### 2. onError 리스너

```dart
Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    await Future.delayed(Duration(milliseconds: 500));
    if (i == 4) {
      throw Exception('4는 불길한 숫자입니다!');
    }
    yield i;
  }
}

void main() {
  countStream(5).listen(
    (data) => print('숫자: $data'),
    onError: (e) => print('오류 발생: $e'),
    onDone: () => print('스트림 완료'),
    cancelOnError: false, // 오류 발생 시 구독 유지 (기본값은 true)
  );
}

// 출력:
// 숫자: 1
// 숫자: 2
// 숫자: 3
// 오류 발생: Exception: 4는 불길한 숫자입니다!
// 스트림 완료
```

### 3. handleError 메서드

```dart
Stream<int> generateNumbers() async* {
  for (int i = 1; i <= 5; i++) {
    if (i == 3) throw Exception('3에서 오류 발생');
    yield i;
  }
}

void main() {
  generateNumbers()
      .handleError((error) => print('처리된 오류: $error'))
      .listen(
        (data) => print('데이터: $data'),
        onDone: () => print('완료'),
      );
}

// 출력:
// 데이터: 1
// 데이터: 2
// 처리된 오류: Exception: 3에서 오류 발생
// 완료
```

## 영역(Zone)을 사용한 예외 처리

`Zone`은 실행 컨텍스트를 제공하여 전역적으로 오류 처리를 할 수 있게 해줍니다. 특히 비동기 코드에서 캐치되지 않은 예외를 처리하는 데 유용합니다.

```dart
import 'dart:async';

void main() {
  // 사용자 정의 Zone 생성
  runZonedGuarded(
    () {
      // 이 영역 내에서 실행되는 모든 코드의 예외를 처리
      print('Zone 내에서 코드 실행 시작');

      // 동기 예외
      // throw Exception('동기 오류');

      // 비동기 예외
      Future.delayed(Duration(seconds: 1), () {
        throw Exception('비동기 오류');
      });

      // 타이머 내 예외
      Timer(Duration(seconds: 2), () {
        throw Exception('타이머 내 오류');
      });
    },
    (error, stack) {
      // 모든 예외를 여기서 처리
      print('Zone에서 오류 캐치: $error');
      print('스택 트레이스: $stack');
    },
  );

  print('main 함수의 끝 (Zone은 계속 실행됨)');
}

// 출력:
// Zone 내에서 코드 실행 시작
// main 함수의 끝 (Zone은 계속 실행됨)
// Zone에서 오류 캐치: Exception: 비동기 오류
// 스택 트레이스: ...
// Zone에서 오류 캐치: Exception: 타이머 내 오류
// 스택 트레이스: ...
```

## Flutter에서의 예외 처리

### 1. Flutter 앱의 전역 에러 핸들러

Flutter 앱에서는 `FlutterError.onError`를 통해 전역 에러 핸들러를 설정할 수 있습니다:

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

void main() {
  // UI 렌더링 중 발생하는 오류 처리
  FlutterError.onError = (FlutterErrorDetails details) {
    if (kReleaseMode) {
      // 릴리즈 모드에서는 오류 로깅 서비스로 보내기
      Zone.current.handleUncaughtError(details.exception, details.stack!);
    } else {
      // 개발 모드에서는 콘솔에 출력
      FlutterError.dumpErrorToConsole(details);
    }
  };

  // 앱 실행을 Zone으로 감싸서 모든 비동기 오류 처리
  runZonedGuarded(
    () {
      runApp(MyApp());
    },
    (error, stackTrace) {
      // 여기서 오류 로깅, 분석 서비스로 보내기 등 처리
      print('예기치 않은 오류: $error');
      print('스택 트레이스: $stackTrace');
    },
  );
}
```

### 2. 위젯에서의 예외 처리

Flutter 위젯에서는 `ErrorWidget`을 사용하여 예외 발생 시 UI를 관리할 수 있습니다:

```dart
void main() {
  // 개발 시에만 사용자 정의 에러 위젯 설정
  if (kDebugMode) {
    ErrorWidget.builder = (FlutterErrorDetails details) {
      return Container(
        padding: EdgeInsets.all(16),
        alignment: Alignment.center,
        color: Colors.red.withOpacity(0.3),
        child: Text(
          '위젯 빌드 오류: ${details.exception}',
          style: TextStyle(color: Colors.white),
        ),
      );
    };
  }

  runApp(MyApp());
}
```

### 3. FutureBuilder와 StreamBuilder에서의 예외 처리

Flutter의 `FutureBuilder`와 `StreamBuilder`는 위젯에서 비동기 데이터 처리를 쉽게 하고, 오류 상태도 처리할 수 있게 해줍니다:

```dart
// FutureBuilder 사용 예
FutureBuilder<String>(
  future: fetchData(), // 비동기 데이터 소스
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    } else if (snapshot.hasError) {
      return Text('오류 발생: ${snapshot.error}');
    } else if (snapshot.hasData) {
      return Text('데이터: ${snapshot.data}');
    } else {
      return Text('데이터 없음');
    }
  },
)

// StreamBuilder 사용 예
StreamBuilder<int>(
  stream: countStream(5),
  builder: (context, snapshot) {
    if (snapshot.hasError) {
      return Text('스트림 오류: ${snapshot.error}');
    } else if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    } else if (snapshot.hasData) {
      return Text('현재 값: ${snapshot.data}');
    } else {
      return Text('데이터 없음');
    }
  },
)
```

## 예외 처리 모범 사례

### 1. 예외는 예외적인 상황에만 사용하기

```dart
// 나쁜 예: 일반적인 흐름 제어에 예외 사용
int findIndex(List<int> list, int value) {
  try {
    for (int i = 0; i < list.length; i++) {
      if (list[i] == value) {
        throw i; // 찾은 인덱스를 예외로 던짐
      }
    }
    return -1;
  } catch (e) {
    return e as int; // 예외에서 인덱스 추출
  }
}

// 좋은 예: 직접 반환
int findIndex(List<int> list, int value) {
  for (int i = 0; i < list.length; i++) {
    if (list[i] == value) {
      return i;
    }
  }
  return -1;
}
```

### 2. 적절한 예외 타입 사용하기

```dart
// 나쁜 예: 일반 예외 사용
void processAge(dynamic age) {
  if (age is! int) {
    throw Exception('나이는 정수여야 합니다.');
  }
  if (age < 0) {
    throw Exception('나이는 음수일 수 없습니다.');
  }
  // 처리 로직...
}

// 좋은 예: 구체적인 예외 사용
void processAge(dynamic age) {
  if (age is! int) {
    throw TypeError();
  }
  if (age < 0) {
    throw ArgumentError.value(age, 'age', '나이는 음수일 수 없습니다.');
  }
  // 처리 로직...
}
```

### 3. 모든 예외 처리하기

```dart
// 나쁜 예: 특정 예외만 처리
Future<void> loadUserData() async {
  try {
    final data = await fetchUserFromNetwork();
    saveToDatabase(data);
  } on NetworkException catch (e) {
    print('네트워크 오류: $e');
    // 데이터베이스 오류는 처리되지 않음
  }
}

// 좋은 예: 가능한 모든 예외 처리
Future<void> loadUserData() async {
  try {
    final data = await fetchUserFromNetwork();
    saveToDatabase(data);
  } on NetworkException catch (e) {
    print('네트워크 오류: $e');
    // 오프라인 데이터 사용
  } on DatabaseException catch (e) {
    print('데이터베이스 오류: $e');
    // 임시 저장
  } catch (e) {
    print('예기치 않은 오류: $e');
    // 기본 데이터 사용
  }
}
```

### 4. 예외 래핑 및 컨텍스트 추가하기

```dart
Future<User> fetchUser(String userId) async {
  try {
    final response = await http.get(Uri.parse('https://api.example.com/users/$userId'));

    if (response.statusCode == 200) {
      return User.fromJson(jsonDecode(response.body));
    } else {
      throw HttpException('상태 코드: ${response.statusCode}');
    }
  } catch (e) {
    // 원래 예외를 래핑하여 컨텍스트 추가
    throw UserNotFoundException(
      'ID가 $userId인 사용자를 찾을 수 없습니다.',
      cause: e,
    );
  }
}

class UserNotFoundException implements Exception {
  final String message;
  final Object? cause;

  UserNotFoundException(this.message, {this.cause});

  @override
  String toString() {
    if (cause != null) {
      return '$message (원인: $cause)';
    }
    return message;
  }
}
```

### 5. 리소스 해제 보장하기

```dart
Future<void> processFile(String path) async {
  File file;
  try {
    file = File(path);
    final content = await file.readAsString();
    // 콘텐츠 처리...
  } catch (e) {
    print('파일 처리 오류: $e');
    rethrow;
  } finally {
    // 리소스 정리 (파일 닫기 등)
    print('파일 처리 완료');
  }
}
```

### 6. 예외 처리 중앙화하기

```dart
// 중앙 에러 핸들러 정의
class ErrorHandler {
  static void logError(Object error, StackTrace stackTrace) {
    // 로그 파일에 기록
    print('ERROR: $error');
    print('STACK: $stackTrace');

    // 분석 서비스로 전송
    // _sendToAnalyticsService(error, stackTrace);

    // 개발자에게 알림
    if (!kReleaseMode) {
      print('디버그 모드에서 오류 발생!');
    }
  }

  static Future<T> guard<T>(Future<T> Function() function) async {
    try {
      return await function();
    } catch (error, stackTrace) {
      logError(error, stackTrace);
      rethrow;
    }
  }
}

// 사용 예시
Future<void> fetchData() async {
  await ErrorHandler.guard(() async {
    // 비즈니스 로직...
    if (Math.random() < 0.5) {
      throw Exception('랜덤 오류');
    }
    return '데이터';
  });
}
```

## 결론

효과적인 예외 처리는 견고한 애플리케이션 개발의 핵심입니다. Dart는 try-catch-finally, 특정 예외 타입 잡기, 사용자 정의 예외 등 다양한 예외 처리 메커니즘을 제공합니다. 비동기 코드에서는 async-await와 함께 사용하거나 Future와 Stream의 오류 처리 메서드를 활용할 수 있습니다.

모범 사례를 따르면 더 안정적이고 유지 관리가 쉬운 코드를 작성할 수 있습니다:

1. 예외는 진짜 예외적인 상황에만 사용하세요.
2. 적절한 예외 타입을 사용하여 문제를 명확하게 전달하세요.
3. 발생할 수 있는 모든 예외를 처리하세요.
4. 필요한 경우 예외를 래핑하여 컨텍스트를 추가하세요.
5. finally 블록을 사용하여 리소스 해제를 보장하세요.
6. 일관된 예외 처리를 위해 중앙화된 접근 방식을 사용하세요.

다음 장에서는 Dart의 Extension과 Mixin에 대해 알아보겠습니다.
