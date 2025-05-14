# WidgetBook을 활용한 Flutter UI 문서화

Flutter 애플리케이션을 개발할 때 일관된 디자인 시스템을 유지하고 UI 컴포넌트를 문서화하는 것은 중요합니다. WidgetBook은 Flutter 위젯을 카탈로그화하고 대화형으로 테스트할 수 있는 도구로, Storybook이나 Styleguidist와 같은 웹 개발 도구에서 영감을 받았습니다. 이 문서에서는 WidgetBook을 설정하고 효과적으로 활용하는 방법에 대해 알아보겠습니다.

## WidgetBook이란?

WidgetBook은 다음과 같은 기능을 제공하는 Flutter 패키지입니다:

- UI 컴포넌트 문서화 및 카탈로그화
- 다양한 데이터 및 상태로 위젯 테스트
- 디자인 시스템 구축 및 유지보수
- 디자이너와 개발자 간 협업 촉진
- 위젯의 반응형 동작 시각화

## 패키지 설치

먼저 pubspec.yaml 파일에 필요한 패키지를 추가합니다:

```yaml
dependencies:
  flutter:
    sdk: flutter
  # 기타 의존성...

dev_dependencies:
  flutter_test:
    sdk: flutter
  widgetbook: ^3.0.0 # 위젯북 코어 패키지
  widgetbook_generator: ^3.0.0 # 코드 생성 도구
  build_runner: ^2.1.10 # 코드 생성 실행기
```

## 기본 구조 설정

WidgetBook을 구성하기 위한 기본 파일을 생성합니다:

### 1. WidgetBook 실행 파일 생성

독립적인 WidgetBook 앱을 위한 진입점을 생성합니다. 프로젝트 루트에 `widgetbook.dart` 파일을 생성합니다:

```dart
// widgetbook.dart
import 'package:flutter/material.dart';
import 'package:widgetbook/widgetbook.dart';
import 'package:your_app/theme.dart'; // 앱 테마 임포트

void main() {
  runApp(const WidgetbookApp());
}

class WidgetbookApp extends StatelessWidget {
  const WidgetbookApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Widgetbook.material(
      // 앱 정보 설정
      appInfo: AppInfo(name: 'MyApp 컴포넌트'),

      // 테마 설정
      themes: [
        WidgetbookTheme(
          name: '라이트 테마',
          data: AppTheme.lightTheme,
        ),
        WidgetbookTheme(
          name: '다크 테마',
          data: AppTheme.darkTheme,
        ),
      ],

      // 디바이스 프레임 설정
      devices: [
        Apple.iPhone13,
        Samsung.s21ultra,
        const DeviceInfo.custom(
          name: '태블릿',
          resolution: Resolution(
            nativeSize: DeviceSize(width: 1024, height: 768),
            scaleFactor: 1,
          ),
        ),
      ],

      // 위젯 카테고리 설정
      categories: [
        WidgetbookCategory(
          name: '기본 컴포넌트',
          widgets: [
            // 여기에 위젯 사용 사례 추가
          ],
          categories: [
            WidgetbookCategory(
              name: '버튼',
              widgets: [
                // 버튼 위젯 사용 사례
              ],
            ),
            WidgetbookCategory(
              name: '입력 필드',
              widgets: [
                // 입력 필드 위젯 사용 사례
              ],
            ),
          ],
        ),
      ],
    );
  }
}
```

### 2. 시작 스크립트 설정

package.json 파일이나 Makefile에 WidgetBook 실행 명령어를 추가합니다:

```json
{
  "scripts": {
    "widgetbook": "flutter run -d chrome -t widgetbook.dart"
  }
}
```

## 자동 코드 생성 설정

WidgetBook은 코드 생성을 통해 설정의 복잡성을 줄일 수 있습니다. 다음과 같이 설정합니다:

### 1. widgetbook_component.dart 파일 생성

프로젝트에 `lib/widgetbook/widgetbook_component.dart` 파일을 생성합니다:

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

// 코드 생성을 위한 애너테이션
@widgetbook.App()
class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```

### 2. build.yaml 설정

프로젝트 루트에 `build.yaml` 파일을 생성하여 코드 생성 설정을 추가합니다:

```yaml
targets:
  $default:
    builders:
      widgetbook_generator:
        options:
          output_directory: lib/widgetbook
          generator_type: widgetbook
```

### 3. 코드 생성 실행

다음 명령어로 코드를 생성합니다:

```bash
flutter pub run build_runner build
```

## 위젯 사용 사례 문서화

위젯을 문서화하기 위해 사용 사례(use case)를 정의합니다:

### 1. 기본 버튼 사용 사례 예제

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '기본 버튼',
  type: ElevatedButton,
  designLink: 'https://www.figma.com/file/...',
)
Widget elevatedButtonUseCase(BuildContext context) {
  return Center(
    child: ElevatedButton(
      onPressed: () {},
      child: const Text('기본 버튼'),
    ),
  );
}

@widgetbook.UseCase(
  name: '비활성화된 버튼',
  type: ElevatedButton,
)
Widget disabledElevatedButtonUseCase(BuildContext context) {
  return Center(
    child: ElevatedButton(
      onPressed: null, // null은 버튼을 비활성화함
      child: const Text('비활성화된 버튼'),
    ),
  );
}

@widgetbook.UseCase(
  name: '아이콘 버튼',
  type: ElevatedButton,
)
Widget iconElevatedButtonUseCase(BuildContext context) {
  return Center(
    child: ElevatedButton.icon(
      onPressed: () {},
      icon: const Icon(Icons.favorite),
      label: const Text('좋아요'),
    ),
  );
}
```

### 2. 텍스트 필드 사용 사례 예제

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '기본 텍스트 필드',
  type: TextField,
)
Widget textFieldUseCase(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16.0),
    child: TextField(
      decoration: InputDecoration(
        labelText: '이름',
        hintText: '이름을 입력하세요',
      ),
    ),
  );
}

@widgetbook.UseCase(
  name: '비밀번호 텍스트 필드',
  type: TextField,
)
Widget passwordTextFieldUseCase(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16.0),
    child: TextField(
      obscureText: true,
      decoration: InputDecoration(
        labelText: '비밀번호',
        hintText: '비밀번호를 입력하세요',
        suffixIcon: Icon(Icons.visibility),
      ),
    ),
  );
}

@widgetbook.UseCase(
  name: '오류 상태 텍스트 필드',
  type: TextField,
)
Widget errorTextFieldUseCase(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16.0),
    child: TextField(
      decoration: InputDecoration(
        labelText: '이메일',
        hintText: '이메일을 입력하세요',
        errorText: '유효한 이메일 주소를 입력해주세요',
      ),
    ),
  );
}
```

## 매개변수 제어를 위한 Knobs 사용

Knobs를 사용하면 UI를 통해 위젯의 매개변수를 동적으로 변경할 수 있습니다:

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook/widgetbook.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '커스터마이징 가능한 버튼',
  type: ElevatedButton,
)
Widget customizableButtonUseCase(BuildContext context) {
  // 텍스트 Knob
  final buttonText = context.knobs.text(
    label: '버튼 텍스트',
    initialValue: '버튼',
  );

  // 색상 Knob
  final buttonColor = context.knobs.color(
    label: '버튼 색상',
    initialValue: Colors.blue,
  );

  // 숫자 Knob (크기 조절)
  final fontSize = context.knobs.number(
    label: '글자 크기',
    initialValue: 16,
    min: 10,
    max: 30,
  );

  // 불리언 Knob (활성화/비활성화)
  final isEnabled = context.knobs.boolean(
    label: '활성화',
    initialValue: true,
  );

  // 옵션 Knob (버튼 형태)
  final buttonShape = context.knobs.options(
    label: '버튼 형태',
    options: [
      Option(label: '기본', value: 0.0),
      Option(label: '둥근 모서리', value: 8.0),
      Option(label: '원형', value: 20.0),
    ],
  );

  return Center(
    child: ElevatedButton(
      onPressed: isEnabled ? () {} : null,
      style: ElevatedButton.styleFrom(
        backgroundColor: buttonColor,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(buttonShape),
        ),
      ),
      child: Text(
        buttonText,
        style: TextStyle(fontSize: fontSize),
      ),
    ),
  );
}
```

## 복잡한 컴포넌트 문서화

더 복잡한 컴포넌트나 화면을 문서화하는 방법입니다:

### 1. 회원가입 폼 예제

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '회원가입 폼',
  type: SignUpForm,
  designLink: 'https://www.figma.com/file/...',
)
Widget signUpFormUseCase(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16.0),
    child: SignUpForm(),
  );
}

class SignUpForm extends StatefulWidget {
  const SignUpForm({super.key});

  @override
  State<SignUpForm> createState() => _SignUpFormState();
}

class _SignUpFormState extends State<SignUpForm> {
  final _formKey = GlobalKey<FormState>();
  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            '회원가입',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          TextFormField(
            decoration: const InputDecoration(
              labelText: '이름',
              prefixIcon: Icon(Icons.person),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return '이름을 입력해주세요';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            decoration: const InputDecoration(
              labelText: '이메일',
              prefixIcon: Icon(Icons.email),
            ),
            keyboardType: TextInputType.emailAddress,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return '이메일을 입력해주세요';
              }
              if (!value.contains('@')) {
                return '유효한 이메일 주소를 입력해주세요';
              }
              return null;
            },
          ),
          const SizedBox(height: 16),
          TextFormField(
            decoration: InputDecoration(
              labelText: '비밀번호',
              prefixIcon: const Icon(Icons.lock),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility : Icons.visibility_off,
                ),
                onPressed: () {
                  setState(() {
                    _obscurePassword = !_obscurePassword;
                  });
                },
              ),
            ),
            obscureText: _obscurePassword,
            validator: (value) {
              if (value == null || value.isEmpty) {
                return '비밀번호를 입력해주세요';
              }
              if (value.length < 8) {
                return '비밀번호는 8자 이상이어야 합니다';
              }
              return null;
            },
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              if (_formKey.currentState!.validate()) {
                // 폼 처리 로직
              }
            },
            child: const Text('가입하기'),
          ),
          const SizedBox(height: 16),
          TextButton(
            onPressed: () {},
            child: const Text('이미 계정이 있으신가요? 로그인하기'),
          ),
        ],
      ),
    );
  }
}
```

### 2. 카드 컴포넌트 예제

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '제품 카드',
  type: ProductCard,
)
Widget productCardUseCase(BuildContext context) {
  final isDiscounted = context.knobs.boolean(
    label: '할인 적용',
    initialValue: false,
  );

  final rating = context.knobs.slider(
    label: '평점',
    initialValue: 4.5,
    min: 1.0,
    max: 5.0,
    divisions: 8,
  );

  return Center(
    child: ProductCard(
      title: '스마트폰',
      imageUrl: 'https://example.com/smartphone.jpg',
      price: 1000000,
      discountPrice: isDiscounted ? 850000 : null,
      rating: rating,
      onPressed: () {},
    ),
  );
}

class ProductCard extends StatelessWidget {
  final String title;
  final String imageUrl;
  final int price;
  final int? discountPrice;
  final double rating;
  final VoidCallback onPressed;

  const ProductCard({
    super.key,
    required this.title,
    required this.imageUrl,
    required this.price,
    this.discountPrice,
    required this.rating,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      clipBehavior: Clip.antiAlias,
      elevation: 2,
      child: InkWell(
        onTap: onPressed,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 이미지 플레이스홀더
            AspectRatio(
              aspectRatio: 16 / 9,
              child: Container(
                color: Colors.grey[300],
                child: const Center(child: Icon(Icons.image)),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(12.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  if (discountPrice != null) ...[
                    Text(
                      '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}원',
                      style: TextStyle(
                        decoration: TextDecoration.lineThrough,
                        color: Colors.grey[600],
                      ),
                    ),
                    Text(
                      '${discountPrice.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}원',
                      style: const TextStyle(
                        fontWeight: FontWeight.bold,
                        color: Colors.red,
                      ),
                    ),
                  ] else
                    Text(
                      '${price.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (Match m) => '${m[1]},')}원',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Icon(Icons.star, color: Colors.amber, size: 18),
                      const SizedBox(width: 4),
                      Text(rating.toStringAsFixed(1)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

## 반응형 디자인 테스트

WidgetBook을 사용하여 반응형 디자인을 테스트하는 방법:

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

@widgetbook.UseCase(
  name: '반응형 레이아웃',
  type: ResponsiveLayout,
)
Widget responsiveLayoutUseCase(BuildContext context) {
  return const ResponsiveLayout(
    mobileChild: MobileView(),
    tabletChild: TabletView(),
    desktopChild: DesktopView(),
  );
}

class ResponsiveLayout extends StatelessWidget {
  final Widget mobileChild;
  final Widget tabletChild;
  final Widget desktopChild;

  const ResponsiveLayout({
    super.key,
    required this.mobileChild,
    required this.tabletChild,
    required this.desktopChild,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;

    if (width < 600) {
      return mobileChild;
    } else if (width < 1200) {
      return tabletChild;
    } else {
      return desktopChild;
    }
  }
}

class MobileView extends StatelessWidget {
  const MobileView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('모바일 뷰')),
      body: ListView(
        children: List.generate(
          10,
          (index) => ListTile(
            leading: CircleAvatar(child: Text('${index + 1}')),
            title: Text('항목 ${index + 1}'),
            subtitle: const Text('모바일 레이아웃'),
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: '홈'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: '검색'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: '프로필'),
        ],
        currentIndex: 0,
        onTap: (_) {},
      ),
    );
  }
}

class TabletView extends StatelessWidget {
  const TabletView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('태블릿 뷰')),
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: 0,
            onDestinationSelected: (_) {},
            destinations: const [
              NavigationRailDestination(
                icon: Icon(Icons.home),
                label: Text('홈'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.search),
                label: Text('검색'),
              ),
              NavigationRailDestination(
                icon: Icon(Icons.person),
                label: Text('프로필'),
              ),
            ],
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: 10,
              itemBuilder: (context, index) {
                return Card(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 30,
                        child: Text('${index + 1}'),
                      ),
                      const SizedBox(height: 8),
                      Text('항목 ${index + 1}'),
                      const Text('태블릿 레이아웃'),
                    ],
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

class DesktopView extends StatelessWidget {
  const DesktopView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('데스크톱 뷰')),
      body: Row(
        children: [
          Drawer(
            child: ListView(
              children: [
                const DrawerHeader(
                  child: Text(
                    '메뉴',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                  ),
                  decoration: BoxDecoration(
                    color: Colors.blue,
                  ),
                ),
                ListTile(
                  leading: const Icon(Icons.home),
                  title: const Text('홈'),
                  selected: true,
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(Icons.search),
                  title: const Text('검색'),
                  onTap: () {},
                ),
                ListTile(
                  leading: const Icon(Icons.person),
                  title: const Text('프로필'),
                  onTap: () {},
                ),
              ],
            ),
          ),
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.all(16),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: 20,
              itemBuilder: (context, index) {
                return Card(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        radius: 30,
                        child: Text('${index + 1}'),
                      ),
                      const SizedBox(height: 8),
                      Text('항목 ${index + 1}'),
                      const Text('데스크톱 레이아웃'),
                    ],
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

## 위젯북에서 상태 관리

WidgetBook에서 Provider, Riverpod 등의 상태 관리 도구를 사용하는 방법:

### Riverpod과 함께 사용하기

```dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

// 카운터 상태 제공자
final counterProvider = StateProvider<int>((ref) => 0);

@widgetbook.UseCase(
  name: 'Riverpod 카운터',
  type: CounterWidget,
)
Widget riverpodCounterUseCase(BuildContext context) {
  return ProviderScope(
    child: CounterWidget(),
  );
}

class CounterWidget extends ConsumerWidget {
  const CounterWidget({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '$count',
            style: Theme.of(context).textTheme.headline2,
          ),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => ref.read(counterProvider.notifier).state++,
            child: const Text('증가'),
          ),
          const SizedBox(height: 8),
          ElevatedButton(
            onPressed: () => ref.read(counterProvider.notifier).state--,
            child: const Text('감소'),
          ),
        ],
      ),
    );
  }
}
```

## 동적 API 데이터 모의 처리

실제 API 데이터를 시뮬레이션하여 데이터 의존적인 위젯을 문서화하는 방법:

```dart
import 'package:flutter/material.dart';
import 'package:widgetbook_annotation/widgetbook_annotation.dart' as widgetbook;

// 모의 데이터 서비스
class MockDataService {
  Future<List<User>> getUsers() async {
    // API 호출 시뮬레이션
    await Future.delayed(const Duration(seconds: 1));

    return [
      User(id: 1, name: '홍길동', email: 'hong@example.com'),
      User(id: 2, name: '김철수', email: 'kim@example.com'),
      User(id: 3, name: '이영희', email: 'lee@example.com'),
    ];
  }
}

class User {
  final int id;
  final String name;
  final String email;

  User({required this.id, required this.name, required this.email});
}

@widgetbook.UseCase(
  name: '사용자 목록',
  type: UserListWidget,
)
Widget userListUseCase(BuildContext context) {
  final isLoading = context.knobs.boolean(
    label: '로딩 중',
    initialValue: false,
  );

  final hasError = context.knobs.boolean(
    label: '오류 발생',
    initialValue: false,
  );

  final isEmpty = context.knobs.boolean(
    label: '빈 목록',
    initialValue: false,
  );

  return UserListWidget(
    mockService: MockDataService(),
    isLoading: isLoading,
    hasError: hasError,
    isEmpty: isEmpty,
  );
}

class UserListWidget extends StatefulWidget {
  final MockDataService mockService;
  final bool isLoading;
  final bool hasError;
  final bool isEmpty;

  const UserListWidget({
    super.key,
    required this.mockService,
    this.isLoading = false,
    this.hasError = false,
    this.isEmpty = false,
  });

  @override
  State<UserListWidget> createState() => _UserListWidgetState();
}

class _UserListWidgetState extends State<UserListWidget> {
  late Future<List<User>> _usersFuture;

  @override
  void initState() {
    super.initState();
    _loadUsers();
  }

  @override
  void didUpdateWidget(UserListWidget oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.isLoading != widget.isLoading ||
        oldWidget.hasError != widget.hasError ||
        oldWidget.isEmpty != widget.isEmpty) {
      _loadUsers();
    }
  }

  void _loadUsers() {
    if (widget.isLoading) {
      _usersFuture = Future.delayed(const Duration(days: 1), () => <User>[]);
    } else if (widget.hasError) {
      _usersFuture = Future.error('데이터 로드 중 오류가 발생했습니다.');
    } else if (widget.isEmpty) {
      _usersFuture = Future.value(<User>[]);
    } else {
      _usersFuture = widget.mockService.getUsers();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('사용자 목록')),
      body: FutureBuilder<List<User>>(
        future: _usersFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.error, size: 48, color: Colors.red),
                  const SizedBox(height: 16),
                  Text('오류: ${snapshot.error}'),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => setState(() => _loadUsers()),
                    child: const Text('다시 시도'),
                  ),
                ],
              ),
            );
          }

          final users = snapshot.data ?? [];

          if (users.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.people, size: 48, color: Colors.grey),
                  SizedBox(height: 16),
                  Text('사용자 정보가 없습니다.'),
                ],
              ),
            );
          }

          return ListView.builder(
            itemCount: users.length,
            itemBuilder: (context, index) {
              final user = users[index];

              return ListTile(
                leading: CircleAvatar(
                  child: Text(user.name.substring(0, 1)),
                ),
                title: Text(user.name),
                subtitle: Text(user.email),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {},
              );
            },
          );
        },
      ),
    );
  }
}
```

## 효과적인 위젯북 구성 팁

위젯북을 더 효과적으로 활용하기 위한 팁:

1. **논리적으로 카테고리화**:

   - 위젯을 기능, 유형 또는 페이지별로 그룹화
   - 데이터 입력, 탐색, 표시 등으로 분류

2. **일관된 명명 규칙**:

   - 명확하고 일관된 이름으로 컴포넌트와 사용 사례 명명
   - 패턴 사용(예: "기본", "비활성화", "오류 상태")

3. **연동 문서화**:

   - Figma나 Zeplin 링크 포함하여 디자인과 코드 매핑
   - 필요한 경우 추가 설명이나 사용 지침 제공

4. **자동화 및 CI 통합**:
   - 커밋 또는 병합 시 위젯북 자동 빌드
   - 위젯북 웹 버전을 팀 내부 서버에 배포

## 결론

WidgetBook은 Flutter 애플리케이션의 UI 컴포넌트를 문서화하고 테스트하기 위한 강력한 도구입니다. 이를 통해 디자이너와 개발자 간의 협업을 촉진하고, 일관된 디자인 시스템을 유지할 수 있습니다. 특히 팀 규모가 커지거나 프로젝트가 복잡해질수록 WidgetBook의 가치는 더욱 커집니다.

효과적인 UI 문서화는 코드의 재사용성을 높이고, 디자인 일관성을 유지하며, 신규 팀원의 온보딩을 용이하게 하는 등 다양한 이점을 제공합니다. WidgetBook을 프로젝트에 통합하여 효율적인 UI 개발 환경을 구축해 보세요.
