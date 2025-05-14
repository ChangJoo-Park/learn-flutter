---
title: 비동기 프로그래밍
---

Dart는 비동기 프로그래밍을 위한 강력한 지원을 제공합니다. 비동기(asynchronous) 프로그래밍은 애플리케이션이 네트워크 요청, 파일 입출력, 데이터베이스 작업과 같은 시간이 오래 걸리는 작업을 처리할 때 UI가 멈추지 않도록 하는 중요한 패러다임입니다.

## 비동기 프로그래밍의 필요성

동기(synchronous) 코드가 실행되면 각 작업은 이전 작업이 완료될 때까지 기다린 후 실행됩니다. 이는 UI 스레드에서 시간이 오래 걸리는 작업을 수행할 때 문제가 됩니다:

```dart
// 동기 코드 예시
void main() {
  print('작업 시작');
  String data = fetchDataSync(); // 이 작업이 3초 걸린다고 가정
  print('데이터: $data');
  print('다음 작업 진행');
}

String fetchDataSync() {
  // 네트워크 요청 시뮬레이션
  sleep(Duration(seconds: 3));
  return '서버에서 받은 데이터';
}
```

위 코드에서 `fetchDataSync()` 함수가 실행되는 동안 UI는 완전히 멈추게 됩니다. 이러한 문제를 해결하기 위해 Dart는 다음과 같은 비동기 프로그래밍 도구를 제공합니다:

1. `Future` 객체
2. `async` 및 `await` 키워드
3. `Stream` 객체

## Future

`Future`는 비동기 연산의 결과를 나타내는 객체입니다. 이는 나중에 값이나 오류를 포함할 약속(promise)과 같습니다.

### Future 기본

```dart
Future<String> fetchData() {
  return Future.delayed(Duration(seconds: 3), () {
    return '서버에서 받은 데이터';
  });
}

void main() {
  print('작업 시작');

  // fetchData()는 즉시 Future 객체를 반환
  fetchData().then((data) {
    print('데이터: $data');
  }).catchError((error) {
    print('오류 발생: $error');
  }).whenComplete(() {
    print('작업 완료');
  });

  print('다음 작업 진행'); // fetchData()가 완료되기 전에 실행됨
}

// 출력:
// 작업 시작
// 다음 작업 진행
// 데이터: 서버에서 받은 데이터
// 작업 완료
```

### Future 생성 방법

#### 1. Future.value()

이미 알고 있는 값으로 즉시 완료되는 Future를 생성합니다:

```dart
Future<String> getFuture() {
  return Future.value('즉시 사용 가능한 값');
}
```

#### 2. Future.delayed()

지정된 시간 후에 완료되는 Future를 생성합니다:

```dart
Future<String> getDelayedFuture() {
  return Future.delayed(Duration(seconds: 2), () {
    return '2초 후 사용 가능한 값';
  });
}
```

#### 3. Future.error()

오류로 완료되는 Future를 생성합니다:

```dart
Future<String> getErrorFuture() {
  return Future.error('오류 발생');
}
```

#### 4. Completer 사용

복잡한 비동기 로직을 직접 제어하려면 `Completer`를 사용할 수 있습니다:

```dart
import 'dart:async';

Future<String> complexOperation() {
  final completer = Completer<String>();

  // 비동기 작업 시뮬레이션
  Timer(Duration(seconds: 2), () {
    if (DateTime.now().second % 2 == 0) {
      completer.complete('성공!');
    } else {
      completer.completeError('실패!');
    }
  });

  return completer.future;
}
```

### Future 체이닝

여러 비동기 작업을 순차적으로 처리하려면 Future 체이닝을 사용합니다:

```dart
void main() {
  fetchUserId()
    .then((id) => fetchUserData(id))
    .then((userData) => saveUserData(userData))
    .then((_) => print('모든 작업 완료'))
    .catchError((error) => print('오류 발생: $error'));
}

Future<String> fetchUserId() => Future.value('user123');
Future<Map<String, dynamic>> fetchUserData(String id) =>
    Future.value({'id': id, 'name': '홍길동', 'email': 'hong@example.com'});
Future<void> saveUserData(Map<String, dynamic> userData) =>
    Future.value(print('데이터 저장됨: $userData'));
```

## async 및 await

`async`와 `await` 키워드를 사용하면 비동기 코드를 동기 코드처럼 작성할 수 있어 가독성이 향상됩니다.

### 기본 사용법

```dart
Future<String> fetchData() async {
  // async 함수 내에서 await 사용
  await Future.delayed(Duration(seconds: 2));
  return '서버에서 받은 데이터';
}

void main() async {
  print('작업 시작');

  try {
    // await는 Future가 완료될 때까지 기다림
    String data = await fetchData();
    print('데이터: $data');
  } catch (e) {
    print('오류 발생: $e');
  } finally {
    print('작업 완료');
  }

  print('다음 작업 진행');
}

// 출력:
// 작업 시작
// 데이터: 서버에서 받은 데이터
// 작업 완료
// 다음 작업 진행
```

### async 함수의 특성

1. `async` 표시된 함수는 항상 `Future`를 반환합니다.
2. 이미 Future를 반환하는 경우 추가 래핑이 발생하지 않습니다.
3. 함수 내에서 `await`를 사용할 수 있습니다.

```dart
// String을 반환하는 것처럼 보이지만 실제로는 Future<String>을 반환
Future<String> getString() async {
  return 'Hello';
}

// 이미 Future<String>을 반환하므로 Future<Future<String>>이 아닌 Future<String>을 반환
Future<String> getFuture() async {
  return Future.value('Hello');
}
```

### 여러 비동기 작업 처리

#### 순차 처리

```dart
Future<void> sequentialTasks() async {
  final startTime = DateTime.now();

  final result1 = await task1(); // 2초 소요
  final result2 = await task2(); // 3초 소요
  final result3 = await task3(); // 1초 소요

  // 총 약 6초 소요
  print('모든 작업 완료: $result1, $result2, $result3');
  print('소요 시간: ${DateTime.now().difference(startTime).inSeconds}초');
}
```

#### 병렬 처리

```dart
Future<void> parallelTasks() async {
  final startTime = DateTime.now();

  // Future.wait를 사용하여 여러 작업을 동시에 시작하고 모두 완료될 때까지 기다림
  final results = await Future.wait([
    task1(), // 2초 소요
    task2(), // 3초 소요
    task3(), // 1초 소요
  ]);

  // 총 약 3초 소요 (가장 오래 걸리는 작업 기준)
  print('모든 작업 완료: ${results[0]}, ${results[1]}, ${results[2]}');
  print('소요 시간: ${DateTime.now().difference(startTime).inSeconds}초');
}

Future<String> task1() => Future.delayed(Duration(seconds: 2), () => '작업1 결과');
Future<String> task2() => Future.delayed(Duration(seconds: 3), () => '작업2 결과');
Future<String> task3() => Future.delayed(Duration(seconds: 1), () => '작업3 결과');
```

### Future API

Future 클래스는 다양한 유용한 메서드를 제공합니다:

#### Future.wait

여러 Future가 모두 완료될 때까지 기다립니다:

```dart
Future<void> waitExample() async {
  final results = await Future.wait([
    Future.delayed(Duration(seconds: 1), () => '결과1'),
    Future.delayed(Duration(seconds: 2), () => '결과2'),
    Future.delayed(Duration(seconds: 3), () => '결과3'),
  ]);

  print(results); // [결과1, 결과2, 결과3]
}
```

#### Future.any

여러 Future 중 하나라도 완료되면 그 결과를 반환합니다:

```dart
Future<void> anyExample() async {
  final result = await Future.any([
    Future.delayed(Duration(seconds: 3), () => '느린 작업'),
    Future.delayed(Duration(seconds: 1), () => '빠른 작업'),
    Future.delayed(Duration(seconds: 2), () => '중간 작업'),
  ]);

  print(result); // 빠른 작업
}
```

#### Future.forEach

리스트의 각 항목에 대해 비동기 작업을 순차적으로 수행합니다:

```dart
Future<void> forEachExample() async {
  final items = [1, 2, 3, 4, 5];

  await Future.forEach(items, (int item) async {
    await Future.delayed(Duration(milliseconds: 500));
    print('처리 중: $item');
  });

  print('모든 항목 처리 완료');
}
```

## Stream

`Stream`은 시간에 따라 여러 비동기 이벤트를 제공하는 방법입니다. 이는 파일 읽기, 웹소켓 메시지, 사용자 입력 이벤트 등과 같이 여러 값을 비동기적으로 처리해야 할 때 유용합니다.

### Stream 기본

```dart
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i; // 스트림에 값을 추가
  }
}

void main() async {
  // 스트림 구독
  final stream = countStream(5);

  // 첫 번째 방법: await for
  print('await for 사용:');
  await for (final count in stream) {
    print(count);
  }

  // 두 번째 방법: listen
  print('listen 사용:');
  countStream(5).listen(
    (data) => print(data),
    onError: (error) => print('오류: $error'),
    onDone: () => print('스트림 완료'),
  );
}
```

### Stream 생성 방법

#### 1. async\* 및 yield

제너레이터 함수를 사용하여 스트림을 생성합니다:

```dart
Stream<int> countStream(int max) async* {
  for (int i = 1; i <= max; i++) {
    await Future.delayed(Duration(seconds: 1));
    yield i;
  }
}
```

#### 2. StreamController

더 세밀한 제어가 필요할 때 `StreamController`를 사용합니다:

```dart
import 'dart:async';

Stream<int> getControllerStream() {
  final controller = StreamController<int>();

  // 데이터 추가 시뮬레이션
  Timer.periodic(Duration(seconds: 1), (timer) {
    if (timer.tick <= 5) {
      controller.add(timer.tick);
    } else {
      controller.close();
      timer.cancel();
    }
  });

  return controller.stream;
}
```

#### 3. Stream.fromIterable

반복 가능한(Iterable) 객체에서 스트림을 생성합니다:

```dart
Stream<int> getIterableStream() {
  return Stream.fromIterable([1, 2, 3, 4, 5]);
}
```

#### 4. Stream.periodic

주기적으로 이벤트를 생성하는 스트림을 만듭니다:

```dart
Stream<int> getPeriodicStream() {
  return Stream.periodic(Duration(seconds: 1), (count) => count + 1)
      .take(5); // 처음 5개 이벤트만 가져옴
}
```

### Stream 변환 및 조작

Stream은 다양한 변환 및 조작 메서드를 제공합니다:

```dart
void streamTransformations() async {
  final stream = Stream.fromIterable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  // 변환: 각 값을 두 배로
  final doubled = stream.map((value) => value * 2);

  // 필터링: 짝수만 선택
  final evenOnly = doubled.where((value) => value % 2 == 0);

  // 제한: 처음 3개 이벤트만
  final limited = evenOnly.take(3);

  // 결과 출력
  await for (final value in limited) {
    print(value); // 4, 8, 12
  }
}
```

### 일반적인 Stream 패턴

#### 브로드캐스트 스트림

여러 리스너가 동시에 구독할 수 있는 스트림입니다:

```dart
void broadcastStreamExample() {
  final controller = StreamController<int>.broadcast();

  // 첫 번째 구독자
  final subscription1 = controller.stream.listen(
    (data) => print('구독자 1: $data'),
    onDone: () => print('구독자 1: 완료'),
  );

  // 두 번째 구독자
  final subscription2 = controller.stream.listen(
    (data) => print('구독자 2: $data'),
    onDone: () => print('구독자 2: 완료'),
  );

  // 데이터 추가
  controller.add(1);
  controller.add(2);
  controller.add(3);

  // 첫 번째 구독 취소
  subscription1.cancel();

  // 추가 데이터
  controller.add(4);
  controller.add(5);

  // 스트림 닫기
  controller.close();
}
```

#### 스트림 구독 관리

스트림 구독을 적절히 취소하여 메모리 누수를 방지하는 것이 중요합니다:

```dart
class DataService {
  StreamSubscription<int>? _subscription;

  void startListening() {
    // 이미 구독 중이면 기존 구독 취소
    _subscription?.cancel();

    // 새로운 구독 시작
    _subscription = getPeriodicStream().listen(
      (data) => print('받은 데이터: $data'),
      onDone: () => print('스트림 완료'),
    );
  }

  void stopListening() {
    _subscription?.cancel();
    _subscription = null;
  }

  void dispose() {
    stopListening();
  }
}
```

### async\*/await for 대 StreamBuilder

Flutter에서는 스트림 데이터를 처리하는 두 가지 주요 방법이 있습니다:

#### async\*/await for (명령형)

```dart
Future<void> processStream(Stream<int> stream) async {
  await for (final value in stream) {
    // 각 이벤트 처리
    print('처리 중: $value');
  }
}
```

#### StreamBuilder (선언적)

Flutter 위젯에서 스트림 데이터를 처리할 때는 `StreamBuilder`를 사용하는 것이 좋습니다:

```dart
StreamBuilder<int>(
  stream: countStream(10),
  builder: (context, snapshot) {
    if (snapshot.hasError) {
      return Text('오류 발생: ${snapshot.error}');
    }

    if (snapshot.connectionState == ConnectionState.waiting) {
      return CircularProgressIndicator();
    }

    if (snapshot.hasData) {
      return Text('현재 값: ${snapshot.data}');
    }

    return Text('데이터 없음');
  },
)
```

## Flutter에서의 비동기 프로그래밍

Flutter에서 비동기 프로그래밍은 UI의 응답성을 유지하는 데 중요합니다:

### 1. FutureBuilder

단일 비동기 작업의 결과를 UI에 표시할 때 사용합니다:

```dart
FutureBuilder<String>(
  future: fetchData(),
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
```

### 2. StreamBuilder

지속적으로 업데이트되는 데이터를 UI에 표시할 때 사용합니다:

```dart
StreamBuilder<int>(
  stream: countdownStream(10),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.active) {
      return Text('카운트다운: ${snapshot.data}');
    } else if (snapshot.connectionState == ConnectionState.done) {
      return Text('카운트다운 완료!');
    } else {
      return CircularProgressIndicator();
    }
  },
)
```

### 3. 실제 예제: 데이터 가져오기

```dart
Future<List<User>> fetchUsers() async {
  final response = await http.get(Uri.parse('https://api.example.com/users'));

  if (response.statusCode == 200) {
    final List<dynamic> data = jsonDecode(response.body);
    return data.map((json) => User.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load users');
  }
}

class UserListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('사용자 목록')),
      body: FutureBuilder<List<User>>(
        future: fetchUsers(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(child: Text('오류: ${snapshot.error}'));
          } else if (snapshot.hasData) {
            final users = snapshot.data!;
            return ListView.builder(
              itemCount: users.length,
              itemBuilder: (context, index) {
                final user = users[index];
                return ListTile(
                  title: Text(user.name),
                  subtitle: Text(user.email),
                );
              },
            );
          } else {
            return Center(child: Text('사용자가 없습니다'));
          }
        },
      ),
    );
  }
}
```

## 비동기 관련 모범 사례

### 1. 적절한 에러 처리

항상 try-catch로 비동기 작업의 오류를 처리하거나, Future의 catchError를 사용합니다:

```dart
Future<void> loadData() async {
  try {
    final data = await fetchData();
    processData(data);
  } catch (e) {
    print('데이터 로드 중 오류 발생: $e');
    showErrorDialog(e);
  }
}
```

### 2. 취소 가능한 작업

오래 실행되는 작업은 취소할 수 있도록 설계합니다:

```dart
Future<String> fetchWithTimeout() {
  return fetchData().timeout(
    Duration(seconds: 5),
    onTimeout: () => throw TimeoutException('요청 시간 초과'),
  );
}
```

### 3. 비동기 자원 해제

비동기 자원은 사용 후 적절히 해제합니다:

```dart
Future<void> processFile() async {
  final file = File('data.txt');
  final StreamSubscription<String> subscription =
      file.openRead()
          .transform(utf8.decoder)
          .transform(LineSplitter())
          .listen(processLine);

  // 작업 완료 후
  await Future.delayed(Duration(seconds: 5));
  await subscription.cancel();
}
```

### 4. 적절한 UI 피드백

사용자에게 비동기 작업의 상태를 항상 알려줍니다:

```dart
Future<void> saveData() async {
  // 로딩 표시 시작
  setState(() => _isLoading = true);

  try {
    await uploadData();
    // 성공 알림
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('데이터가 성공적으로 저장되었습니다')),
    );
  } catch (e) {
    // 오류 알림
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('저장 실패: $e')),
    );
  } finally {
    // 로딩 표시 종료
    setState(() => _isLoading = false);
  }
}
```

### 5. compute 함수 활용

CPU를 많이 사용하는 작업은 `compute` 함수를 사용하여 별도의 격리된 환경(isolate)에서 실행합니다:

```dart
Future<List<ComplexData>> processLargeDataSet(List<RawData> rawData) {
  // 별도의 isolate에서 무거운 처리 실행
  return compute(processDataInBackground, rawData);
}

// 다른 isolate에서 실행될 함수 (전역 함수여야 함)
List<ComplexData> processDataInBackground(List<RawData> rawData) {
  // CPU 집약적인 작업 수행
  return rawData.map((raw) => ComplexData.process(raw)).toList();
}
```

## 결론

Dart의 비동기 프로그래밍 도구는 Flutter 애플리케이션에서 반응성과 성능을 유지하는 데 필수적입니다. Future, async/await, Stream을 적절히 활용하면 네트워크 요청, 파일 접근, 사용자 이벤트 처리와 같은 작업을 효율적으로 구현할 수 있습니다.

다음 장에서는 Dart의 컬렉션과 반복문에 대해 알아보겠습니다.
