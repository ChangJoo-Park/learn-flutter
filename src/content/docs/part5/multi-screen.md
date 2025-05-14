---
title: 실습. 복수 화면 전환
---

이 장에서는 go_router를 사용하여 복수 화면 전환을 구현하는 실습을 진행하겠습니다. 구체적으로는 할 일 관리 앱(Todo App)을 만들면서, 여러 화면 간의 네비게이션과 데이터 전달 방법을 익혀보겠습니다.

## 실습 개요

우리가 만들 할 일 관리 앱은 다음과 같은 화면들로 구성됩니다:

1. **홈 화면**: 할 일 목록 표시 및 카테고리별 필터링
2. **할 일 상세 화면**: 선택한 할 일의 세부 정보 표시
3. **할 일 추가/편집 화면**: 새 할 일 추가 또는 기존 할 일 편집
4. **프로필 화면**: 사용자 정보 및 설정
5. **통계 화면**: 할 일 완료율 등 통계 정보

## 1. 프로젝트 설정

먼저 새 Flutter 프로젝트를 생성하고 필요한 패키지를 추가합니다:

```bash
flutter create todo_app
cd todo_app
```

`pubspec.yaml` 파일에 필요한 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  go_router: ^10.0.0
  provider: ^6.0.5
  uuid: ^3.0.7
```

패키지를 설치합니다:

```bash
flutter pub get
```

## 2. 모델 정의

할 일 항목을 표현하는 모델 클래스를 정의합니다:

```dart
// lib/models/todo.dart
import 'package:uuid/uuid.dart';

class Todo {
  final String id;
  final String title;
  final String description;
  final bool isCompleted;
  final DateTime createdAt;
  final String category;

  Todo({
    String? id,
    required this.title,
    this.description = '',
    this.isCompleted = false,
    DateTime? createdAt,
    this.category = 'general',
  })  : id = id ?? const Uuid().v4(),
        createdAt = createdAt ?? DateTime.now();

  Todo copyWith({
    String? title,
    String? description,
    bool? isCompleted,
    String? category,
  }) {
    return Todo(
      id: id,
      title: title ?? this.title,
      description: description ?? this.description,
      isCompleted: isCompleted ?? this.isCompleted,
      createdAt: createdAt,
      category: category ?? this.category,
    );
  }
}
```

## 3. 상태 관리

Provider를 사용하여 할 일 목록 상태를 관리합니다:

```dart
// lib/providers/todo_provider.dart
import 'package:flutter/foundation.dart';
import '../models/todo.dart';

class TodoProvider extends ChangeNotifier {
  final List<Todo> _todos = [];
  String _filter = 'all';
  final List<String> _categories = ['general', 'work', 'personal', 'shopping'];

  // 게터
  List<Todo> get todos => _filter == 'all'
      ? _todos
      : _filter == 'completed'
          ? _todos.where((todo) => todo.isCompleted).toList()
          : _filter == 'active'
              ? _todos.where((todo) => !todo.isCompleted).toList()
              : _todos
                  .where((todo) => todo.category == _filter)
                  .toList();

  List<String> get categories => _categories;
  String get filter => _filter;

  // 필터 설정
  void setFilter(String filter) {
    _filter = filter;
    notifyListeners();
  }

  // 할 일 추가
  void addTodo(Todo todo) {
    _todos.add(todo);
    notifyListeners();
  }

  // 할 일 업데이트
  void updateTodo(Todo todo) {
    final index = _todos.indexWhere((t) => t.id == todo.id);
    if (index >= 0) {
      _todos[index] = todo;
      notifyListeners();
    }
  }

  // 할 일 삭제
  void deleteTodo(String id) {
    _todos.removeWhere((todo) => todo.id == id);
    notifyListeners();
  }

  // 할 일 토글 (완료/미완료)
  void toggleTodo(String id) {
    final index = _todos.indexWhere((todo) => todo.id == id);
    if (index >= 0) {
      final todo = _todos[index];
      _todos[index] = todo.copyWith(isCompleted: !todo.isCompleted);
      notifyListeners();
    }
  }

  // ID로 할 일 찾기
  Todo? getTodoById(String id) {
    try {
      return _todos.firstWhere((todo) => todo.id == id);
    } catch (e) {
      return null;
    }
  }
}
```

## 4. 라우터 설정

go_router를 사용하여 앱의 라우팅을 설정합니다:

```dart
// lib/router/app_router.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';
import '../screens/home_screen.dart';
import '../screens/todo_detail_screen.dart';
import '../screens/todo_edit_screen.dart';
import '../screens/profile_screen.dart';
import '../screens/stats_screen.dart';

class AppRouter {
  final TodoProvider todoProvider;

  AppRouter(this.todoProvider);

  late final GoRouter router = GoRouter(
    initialLocation: '/',
    debugLogDiagnostics: true,
    routes: [
      // 메인 쉘 라우트 (바텀 네비게이션 바 포함)
      StatefulShellRoute.indexedStack(
        builder: (context, state, navigationShell) {
          return ScaffoldWithNavBar(navigationShell: navigationShell);
        },
        branches: [
          // 홈 탭
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/',
                builder: (context, state) => const HomeScreen(),
                routes: [
                  // 할 일 상세 화면 (홈 탭 내 중첩 라우트)
                  GoRoute(
                    path: 'todo/:id',
                    builder: (context, state) {
                      final id = state.pathParameters['id']!;
                      return TodoDetailScreen(todoId: id);
                    },
                  ),
                  // 할 일 추가 화면
                  GoRoute(
                    path: 'add',
                    builder: (context, state) => const TodoEditScreen(),
                  ),
                  // 할 일 편집 화면
                  GoRoute(
                    path: 'edit/:id',
                    builder: (context, state) {
                      final id = state.pathParameters['id']!;
                      final todo = todoProvider.getTodoById(id);
                      return TodoEditScreen(todo: todo);
                    },
                  ),
                ],
              ),
            ],
          ),
          // 통계 탭
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/stats',
                builder: (context, state) => const StatsScreen(),
              ),
            ],
          ),
          // 프로필 탭
          StatefulShellBranch(
            routes: [
              GoRoute(
                path: '/profile',
                builder: (context, state) => const ProfileScreen(),
              ),
            ],
          ),
        ],
      ),
    ],
    errorBuilder: (context, state) => Scaffold(
      appBar: AppBar(title: const Text('페이지를 찾을 수 없음')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('요청한 페이지를 찾을 수 없습니다.'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () => context.go('/'),
              child: const Text('홈으로 돌아가기'),
            ),
          ],
        ),
      ),
    ),
  );
}

// 바텀 네비게이션 바가 있는 스캐폴드
class ScaffoldWithNavBar extends StatelessWidget {
  final StatefulNavigationShell navigationShell;

  const ScaffoldWithNavBar({
    Key? key,
    required this.navigationShell,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: navigationShell.currentIndex,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.bar_chart), label: '통계'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
        ],
        onTap: (index) => navigationShell.goBranch(index),
      ),
    );
  }
}
```

## 5. 화면 구현

이제 각 화면을 구현해 보겠습니다:

### 5.1 홈 화면

```dart
// lib/screens/home_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';
import '../widgets/todo_item.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final todoProvider = Provider.of<TodoProvider>(context);
    final todos = todoProvider.todos;
    final categories = todoProvider.categories;

    return Scaffold(
      appBar: AppBar(
        title: const Text('할 일 목록'),
        actions: [
          // 필터 메뉴
          PopupMenuButton<String>(
            icon: const Icon(Icons.filter_list),
            onSelected: (value) {
              todoProvider.setFilter(value);
            },
            itemBuilder: (context) => [
              const PopupMenuItem(
                value: 'all',
                child: Text('모든 할 일'),
              ),
              const PopupMenuItem(
                value: 'completed',
                child: Text('완료된 할 일'),
              ),
              const PopupMenuItem(
                value: 'active',
                child: Text('미완료 할 일'),
              ),
              const PopupMenuItem(
                value: 'general',
                child: Text('일반'),
              ),
              const PopupMenuItem(
                value: 'work',
                child: Text('업무'),
              ),
              const PopupMenuItem(
                value: 'personal',
                child: Text('개인'),
              ),
              const PopupMenuItem(
                value: 'shopping',
                child: Text('쇼핑'),
              ),
            ],
          ),
        ],
      ),
      body: todos.isEmpty
          ? const Center(
              child: Text('할 일이 없습니다. 새 할 일을 추가해보세요!'),
            )
          : ListView.builder(
              itemCount: todos.length,
              itemBuilder: (context, index) {
                final todo = todos[index];
                return TodoItem(
                  todo: todo,
                  onTap: () => context.go('/todo/${todo.id}'),
                  onToggle: () => todoProvider.toggleTodo(todo.id),
                );
              },
            ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.go('/add'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
```

### 5.2 할 일 항목 위젯

```dart
// lib/widgets/todo_item.dart
import 'package:flutter/material.dart';
import '../models/todo.dart';

class TodoItem extends StatelessWidget {
  final Todo todo;
  final VoidCallback onTap;
  final VoidCallback onToggle;

  const TodoItem({
    Key? key,
    required this.todo,
    required this.onTap,
    required this.onToggle,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        todo.title,
        style: TextStyle(
          decoration: todo.isCompleted ? TextDecoration.lineThrough : null,
          color: todo.isCompleted ? Colors.grey : null,
        ),
      ),
      subtitle: Text(
        '카테고리: ${todo.category}',
        style: TextStyle(
          color: todo.isCompleted ? Colors.grey : Colors.black54,
        ),
      ),
      leading: Checkbox(
        value: todo.isCompleted,
        onChanged: (_) => onToggle(),
      ),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }
}
```

### 5.3 할 일 상세 화면

```dart
// lib/screens/todo_detail_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';
import '../models/todo.dart';

class TodoDetailScreen extends StatelessWidget {
  final String todoId;

  const TodoDetailScreen({
    Key? key,
    required this.todoId,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final todoProvider = Provider.of<TodoProvider>(context);
    final todo = todoProvider.getTodoById(todoId);

    if (todo == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('할 일 없음')),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('요청한 할 일을 찾을 수 없습니다.'),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () => context.go('/'),
                child: const Text('홈으로 돌아가기'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('할 일 상세'),
        actions: [
          // 편집 버튼
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () => context.go('/edit/${todo.id}'),
          ),
          // 삭제 버튼
          IconButton(
            icon: const Icon(Icons.delete),
            onPressed: () {
              todoProvider.deleteTodo(todo.id);
              context.go('/');
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 제목
            Text(
              todo.title,
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            const SizedBox(height: 8),

            // 카테고리
            Chip(
              label: Text(todo.category),
              backgroundColor: Colors.blue.shade100,
            ),
            const SizedBox(height: 16),

            // 생성 날짜
            Text(
              '생성일: ${_formatDate(todo.createdAt)}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 16),

            // 상태
            Row(
              children: [
                const Text('상태: '),
                Checkbox(
                  value: todo.isCompleted,
                  onChanged: (_) {
                    todoProvider.toggleTodo(todo.id);
                  },
                ),
                Text(todo.isCompleted ? '완료' : '미완료'),
              ],
            ),
            const SizedBox(height: 16),

            // 설명
            const Text(
              '설명:',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey.shade300),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                todo.description.isEmpty ? '(설명 없음)' : todo.description,
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.year}년 ${date.month}월 ${date.day}일';
  }
}
```

### 5.4 할 일 추가/편집 화면

```dart
// lib/screens/todo_edit_screen.dart
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';

import '../models/todo.dart';
import '../providers/todo_provider.dart';

class TodoEditScreen extends StatefulWidget {
  final Todo? todo;

  const TodoEditScreen({Key? key, this.todo}) : super(key: key);

  @override
  _TodoEditScreenState createState() => _TodoEditScreenState();
}

class _TodoEditScreenState extends State<TodoEditScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  String _category = 'general';
  bool _isCompleted = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.todo?.title ?? '');
    _descriptionController = TextEditingController(text: widget.todo?.description ?? '');
    _category = widget.todo?.category ?? 'general';
    _isCompleted = widget.todo?.isCompleted ?? false;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _saveTodo() {
    if (_formKey.currentState!.validate()) {
      final todoProvider = Provider.of<TodoProvider>(context, listen: false);

      if (widget.todo == null) {
        // 새 할 일 추가
        final newTodo = Todo(
          title: _titleController.text,
          description: _descriptionController.text,
          category: _category,
          isCompleted: _isCompleted,
        );
        todoProvider.addTodo(newTodo);
      } else {
        // 기존 할 일 수정
        final updatedTodo = Todo(
          id: widget.todo!.id,
          title: _titleController.text,
          description: _descriptionController.text,
          category: _category,
          isCompleted: _isCompleted,
          createdAt: widget.todo!.createdAt,
        );
        todoProvider.updateTodo(updatedTodo);
      }

      context.go('/');
    }
  }

  @override
  Widget build(BuildContext context) {
    final todoProvider = Provider.of<TodoProvider>(context);
    final categories = todoProvider.categories;

    return Scaffold(
      appBar: AppBar(
        title: Text(widget.todo == null ? '할 일 추가' : '할 일 편집'),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 제목 입력
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: '제목',
                  border: OutlineInputBorder(),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return '제목을 입력해주세요';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),

              // 설명 입력
              TextFormField(
                controller: _descriptionController,
                decoration: const InputDecoration(
                  labelText: '설명',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),

              // 카테고리 선택
              DropdownButtonFormField<String>(
                value: _category,
                decoration: const InputDecoration(
                  labelText: '카테고리',
                  border: OutlineInputBorder(),
                ),
                items: categories.map((category) {
                  return DropdownMenuItem(
                    value: category,
                    child: Text(category),
                  );
                }).toList(),
                onChanged: (value) {
                  setState(() {
                    _category = value!;
                  });
                },
              ),
              const SizedBox(height: 16),

              // 완료 상태 토글
              CheckboxListTile(
                title: const Text('완료 상태'),
                value: _isCompleted,
                onChanged: (value) {
                  setState(() {
                    _isCompleted = value!;
                  });
                },
                controlAffinity: ListTileControlAffinity.leading,
              ),
              const SizedBox(height: 32),

              // 저장 버튼
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _saveTodo,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text(
                    widget.todo == null ? '추가하기' : '수정하기',
                    style: const TextStyle(fontSize: 16),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

### 5.5 통계 화면

```dart
// lib/screens/stats_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';

class StatsScreen extends StatelessWidget {
  const StatsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final todoProvider = Provider.of<TodoProvider>(context);
    final todos = todoProvider.todos;
    final completedTodos = todos.where((todo) => todo.isCompleted).toList();

    final completionRate = todos.isEmpty
        ? 0.0
        : (completedTodos.length / todos.length) * 100;

    // 카테고리별 할 일 수
    final categoryStats = <String, int>{};
    for (final category in todoProvider.categories) {
      categoryStats[category] = todos
          .where((todo) => todo.category == category)
          .length;
    }

    return Scaffold(
      appBar: AppBar(title: const Text('통계')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 총계
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '전체 요약',
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                    const Divider(),
                    _buildStatItem('전체 할 일', todos.length.toString()),
                    _buildStatItem('완료된 할 일', completedTodos.length.toString()),
                    _buildStatItem('진행 중인 할 일',
                        (todos.length - completedTodos.length).toString()),
                    _buildStatItem('완료율', '${completionRate.toStringAsFixed(1)}%'),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // 카테고리별 통계
            Text(
              '카테고리별 통계',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Expanded(
              child: ListView.builder(
                itemCount: categoryStats.length,
                itemBuilder: (context, index) {
                  final category = todoProvider.categories[index];
                  final count = categoryStats[category] ?? 0;
                  return Card(
                    child: ListTile(
                      title: Text(category),
                      trailing: Text(
                        count.toString(),
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
```

### 5.6 프로필 화면

```dart
// lib/screens/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/todo_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final todoProvider = Provider.of<TodoProvider>(context);

    return Scaffold(
      appBar: AppBar(title: const Text('프로필')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const CircleAvatar(
              radius: 50,
              child: Icon(Icons.person, size: 50),
            ),
            const SizedBox(height: 16),
            const Text(
              '사용자',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),
            const Text('user@example.com'),
            const SizedBox(height: 32),

            // 사용 통계
            const Text(
              '사용 통계',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildStatItem(context, '총 할 일 수',
                todoProvider.todos.length.toString()),
            _buildStatItem(context, '완료한 할 일',
                todoProvider.todos.where((todo) => todo.isCompleted).length.toString()),

            const SizedBox(height: 32),

            // 설정 섹션
            const Text(
              '설정',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            _buildSettingItem(
              context,
              Icons.notifications,
              '알림 설정',
              () => _showNotImplementedSnackBar(context),
            ),
            _buildSettingItem(
              context,
              Icons.color_lens,
              '테마 설정',
              () => _showNotImplementedSnackBar(context),
            ),
            _buildSettingItem(
              context,
              Icons.language,
              '언어 설정',
              () => _showNotImplementedSnackBar(context),
            ),
            _buildSettingItem(
              context,
              Icons.info,
              '앱 정보',
              () => _showNotImplementedSnackBar(context),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(BuildContext context, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label),
          Text(
            value,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildSettingItem(
    BuildContext context,
    IconData icon,
    String label,
    VoidCallback onTap,
  ) {
    return ListTile(
      leading: Icon(icon),
      title: Text(label),
      trailing: const Icon(Icons.chevron_right),
      onTap: onTap,
    );
  }

  void _showNotImplementedSnackBar(BuildContext context) {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('이 기능은 아직 구현되지 않았습니다.'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}
```

## 6. 메인 앱 통합

마지막으로 모든 구성 요소를 메인 앱에 통합합니다:

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/todo_provider.dart';
import 'router/app_router.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => TodoProvider(),
      child: Builder(
        builder: (context) {
          final todoProvider = Provider.of<TodoProvider>(context);
          final appRouter = AppRouter(todoProvider);

          return MaterialApp.router(
            title: '할 일 관리 앱',
            theme: ThemeData(
              primarySwatch: Colors.blue,
              useMaterial3: true,
            ),
            routerConfig: appRouter.router,
          );
        },
      ),
    );
  }
}
```

## 7. 실행 및 테스트

이제 앱을 실행하고 다양한 화면 전환 시나리오를 테스트해 봅시다:

1. 홈 화면에서 할 일 목록 확인
2. 새 할 일 추가
3. 할 일 상세 정보 확인
4. 할 일 편집
5. 할 일 삭제
6. 카테고리별 필터링
7. 바텀 네비게이션 바를 통한 화면 전환
8. 통계 화면에서 완료율 확인
9. 프로필 화면 확인

## 요약

이 실습을 통해 우리는 다음과 같은 개념을 학습했습니다:

1. **go_router를 사용한 라우팅 설정**: 다양한 경로와 매개변수를 정의하고 관리하는 방법
2. **StatefulShellRoute를 활용한 바텀 네비게이션 바**: 탭 기반 UI에서 네비게이션 상태를 유지하는 방법
3. **화면 간 데이터 전달**: 경로 매개변수와 상태 관리를 통한 데이터 전달 방법
4. **중첩 라우트**: 탭 내부에서 다른 화면으로 이동하는 방법
5. **Provider와 함께 사용**: 상태 관리와 라우팅을 통합하는 방법

이러한 기술을 활용하면 복잡한 네비게이션 패턴을 가진 앱도 효과적으로 구현할 수 있습니다. 다음 섹션에서는 Drawer, BottomNavigationBar, TabBar와 같은 다양한 네비게이션 위젯에 대해 알아보겠습니다.
