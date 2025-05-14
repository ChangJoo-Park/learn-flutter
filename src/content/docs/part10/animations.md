---
title: 애니메이션
---

애니메이션은 사용자 경험(UX)을 향상시키는 중요한 요소입니다. 적절한 애니메이션은 사용자 인터페이스에 생동감을 부여하고, 상태 변화를 자연스럽게 표현하며, 사용자의 주의를 필요한 곳으로 유도합니다. Flutter는 다양한 애니메이션 기법을 쉽게 구현할 수 있는 풍부한 API를 제공합니다.

## Flutter 애니메이션의 기본 개념

Flutter 애니메이션을 이해하기 위한 핵심 개념들을 살펴보겠습니다.


### 주요 구성 요소

1. **AnimationController**: 애니메이션의 시작, 정지, 반복 등을 제어하는 중앙 관리자
2. **Animation\<T>**: 시간에 따라 변화하는 값(double, Color, Offset 등)을 제공
3. **Tween**: 시작 값과 끝 값 사이의 보간(interpolation)을 정의
4. **Curve**: 애니메이션의 가속도와 시간 흐름을 결정하는 곡선

## 기본 애니메이션 구현하기

### 1. 암시적(Implicit) 애니메이션

Flutter는 많은 내장 암시적 애니메이션 위젯을 제공합니다. 이 위젯들은 `Animated` 접두사로 시작하며, 값이 변경될 때 자동으로 애니메이션이 적용됩니다.

```dart
class ImplicitAnimationExample extends StatefulWidget {
  @override
  _ImplicitAnimationExampleState createState() => _ImplicitAnimationExampleState();
}

class _ImplicitAnimationExampleState extends State<ImplicitAnimationExample> {
  double _width = 100.0;
  double _height = 100.0;
  Color _color = Colors.blue;
  double _borderRadius = 8.0;

  void _changeProperties() {
    setState(() {
      _width = _width == 100.0 ? 200.0 : 100.0;
      _height = _height == 100.0 ? 300.0 : 100.0;
      _color = _color == Colors.blue ? Colors.red : Colors.blue;
      _borderRadius = _borderRadius == 8.0 ? 60.0 : 8.0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _changeProperties,
      child: Center(
        child: AnimatedContainer(
          width: _width,
          height: _height,
          decoration: BoxDecoration(
            color: _color,
            borderRadius: BorderRadius.circular(_borderRadius),
          ),
          duration: Duration(milliseconds: 500),
          curve: Curves.easeInOut,
          child: Center(
            child: Text('탭하여 변경'),
          ),
        ),
      ),
    );
  }
}
```

#### 주요 암시적 애니메이션 위젯

| 위젯                       | 용도                                            |
| -------------------------- | ----------------------------------------------- |
| `AnimatedContainer`        | 컨테이너 속성 애니메이션(크기, 색상, 테두리 등) |
| `AnimatedOpacity`          | 투명도 애니메이션                               |
| `AnimatedPadding`          | 패딩 애니메이션                                 |
| `AnimatedPositioned`       | `Stack` 내에서 위치 애니메이션                  |
| `AnimatedSwitcher`         | 위젯 전환 애니메이션                            |
| `AnimatedDefaultTextStyle` | 텍스트 스타일 애니메이션                        |
| `AnimatedCrossFade`        | 두 위젯 간 교차 페이드 애니메이션               |
| `TweenAnimationBuilder`    | 사용자 정의 암시적 애니메이션                   |

### 2. 명시적(Explicit) 애니메이션

명시적 애니메이션은 더 세밀한 제어가 필요한 경우 사용합니다. `AnimationController`를 직접 조작하여 애니메이션의 시작, 중지, 역방향 재생 등을 제어할 수 있습니다.

```dart
class ExplicitAnimationExample extends StatefulWidget {
  @override
  _ExplicitAnimationExampleState createState() => _ExplicitAnimationExampleState();
}

class _ExplicitAnimationExampleState extends State<ExplicitAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _sizeAnimation;
  late Animation<Color?> _colorAnimation;
  late Animation<double> _borderRadiusAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: Duration(milliseconds: 500),
      vsync: this,
    );

    // 크기 애니메이션
    _sizeAnimation = Tween<double>(begin: 100.0, end: 200.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );

    // 색상 애니메이션
    _colorAnimation = ColorTween(begin: Colors.blue, end: Colors.red).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );

    // 테두리 반경 애니메이션
    _borderRadiusAnimation = Tween<double>(begin: 8.0, end: 60.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleAnimation() {
    if (_controller.isCompleted) {
      _controller.reverse();
    } else {
      _controller.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _toggleAnimation,
      child: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Container(
              width: _sizeAnimation.value,
              height: _sizeAnimation.value,
              decoration: BoxDecoration(
                color: _colorAnimation.value,
                borderRadius: BorderRadius.circular(_borderRadiusAnimation.value),
              ),
              child: child,
            );
          },
          child: Center(
            child: Text('탭하여 애니메이션'),
          ),
        ),
      ),
    );
  }
}
```

#### AnimationController의 주요 메서드

- `forward()`: 애니메이션을 시작하거나 계속 진행
- `reverse()`: 애니메이션을 역방향으로 재생
- `repeat()`: 애니메이션을 반복
- `reset()`: 애니메이션을 초기 상태로 재설정
- `stop()`: 애니메이션을 현재 위치에서 정지

### 3. Hero 애니메이션

Hero 애니메이션은 두 화면 간에 위젯을 자연스럽게 전환하는 데 사용됩니다. 사용자가 목록에서 세부 정보 화면으로 이동할 때 특히 유용합니다.

```dart
// 목록 화면
class HeroListScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Hero 애니메이션')),
      body: ListView.builder(
        itemCount: 10,
        itemBuilder: (context, index) {
          return ListTile(
            leading: Hero(
              tag: 'hero-$index', // 고유한 태그
              child: CircleAvatar(
                backgroundImage: NetworkImage(
                  'https://picsum.photos/id/${index + 10}/200/200',
                ),
              ),
            ),
            title: Text('아이템 $index'),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => HeroDetailScreen(
                    imageUrl: 'https://picsum.photos/id/${index + 10}/400/400',
                    heroTag: 'hero-$index',
                    title: '아이템 $index',
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}

// 상세 화면
class HeroDetailScreen extends StatelessWidget {
  final String imageUrl;
  final String heroTag;
  final String title;

  const HeroDetailScreen({
    required this.imageUrl,
    required this.heroTag,
    required this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Hero(
              tag: heroTag,
              child: Image.network(
                imageUrl,
                width: 300,
                height: 300,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(height: 20),
            Text(
              title,
              style: TextStyle(fontSize: 24),
            ),
          ],
        ),
      ),
    );
  }
}
```

### 4. 페이지 전환 애니메이션

Flutter에서는 페이지 간의 전환도 애니메이션으로 꾸밀 수 있습니다. `PageRouteBuilder`를 사용하여 사용자 정의 전환 효과를 만들 수 있습니다.

```dart
// 페이드 전환
Navigator.of(context).push(
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => DetailPage(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      const begin = 0.0;
      const end = 1.0;
      var tween = Tween(begin: begin, end: end);
      var fadeAnimation = animation.drive(tween);

      return FadeTransition(
        opacity: fadeAnimation,
        child: child,
      );
    },
    transitionDuration: Duration(milliseconds: 500),
  ),
);

// 슬라이드 전환
Navigator.of(context).push(
  PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => DetailPage(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      var begin = Offset(1.0, 0.0);
      var end = Offset.zero;
      var curve = Curves.ease;

      var tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
      var offsetAnimation = animation.drive(tween);

      return SlideTransition(
        position: offsetAnimation,
        child: child,
      );
    },
    transitionDuration: Duration(milliseconds: 500),
  ),
);
```

go_router를 사용하는 경우 다음과 같이 페이지 전환을 설정할 수 있습니다:

```dart
final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => HomeScreen(),
    ),
    GoRoute(
      path: '/detail/:id',
      pageBuilder: (context, state) {
        return CustomTransitionPage(
          key: state.pageKey,
          child: DetailScreen(id: state.params['id']!),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(
              opacity: CurveTween(curve: Curves.easeInOut).animate(animation),
              child: child,
            );
          },
        );
      },
    ),
  ],
);
```

## 고급 애니메이션 기법

### 1. Staggered Animation (단계별 애니메이션)

단계별 애니메이션은 여러 애니메이션이 서로 다른 타이밍으로 실행되도록 조정하는 기법입니다. 더 복잡하고 흥미로운 효과를 만들 수 있습니다.

```dart
class StaggeredAnimationExample extends StatefulWidget {
  @override
  _StaggeredAnimationExampleState createState() => _StaggeredAnimationExampleState();
}

class _StaggeredAnimationExampleState extends State<StaggeredAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _heightAnimation;
  late Animation<double> _widthAnimation;
  late Animation<BorderRadius?> _borderRadiusAnimation;
  late Animation<Color?> _colorAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: Duration(milliseconds: 1500),
      vsync: this,
    );

    // 단계별 애니메이션 간격 설정
    var _heightInterval = Interval(0.0, 0.3, curve: Curves.easeInOut);
    var _widthInterval = Interval(0.2, 0.5, curve: Curves.easeInOut);
    var _borderInterval = Interval(0.5, 0.8, curve: Curves.easeInOut);
    var _colorInterval = Interval(0.7, 1.0, curve: Curves.easeInOut);

    // 애니메이션 정의
    _heightAnimation = Tween<double>(begin: 100.0, end: 300.0).animate(
      CurvedAnimation(parent: _controller, curve: _heightInterval),
    );

    _widthAnimation = Tween<double>(begin: 100.0, end: 300.0).animate(
      CurvedAnimation(parent: _controller, curve: _widthInterval),
    );

    _borderRadiusAnimation = BorderRadiusTween(
      begin: BorderRadius.circular(0.0),
      end: BorderRadius.circular(150.0),
    ).animate(
      CurvedAnimation(parent: _controller, curve: _borderInterval),
    );

    _colorAnimation = ColorTween(
      begin: Colors.blue,
      end: Colors.purple,
    ).animate(
      CurvedAnimation(parent: _controller, curve: _colorInterval),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _playAnimation() {
    if (_controller.status == AnimationStatus.completed) {
      _controller.reverse();
    } else {
      _controller.forward();
    }
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _playAnimation,
      child: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Container(
              height: _heightAnimation.value,
              width: _widthAnimation.value,
              decoration: BoxDecoration(
                color: _colorAnimation.value,
                borderRadius: _borderRadiusAnimation.value,
              ),
              child: Center(
                child: Text(
                  '탭하여 애니메이션',
                  style: TextStyle(color: Colors.white),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
```

### 2. 물리 기반 애니메이션

Flutter는 실제 물리 법칙에 기반한 자연스러운 애니메이션을 위한 `SpringSimulation` 및 `GravitySimulation` 등을 제공합니다.

```dart
class PhysicsBasedAnimationExample extends StatefulWidget {
  @override
  _PhysicsBasedAnimationExampleState createState() =>
      _PhysicsBasedAnimationExampleState();
}

class _PhysicsBasedAnimationExampleState extends State<PhysicsBasedAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late SpringSimulation _simulation;
  double _position = 0.0;

  @override
  void initState() {
    super.initState();

    // 스프링 시뮬레이션 설정
    // 매개변수: 질량, 강성, 감쇠, 초기 위치
    _simulation = SpringSimulation(
      SpringDescription(
        mass: 1.0,      // 질량
        stiffness: 100.0, // 강성 (높을수록 빠른 진동)
        damping: 10.0,   // 감쇠 (높을수록 빠르게 안정화)
      ),
      0.0, // 시작 위치
      1.0, // 목표 위치
      0.0, // 초기 속도
    );

    _controller = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 1500),
    )..addListener(() {
        setState(() {
          // 현재 시뮬레이션 위치 계산
          _position = _simulation.x(_controller.value * 1.5);
        });
      });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        if (_controller.status == AnimationStatus.completed) {
          _controller.reset();
        }
        _controller.forward();
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text('스프링 애니메이션'),
          SizedBox(height: 20),
          Container(
            height: 300,
            width: double.infinity,
            child: Stack(
              alignment: Alignment.topCenter,
              children: [
                Positioned(
                  top: 200 * _position,
                  child: Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: Colors.blue,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
          ),
          Text('탭하여 공을 떨어뜨리세요'),
        ],
      ),
    );
  }
}
```

### 3. 애니메이션 시퀀스

여러 애니메이션을 순차적으로 실행해야 할 때는 다음과 같이 작성할 수 있습니다:

```dart
class SequentialAnimationExample extends StatefulWidget {
  @override
  _SequentialAnimationExampleState createState() =>
      _SequentialAnimationExampleState();
}

class _SequentialAnimationExampleState extends State<SequentialAnimationExample>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation1;
  late Animation<double> _animation2;
  late Animation<double> _animation3;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: Duration(milliseconds: 3000),
      vsync: this,
    );

    // 애니메이션 1: 0초~1초 (0.0~0.33)
    _animation1 = Tween<double>(begin: 100, end: 200).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.0, 0.33, curve: Curves.easeInOut),
      ),
    );

    // 애니메이션 2: 1초~2초 (0.33~0.66)
    _animation2 = Tween<double>(begin: 0, end: 2 * pi).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.33, 0.66, curve: Curves.easeInOut),
      ),
    );

    // 애니메이션 3: 2초~3초 (0.66~1.0)
    _animation3 = Tween<double>(begin: 1.0, end: 0.3).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Interval(0.66, 1.0, curve: Curves.easeInOut),
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _startAnimation() {
    _controller.reset();
    _controller.forward();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Transform.scale(
              scale: _animation3.value,
              child: Transform.rotate(
                angle: _animation2.value,
                child: Container(
                  width: _animation1.value,
                  height: _animation1.value,
                  decoration: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(24),
                  ),
                  child: Icon(
                    Icons.star,
                    color: Colors.yellow,
                    size: 80,
                  ),
                ),
              ),
            );
          },
        ),
        SizedBox(height: 40),
        ElevatedButton(
          onPressed: _startAnimation,
          child: Text('시퀀스 애니메이션 시작'),
        ),
      ],
    );
  }
}
```

### 4. flutter_animate 패키지 사용하기

`flutter_animate` 패키지는 복잡한 애니메이션을 간편하게 구현할 수 있도록 도와줍니다.

```dart
import 'package:flutter_animate/flutter_animate.dart';

class FlutterAnimateExample extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // 체인 애니메이션
          Text('Flutter Animate')
              .animate()
              .fadeIn(duration: 500.ms)
              .slideY(begin: -0.3, end: 0, duration: 500.ms)
              .then(delay: 200.ms) // 지연
              .shimmer(duration: 1000.ms) // 반짝임 효과
              .scale(delay: 200.ms, duration: 600.ms), // 크기 변경

          SizedBox(height: 48),

          // 병렬 애니메이션
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (int i = 0; i < 5; i++)
                Container(
                  width: 50,
                  height: 50,
                  margin: EdgeInsets.all(8),
                  color: Colors.blue,
                )
                .animate(delay: (100 * i).ms) // 각 항목마다 지연 증가
                .fade(duration: 500.ms)
                .scale(begin: 0.5, end: 1)
                .move(begin: Offset(0, 100), end: Offset.zero)
            ],
          ),
        ],
      ),
    );
  }
}
```

## 애니메이션 성능 최적화

### 1. RepaintBoundary 사용하기

복잡한 애니메이션의 경우, `RepaintBoundary`를 사용하여 다시 그려야 하는 영역을 제한합니다:

```dart
RepaintBoundary(
  child: AnimatedBuilder(
    animation: _controller,
    builder: (context, child) {
      return Transform.rotate(
        angle: _controller.value * 2 * pi,
        child: child,
      );
    },
    child: Container(
      width: 200,
      height: 200,
      color: Colors.blue,
    ),
  ),
)
```

### 2. Transform 활용하기

`setState`를 호출하는 대신 `Transform` 위젯을 사용하면 위젯 트리를 재구성하지 않고 변형만 적용할 수 있습니다:

```dart
AnimatedBuilder(
  animation: _animation,
  builder: (context, child) {
    return Transform.translate(
      offset: Offset(0, 100 * _animation.value),
      child: child, // 변경되지 않는 부분
    );
  },
  child: const MyComplexWidget(), // 재사용 가능한 위젯
)
```

### 3. ValueListenableBuilder 사용하기

단일 값 변경에 반응할 때는 `AnimatedBuilder` 대신 `ValueListenableBuilder`를 사용하는 것이 더 효율적일 수 있습니다:

```dart
ValueListenableBuilder<double>(
  valueListenable: _progressNotifier,
  builder: (context, value, child) {
    return CircularProgressIndicator(value: value);
  },
)
```

## 애니메이션 디자인 패턴 및 모범 사례

### 1. 상태별 애니메이션 모델 분리

복잡한 애니메이션은 로직을 별도의 클래스로 분리하는 것이 좋습니다:

```dart
class LoadingAnimationModel {
  final AnimationController controller;
  late final Animation<double> scaleAnimation;
  late final Animation<Color?> colorAnimation;

  LoadingAnimationModel({required this.controller}) {
    scaleAnimation = Tween<double>(begin: 1.0, end: 1.5).animate(
      CurvedAnimation(parent: controller, curve: Curves.elasticInOut),
    );

    colorAnimation = ColorTween(begin: Colors.blue, end: Colors.purple).animate(
      CurvedAnimation(parent: controller, curve: Curves.easeInOut),
    );
  }

  void startLoading() {
    controller.repeat(reverse: true);
  }

  void stopLoading() {
    controller.stop();
    controller.reset();
  }

  void dispose() {
    controller.dispose();
  }
}

// 사용 예시
class LoadingScreen extends StatefulWidget {
  @override
  _LoadingScreenState createState() => _LoadingScreenState();
}

class _LoadingScreenState extends State<LoadingScreen>
    with SingleTickerProviderStateMixin {
  late LoadingAnimationModel _animationModel;

  @override
  void initState() {
    super.initState();
    _animationModel = LoadingAnimationModel(
      controller: AnimationController(
        duration: Duration(milliseconds: 800),
        vsync: this,
      ),
    );
    _animationModel.startLoading();
  }

  @override
  void dispose() {
    _animationModel.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animationModel.controller,
      builder: (context, child) {
        return Transform.scale(
          scale: _animationModel.scaleAnimation.value,
          child: Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: _animationModel.colorAnimation.value,
              shape: BoxShape.circle,
            ),
          ),
        );
      },
    );
  }
}
```

### 2. Riverpod와 애니메이션 통합

Riverpod을 사용할 때는 애니메이션 컨트롤러를 프로바이더로 관리할 수 있습니다:

```dart
// 애니메이션 컨트롤러 프로바이더
final animationControllerProvider = Provider.autoDispose<AnimationController>((ref) {
  final controller = AnimationController(
    duration: Duration(milliseconds: 500),
    vsync: ref.watch(tickerProvider),
  );

  ref.onDispose(() {
    controller.dispose();
  });

  return controller;
});

// TickerProvider 프로바이더
final tickerProvider = Provider<TickerProvider>((ref) {
  throw UnimplementedError('TickerProvider가 설정되지 않았습니다.');
});

// 애니메이션 프로바이더
final fadeAnimationProvider = Provider.autoDispose<Animation<double>>((ref) {
  final controller = ref.watch(animationControllerProvider);
  return Tween<double>(begin: 0.0, end: 1.0).animate(controller);
});

// 사용 예시
class AnimatedPage extends ConsumerStatefulWidget {
  @override
  _AnimatedPageState createState() => _AnimatedPageState();
}

class _AnimatedPageState extends ConsumerState<AnimatedPage>
    with TickerProviderStateMixin {
  @override
  void initState() {
    super.initState();
    // TickerProvider 설정
    ref.read(tickerProvider.overrideWithValue(this));

    // 애니메이션 시작
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(animationControllerProvider).forward();
    });
  }

  @override
  Widget build(BuildContext context) {
    final fadeAnimation = ref.watch(fadeAnimationProvider);

    return FadeTransition(
      opacity: fadeAnimation,
      child: const MyPageContent(),
    );
  }
}
```

## 애니메이션 UX 지침

### 1. 애니메이션 지속 시간

애니메이션의 적절한 지속 시간은 애니메이션 유형과 목적에 따라 다릅니다:

- **기본 UI 전환**: 150ms ~ 300ms
- **엘리먼트 입장/퇴장**: 200ms ~ 500ms
- **복잡한 애니메이션**: 500ms ~ 1000ms
- **강조 애니메이션**: 800ms ~ 1500ms

### 2. 애니메이션 곡선 선택

적절한 Curve는 애니메이션의 느낌을 결정합니다:

- **Curves.easeInOut**: 자연스러운 가속 및 감속, 대부분의 UI 전환에 적합
- **Curves.easeOut**: 빠른 시작과 부드러운 종료, 요소가 화면에 등장할 때 좋음
- **Curves.easeIn**: 부드러운 시작과 빠른 종료, 요소가 화면을 떠날 때 적합
- **Curves.elasticOut**: 탄력 있는 효과, 강조하거나 놀라운 요소에 적합
- **Curves.bounceOut**: 튀는 효과, 재미있고 활기찬 느낌을 줄 때 사용

### 3. 모바일 고려사항

모바일 디바이스에서는 다음 사항을 고려하세요:

- **배터리 수명**: 과도한 애니메이션은 배터리 소모를 증가시킴
- **성능**: 저사양 기기에서도 원활하게 작동하는지 확인
- **사용자 설정**: 사용자가 애니메이션을 줄이거나 비활성화할 수 있는 옵션 제공

## 결론

Flutter의 애니메이션 시스템은 풍부하고 유연합니다. 암시적 애니메이션부터 복잡한 물리 기반 애니메이션까지, 다양한 사용자 경험을 구현할 수 있는 도구를 제공합니다.

애니메이션을 효과적으로 사용하려면 목적을 명확히 하고, 과도하게 사용하지 않으며, 성능을 고려해야 합니다. 적절한 애니메이션은 앱의 사용성과 매력을 크게 향상시키는 강력한 도구입니다.

다음 장에서는 Flutter에서 접근성을 구현하여 더 많은 사용자가 앱을 이용할 수 있도록 하는 방법에 대해 알아보겠습니다.
