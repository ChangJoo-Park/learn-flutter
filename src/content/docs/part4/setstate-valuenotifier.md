---
title: setState와 ValueNotifier
---

Flutter에서 기본적으로 제공하는 상태 관리 메커니즘인 `setState`와 `ValueNotifier`에 대해 자세히 알아보겠습니다. 이들은 외부 패키지 없이 Flutter 코어 내에서 사용할 수 있는 상태 관리 방법으로, 간단한 앱에서는 이 도구들만으로도 효과적인 상태 관리가 가능합니다.

## setState()

`setState()`는 Flutter의 `StatefulWidget`에서 상태를 관리하는 가장 기본적인 메커니즘입니다. 이 메서드는 상태 변경을 Flutter 프레임워크에 알려 위젯을 다시 빌드하도록 합니다.

### 기본 사용법

```dart
class CounterPage extends StatefulWidget {
  const CounterPage({Key? key}) : super(key: key);

  @override
  _CounterPageState createState() => _CounterPageState();
}

class _CounterPageState extends State<CounterPage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('setState 예제'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            const Text(
              '버튼을 누른 횟수:',
            ),
            Text(
              '$_counter',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: '증가',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### setState의 작동 방식


### setState의 주요 특징

1. **간단함**: 사용하기 쉽고 이해하기 직관적
2. **지역성**: 해당 위젯의 상태만 관리
3. **위젯 재빌드**: `setState()` 호출 시 위젯의 `build()` 메서드가 다시 호출됨
4. **동기적 작동**: Flutter의 다음 프레임에서 UI 업데이트가 발생

### setState 사용 시 주의사항

1. **적절한 위치에서 호출**: 위젯의 라이프사이클 메서드에서 적절히 호출해야 함

   ```dart
   // 잘못된 사용: initState에서 직접 호출
   @override
   void initState() {
     super.initState();
     setState(() { /* ... */ }); // 오류 발생 가능
   }

   // 올바른 사용: 비동기 작업 후 호출
   @override
   void initState() {
     super.initState();
     Future.delayed(Duration.zero, () {
       if (mounted) { // 위젯이 여전히 트리에 있는지 확인
         setState(() { /* ... */ });
       }
     });
   }
   ```

2. **빌드 중 호출 금지**: `build()` 메서드 내에서 `setState()`를 호출하면 무한 루프 발생

   ```dart
   // 잘못된 사용: build 메서드 내 호출
   @override
   Widget build(BuildContext context) {
     setState(() { /* ... */ }); // 무한 루프 발생
     return Container();
   }
   ```

3. **최적화**: 필요한 상태 변경만 수행하여 불필요한 재빌드 방지

   ```dart
   // 비효율적인 방법
   setState(() {
     _counter++; // 실제로 변경될 때나 변경되지 않을 때나 항상 호출
   });

   // 최적화된 방법
   if (_shouldUpdate) {
     setState(() {
       _counter++;
     });
   }
   ```

### setState의 한계

1. **위젯 트리에서의 전파**: 부모-자식 관계가 깊어질수록 상태 전달이 번거로움 (prop drilling)
2. **상태 공유**: 서로 다른 위젯 간에 상태를 공유하기 어려움
3. **비즈니스 로직 분리**: UI와 비즈니스 로직을 명확히 분리하기 어려움
4. **코드 중복**: 유사한 상태 로직이 여러 위젯에 중복될 수 있음

## ValueNotifier와 ValueListenableBuilder

`ValueNotifier`는 값의 변경을 감지하고 리스너에게 알릴 수 있는 Flutter의 내장 클래스입니다. `setState()`보다 좀 더 유연한 상태 관리를 제공하며, `StatelessWidget` 내에서도 사용할 수 있습니다.

### 기본 사용법

```dart
// ValueNotifier 정의
final ValueNotifier<int> _counter = ValueNotifier<int>(0);

// ValueNotifier 업데이트
void _incrementCounter() {
  _counter.value++;
}

// ValueListenableBuilder를 사용하여 UI에 반영
ValueListenableBuilder<int>(
  valueListenable: _counter,
  builder: (context, value, child) {
    return Text('카운트: $value');
  },
)
```

### 전체 예제

```dart
class ValueNotifierExample extends StatelessWidget {
  ValueNotifierExample({Key? key}) : super(key: key);

  // ValueNotifier 선언
  final ValueNotifier<int> _counter = ValueNotifier<int>(0);
  final ValueNotifier<bool> _isActive = ValueNotifier<bool>(false);

  void _incrementCounter() {
    _counter.value++;
  }

  void _toggleActive() {
    _isActive.value = !_isActive.value;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ValueNotifier 예제'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            // 첫 번째 ValueListenableBuilder
            ValueListenableBuilder<int>(
              valueListenable: _counter,
              builder: (context, value, child) {
                return Text(
                  '카운트: $value',
                  style: Theme.of(context).textTheme.headlineMedium,
                );
              },
            ),
            const SizedBox(height: 20),

            // 두 번째 ValueListenableBuilder
            ValueListenableBuilder<bool>(
              valueListenable: _isActive,
              builder: (context, isActive, child) {
                return Switch(
                  value: isActive,
                  onChanged: (value) => _toggleActive(),
                );
              },
            ),

            // 두 상태를 모두 사용하는 Builder
            Builder(
              builder: (context) {
                // 일반적인 방법으로 값에 접근 (변경 감지 안 됨)
                // ValueListenableBuilder를 사용해야 변경 감지됨
                return Text(
                  '현재 상태: ${_isActive.value ? "활성" : "비활성"}, 카운트: ${_counter.value}',
                  style: TextStyle(
                    color: _isActive.value ? Colors.green : Colors.red,
                  ),
                );
              },
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: _incrementCounter,
        tooltip: '증가',
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### ValueNotifier의 주요 특징

1. **위젯 독립성**: `StatelessWidget`에서도 사용 가능
2. **세분화된 업데이트**: 전체 위젯이 아닌 필요한 부분만 업데이트
3. **명시적 구독**: `ValueListenableBuilder`를 통해 변경 사항을 명시적으로 구독
4. **단일 값 관리**: 각 `ValueNotifier`는 단일 값을 관리

### 복합 상태 관리

여러 값을 효율적으로 관리하려면 클래스로 모델링하고 `ChangeNotifier`를 사용할 수 있습니다:

```dart
class UserModel extends ChangeNotifier {
  String _name = '';
  int _age = 0;
  bool _isActive = false;

  String get name => _name;
  int get age => _age;
  bool get isActive => _isActive;

  void updateName(String newName) {
    _name = newName;
    notifyListeners(); // 변경 사항을 리스너들에게 알림
  }

  void updateAge(int newAge) {
    _age = newAge;
    notifyListeners();
  }

  void toggleActive() {
    _isActive = !_isActive;
    notifyListeners();
  }
}

// 사용 예시
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  final _userModel = UserModel();

  @override
  void dispose() {
    _userModel.dispose(); // 리소스 해제
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _userModel, // ChangeNotifier 구독
      builder: (context, child) {
        return Column(
          children: [
            Text('이름: ${_userModel.name}'),
            Text('나이: ${_userModel.age}'),
            Text('활성 상태: ${_userModel.isActive ? "활성" : "비활성"}'),
            ElevatedButton(
              onPressed: () => _userModel.updateName('홍길동'),
              child: Text('이름 변경'),
            ),
            ElevatedButton(
              onPressed: () => _userModel.updateAge(30),
              child: Text('나이 변경'),
            ),
            ElevatedButton(
              onPressed: () => _userModel.toggleActive(),
              child: Text('상태 토글'),
            ),
          ],
        );
      },
    );
  }
}
```

## setState vs ValueNotifier: 언제 무엇을 사용해야 할까?

두 방식의 장단점을 비교해보겠습니다:

### setState 사용이 적합한 경우

1. **단순한 UI 상태**: 간단한 위젯 내부 상태(토글, 카운터 등)
2. **지역적 상태**: 단일 위젯 내에서만 사용되는 상태
3. **일회성 상태**: 위젯의 생명주기와 함께하는 일시적인 상태
4. **Flutter 입문자**: 기본 개념을 익히는 단계

### ValueNotifier 사용이 적합한 경우

1. **위젯 간 상태 공유**: 여러 위젯이 공통 상태에 접근해야 할 때
2. **세분화된 UI 업데이트**: 위젯의 특정 부분만 업데이트하고 싶을 때
3. **StatelessWidget 내 상태**: 상태를 가진 StatelessWidget을 구현할 때
4. **복잡한 상태 로직**: 상태 로직을 UI 코드에서 분리하고 싶을 때

## 실제 예제: 할 일 목록 앱

이제 두 가지 상태 관리 방식을 활용하여 간단한 할 일 목록 앱을 구현해보겠습니다.

### 1. setState를 사용한 구현

```dart
class TodoListWithSetState extends StatefulWidget {
  const TodoListWithSetState({Key? key}) : super(key: key);

  @override
  _TodoListWithSetStateState createState() => _TodoListWithSetStateState();
}

class Todo {
  String title;
  bool completed;

  Todo({required this.title, this.completed = false});
}

class _TodoListWithSetStateState extends State<TodoListWithSetState> {
  final List<Todo> _todos = [];
  final TextEditingController _controller = TextEditingController();

  void _addTodo() {
    if (_controller.text.isNotEmpty) {
      setState(() {
        _todos.add(Todo(title: _controller.text));
        _controller.clear();
      });
    }
  }

  void _toggleTodo(int index) {
    setState(() {
      _todos[index].completed = !_todos[index].completed;
    });
  }

  void _removeTodo(int index) {
    setState(() {
      _todos.removeAt(index);
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('할 일 목록 (setState)'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      labelText: '할 일 추가',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _addTodo,
                  child: const Text('추가'),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              itemCount: _todos.length,
              itemBuilder: (context, index) {
                final todo = _todos[index];
                return ListTile(
                  leading: Checkbox(
                    value: todo.completed,
                    onChanged: (_) => _toggleTodo(index),
                  ),
                  title: Text(
                    todo.title,
                    style: TextStyle(
                      decoration: todo.completed
                          ? TextDecoration.lineThrough
                          : TextDecoration.none,
                    ),
                  ),
                  trailing: IconButton(
                    icon: const Icon(Icons.delete),
                    onPressed: () => _removeTodo(index),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

### 2. ValueNotifier를 사용한 구현

```dart
class Todo {
  String title;
  bool completed;

  Todo({required this.title, this.completed = false});
}

class TodoListModel extends ChangeNotifier {
  final List<Todo> _todos = [];

  List<Todo> get todos => List.unmodifiable(_todos);

  void addTodo(String title) {
    if (title.isNotEmpty) {
      _todos.add(Todo(title: title));
      notifyListeners();
    }
  }

  void toggleTodo(int index) {
    if (index >= 0 && index < _todos.length) {
      _todos[index].completed = !_todos[index].completed;
      notifyListeners();
    }
  }

  void removeTodo(int index) {
    if (index >= 0 && index < _todos.length) {
      _todos.removeAt(index);
      notifyListeners();
    }
  }
}

class TodoListWithValueNotifier extends StatefulWidget {
  const TodoListWithValueNotifier({Key? key}) : super(key: key);

  @override
  _TodoListWithValueNotifierState createState() => _TodoListWithValueNotifierState();
}

class _TodoListWithValueNotifierState extends State<TodoListWithValueNotifier> {
  final TodoListModel _model = TodoListModel();
  final TextEditingController _controller = TextEditingController();

  void _addTodo() {
    _model.addTodo(_controller.text);
    _controller.clear();
  }

  @override
  void dispose() {
    _controller.dispose();
    _model.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('할 일 목록 (ValueNotifier)'),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: const InputDecoration(
                      labelText: '할 일 추가',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _addTodo,
                  child: const Text('추가'),
                ),
              ],
            ),
          ),
          Expanded(
            child: AnimatedBuilder(
              animation: _model,
              builder: (context, child) {
                return ListView.builder(
                  itemCount: _model.todos.length,
                  itemBuilder: (context, index) {
                    final todo = _model.todos[index];
                    return ListTile(
                      leading: Checkbox(
                        value: todo.completed,
                        onChanged: (_) => _model.toggleTodo(index),
                      ),
                      title: Text(
                        todo.title,
                        style: TextStyle(
                          decoration: todo.completed
                              ? TextDecoration.lineThrough
                              : TextDecoration.none,
                        ),
                      ),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () => _model.removeTodo(index),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
```

## 성능 고려사항

상태 관리 방식을 선택할 때는 성능도 중요한 고려사항입니다:

### setState의 성능 특징

- **위젯 전체 재빌드**: `setState()`가 호출되면 해당 `StatefulWidget`의 `build()` 메서드 전체가 다시 실행됨
- **필요한 최적화**: `const` 생성자 사용, 위젯 분리 등을 통해 재빌드 범위 최소화 필요

### ValueNotifier의 성능 특징

- **부분 업데이트**: `ValueListenableBuilder`를 사용하면 UI의 필요한 부분만 업데이트됨
- **세밀한 제어**: 여러 상태를 각각의 `ValueNotifier`로 분리하여 독립적으로 관리 가능

### 성능 최적화 팁

1. **적절한 곳에 setState 호출**: 필요한 상태 변경만 수행
2. **작은 위젯으로 분리**: 상태 변경이 필요한 부분만 `StatefulWidget`으로 분리
3. **const 위젯 활용**: 변경되지 않는 위젯은 `const` 생성자 사용
4. **ValueNotifier 세분화**: 관련 상태끼리 그룹화하되, 너무 큰 객체는 피함

## 요약

- **setState**는 Flutter의 가장 기본적인 상태 관리 메커니즘으로, 단순하고 직관적이지만 위젯 트리 깊은 곳으로 상태 전달이 어려움
- **ValueNotifier**는 좀 더 유연한 상태 관리를 제공하며, 위젯 간 상태 공유와 세분화된 UI 업데이트에 적합
- 간단한 앱에서는 이 두 가지 메커니즘만으로도 효과적인 상태 관리가 가능
- 앱이 복잡해질수록 Provider, Riverpod 등의 고급 상태 관리 솔루션 도입 고려

다음 섹션에서는 위젯 트리를 통한 상태 공유를 위한 `InheritedWidget`과 이를 기반으로 한 `Provider` 패턴에 대해 알아보겠습니다.
