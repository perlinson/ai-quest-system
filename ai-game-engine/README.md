# 🎮 AI Game Engine - Three.js AI敌人系统 + 物品系统 + 存档系统 + Debug GUI + 音效 + 粒子

可复用的 Three.js 游戏引擎，包含：
- AI敌人系统 (状态机、感知系统、攻击逻辑)
- 物品系统 (金币、药水、武器、宝藏箱)
- 存档系统 (多槽位存档、快速存档、自动存档)
- **Debug GUI** (运行时调试面板、FPS监控、参数调优)
- **音效系统** (背景音乐、3D音效、预加载、15种游戏音效)
- **粒子系统** (火焰、烟雾、爆炸、雨滴、冰霜、电击等10种特效)
- **🎆 特效系统** (爆炸、冲击波、火焰、烟雾、冰冻、魔法阵、连击系统、时间控制)

## 🎆 Effect System - 特效系统 (新增!)

完整的游戏特效解决方案，包含三大模块：

### 1. EffectSystem - 视觉特效
- 💥 爆炸、🔥 火焰、💨 烟雾、❄️ 冰冻
- 🌊 冲击波、✨ 魔法阵、⚡ 裂纹、💨 速度线

### 2. ComboSystem - 连击系统
- ⚔️ 连击计数与倍率计算
- 🎯 命中检测（球形、扇形、矩形、射线）
- 💥 命中特效管理

### 3. TimeSystem - 时间控制
- ⏱️ 慢动作、🎬 子弹时间、⚡ 时间加速
- 🔄 时间倒流、🕐 时间冻结区域

### 使用示例

```javascript
const { EffectSystem, ComboSystem, TimeSystem } = require('./src/Effect');

// 爆炸特效
effectSystem.createExplosion(position, { color: 0xff6600, particleCount: 30 });

// 连击系统
comboSystem.startCombo(player);
comboSystem.recordHit(player, 25, 'critical');

// 时间控制
timeSystem.startSlowMotion(0.2, 3000); // 3秒慢动作
```

### 演示
打开 `demos/effect-system-demo/index.html` 体验完整功能！

## 📁 项目结构

```
ai-game-engine/
├── src/
│   ├── ComponentSystem.js      # 基础组件系统
│   ├── GameEngine.js           # 游戏引擎入口
│   ├── AI/
│   │   ├── index.js           # AI模块索引
│   │   ├── Enemy.js           # 敌人类
│   │   └── EnemySystem.js      # 敌人管理系统
│   ├── Item/                   # 🎁 物品系统
│   │   ├── Item.js            # 物品基类
│   │   ├── Coin.js            # 金币
│   │   ├── Potion.js          # 药水
│   │   ├── Weapon.js          # 武器
│   │   └── ItemSystem.js       # 物品管理系统
│   ├── Save/                   # 💾 存档系统
│   │   ├── SaveManager.js      # 存档管理器
│   │   └── index.js            # 存档模块索引
│   ├── Sound/                  # 🎵 音效系统
│   │   ├── SoundManager.js     # 音效管理器
│   │   ├── SoundFactory.js     # 音效工厂
│   │   └── index.js            # 音效模块索引
│   ├── Particle/               # 🎆 粒子系统
│   │   ├── Particle.js         # 粒子类
│   │   ├── ParticleEmitter.js   # 粒子发射器
│   │   ├── ParticleSystem.js   # 粒子系统管理
│   │   └── index.js            # 粒子模块索引
│   └── Effect/                 # 🎆 特效系统 (新增! v2.1)
│       ├── EffectSystem.js     # 视觉特效系统
│       ├── ComboSystem.js      # 连击系统
│       ├── TimeSystem.js       # 时间控制系统
│       ├── index.js            # 特效模块索引
│       └── README.md           # 特效系统文档
├── systems/                    # 🔧 系统模块
│   └── debug-gui.js            # 调试GUI系统
├── demos/                      # 🎮 演示
│   ├── debug-gui.html          # Debug GUI演示
│   ├── sound-system-demo/      # 🎵 音效系统演示
│   │   └── index.html
│   ├── particle-system-demo/   # 🎆 粒子系统演示
│   │   └── index.html
│   ├── effect-system-demo/     # 🎆 特效系统演示 (新增!)
│   │   └── index.html
│   ├── ai-enemy-demo/         # AI敌人演示
│   ├── item-system-demo/       # 物品系统演示
│   └── save-system-demo/       # 存档系统演示
├── package.json
└── README.md
```

## 🚀 快速开始

### Node.js 控制台版本

```bash
cd ai-game-engine
npm start
```

### 浏览器图形版本

直接在浏览器中打开 `examples/save-system-demo/index.html`

## 🎯 功能特性

### 1. 敌人类 (Enemy)

```javascript
const Enemy = require('./src/AI/Enemy');

const enemy = new Enemy({
    name: 'Guard',
    health: 100,              // 最大生命值
    attackPower: 15,          // 攻击力
    speed: 3,                 // 移动速度
    perceptionRange: 20,       // 感知范围
    attackRange: 2,           // 攻击范围
    patrolSpeed: 1.5,        // 巡逻速度
    chaseSpeed: 4,           // 追击速度
    position: { x: 0, y: 0, z: 0 },
    patrolPoints: [
        { x: 10, y: 0, z: 10 },
        { x: 20, y: 0, z: 20 }
    ]
});
```

### 2. 敌人系统 (EnemySystem)

```javascript
const { ComponentSystem, EnemySystem } = require('./src/GameEngine');

const engine = new ComponentSystem();
const enemySystem = engine.registerSystem('enemy', EnemySystem);
enemySystem.setPlayer(player);

// 生成敌人
const enemy = enemySystem.spawnEnemy({
    name: 'Hunter',
    health: 60
});

// 设置巡逻路径
enemy.setPatrolPoints([
    { x: 0, y: 0, z: 0 },
    { x: 10, y: 0, z: 0 }
]);

// 更新系统
enemySystem.update(deltaTime);
```

## 📊 敌人状态机

| 状态 | 描述 | 行为 |
|------|------|------|
| `PATROL` | 巡逻 | 按照预设路径移动 |
| `CHASE` | 追击 | 检测到玩家后追踪 |
| `ATTACK` | 攻击 | 进入攻击范围后攻击 |
| `FLEE` | 逃跑 | 生命值低时逃离 |
| `IDLE` | 空闲 | 等待状态转换 |

## 💾 存档系统 (新增!)

### 存档管理器

```javascript
const { SaveManager } = require('./src/GameEngine');

// 创建存档管理器 (最多5个存档槽位)
const saveManager = new SaveManager({
    maxSlots: 5,           // 最大存档数
    autoSave: false,       // 是否自动存档
    autoSaveInterval: 60   // 自动存档间隔(秒)
});

// 准备游戏状态
const gameState = {
    player: {
        name: 'Hero',
        level: 5,
        health: 100,
        position: { x: 10, y: 0, z: 20 }
    },
    enemies: [],
    items: [],
    stats: {
        playTime: 3600,
        enemiesDefeated: 10
    },
    level: 3
};

// 保存到指定槽位
const saveResult = saveManager.save(0, gameState, {
    playerName: 'Hero',
    level: 5
});

// 从指定槽位读取
const loadResult = saveManager.load(0);

// 快速存档 (自动选择槽位)
const quickSaveResult = saveManager.quickSave(gameState);

// 快速读档 (读取最新存档)
const quickLoadResult = saveManager.quickLoad();

// 获取所有存档信息
const allSaves = saveManager.getAllSaves();

// 删除存档
saveManager.deleteSave(0);
```

### 存档系统 API

| 方法 | 描述 |
|------|------|
| `save(slot, gameState, metadata)` | 保存到指定槽位 |
| `load(slot)` | 从指定槽位读取 |
| `quickSave(gameState, metadata)` | 快速保存 |
| `quickLoad()` | 快速读取最新存档 |
| `deleteSave(slot)` | 删除存档 |
| `getAllSaves()` | 获取所有存档信息 |
| `getSaveInfo(slot)` | 获取指定存档信息 |
| `updateGameState(gameState)` | 更新游戏状态(用于自动存档) |
| `createSnapshot(gameState)` | 创建状态快照 |
| `validateSave(slot)` | 验证存档完整性 |
| `exportSave(slot)` | 导出存档为JSON |
| `importSave(json, slot)` | 从JSON导入存档 |

### 存档内容

存档系统会保存以下游戏数据：

| 数据类型 | 描述 |
|----------|------|
| `player` | 玩家名称、等级、生命值、位置、背包、属性 |
| `enemies` | 所有敌人状态(生命值、位置、巡逻点) |
| `items` | 物品状态(类型、位置、是否已收集) |
| `stats` | 游戏统计(时长、击败敌人数、收集物品数) |
| `level` | 当前关卡 |
| `custom` | 自定义数据 |

### 存档元数据

每个存档都会自动附加以下元数据：

| 字段 | 描述 |
|------|------|
| `timestamp` | 存档时间戳 |
| `playerName` | 玩家名称 |
| `level` | 玩家等级 |
| `playTime` | 游戏时长 |
| `saveTime` | 格式化保存时间 |

### 快捷键 (演示版)

| 按键 | 功能 |
|------|------|
| `Q` | 快速存档 |
| `E` | 快速读档 |
| `1-5` | 读取对应槽位存档 |
| `Shift+1-5` | 保存到对应槽位 |

## 🎁 物品系统

### 物品类型

| 类型 | 说明 | 示例 |
|------|------|------|
| `Coin` | 货币 | 金币、银币 |
| `Potion` | 消耗品 | 生命药水、速度药水 |
| `Weapon` | 装备 | 剑、斧、法杖 |

### 物品系统 API

```javascript
const { ItemSystem, Coin, Potion, Weapon } = require('./src/GameEngine');

const itemSystem = new ItemSystem();

// 生成金币
const coin = itemSystem.spawnCoin({
    value: 10,
    position: { x: 0, y: 0, z: 0 }
});

// 生成药水
const healthPotion = itemSystem.spawnPotion({
    potionType: 'health',  // health, mana, speed, strength
    position: { x: 5, y: 0, z: 5 }
});

// 随机生成武器
const randomWeapon = itemSystem.spawnRandomWeapon(level, position);

// 生成宝藏箱
const treasure = itemSystem.spawnTreasureChest(position, level);

// 检测收集
const collected = itemSystem.checkCollection(player, radius);

// 获取统计
const stats = itemSystem.getStats();
```

### 药水效果

| 类型 | 效果 | 持续时间 |
|------|------|---------|
| `health` | 恢复50生命值 | 立即 |
| `mana` | 恢复30魔法值 | 立即 |
| `speed` | 速度+50% | 10秒 |
| `strength` | 攻击+25% | 15秒 |

### 武器稀有度

| 稀有度 | 颜色 | 等级 |
|--------|------|------|
| 1⭐ | 灰色 | 普通 |
| 2⭐ | 绿色 | 罕见 |
| 3⭐ | 蓝色 | 稀有 |
| 4⭐ | 紫色 | 史诗 |
| 5⭐ | 橙色 | 传说 |

## 📦 模块导出

```javascript
// 方式1: 单独导入
const Enemy = require('./src/AI/Enemy');
const EnemySystem = require('./src/AI/EnemySystem');
const SaveManager = require('./src/Save/SaveManager');

// 方式2: 统一导入
const { ComponentSystem, Enemy, EnemySystem, SaveManager } = require('./src/GameEngine');
```

## 🎮 控制说明 (浏览器版)

### AI敌人演示
- **W/A/S/D**: 移动
- **空格键**: 攻击
- **Shift**: 加速移动

### 存档系统演示
- **W/A/S/D**: 移动
- **空格键**: 攻击敌人
- **Q**: 快速存档
- **E**: 快速读档
- **1-5**: 读取存档
- **Shift+1-5**: 保存到存档

## 🔧 扩展性

- **自定义状态**: 扩展 Enemy 类添加新状态
- **自定义感知**: 实现复杂的遮挡检测
- **路径查找**: 集成 A* 或其他路径算法
- **动画系统**: 集成 Three.js 动画混合器
- **存档加密**: 为存档添加加密功能
- **云存档**: 集成云存储服务

## 📄 许可证

MIT License

## 👨‍💻 作者

AI Game Engine

---

# 🔧 Debug GUI 系统 (新增!)

## 概述

运行时调试面板，让AI Agent能实时调优游戏参数、监控性能、调试实体。

## 快速开始

```javascript
import { DebugGUI } from './systems/debug-gui.js';

const debugGUI = new DebugGUI(engine);
debugGUI.init();
engine.addSystem('debug', debugGUI);
```

然后按 **` ` `** 键打开/关闭调试面板。

## 功能特性

### 1. 实时监控
- **FPS**: 帧率显示 + 历史图
- **帧时间**: 每帧耗时
- **实体数量**: 当前场景实体数
- **Draw Calls**: 渲染调用次数
- **活跃系统**: 正在运行的游戏系统数

### 2. 参数控制面板
添加自定义滑块控制：

```javascript
debugGUI.addControl('玩家速度', 
    () => player.speed,
    (v) => { player.speed = v; },
    0.01, 0.5
);
```

### 3. 实体浏览器
- 实时显示所有实体列表
- 点击选中查看属性
- 键盘导航 (↑↓ 选择, Enter 查看)
- 显示实体位置、旋转、缩放

### 4. 快捷操作
- **暂停**: 暂停/恢复游戏
- **慢动作**: 0.1x 慢动作模式
- **幽灵模式**: 穿墙/无碰撞
- **重置**: 重置游戏状态

### 5. 性能图表
实时FPS柱状图：
- 🟢 绿色: 正常 (>50 FPS)
- 🟡 黄色: 警告 (30-50 FPS)
- 🔴 红色: 卡顿 (<30 FPS)

## 快捷键

| 按键 | 功能 |
|------|------|
| `` ` `` | 打开/关闭调试面板 |
| ↑/↓ | 在实体列表中导航 |
| Enter | 查看选中实体属性 |
| Escape | 取消选择 |

## 演示

打开 `demos/debug-gui.html` 查看完整演示：

```bash
# 或直接在浏览器打开
ai-game-engine/demos/debug-gui.html
```

演示包含：
- FPS实时监控
- 粒子速度滑块控制
- 玩家速度调节
- 5个AI敌人实体
- WASD移动控制

---

# 🎵 音效系统 (Sound System) - 新增!

## 概述

Three.js音频封装，让AI Agent轻松添加游戏音效。支持背景音乐、3D空间音效、预加载音效等功能。

## 快速开始

```javascript
const { SoundManager, SoundFactory } = require('./src/GameEngine');

// 创建音效管理器
const soundManager = new SoundManager({
    musicVolume: 0.5,  // 背景音乐音量
    sfxVolume: 0.7      // 音效音量
});

// 添加到相机（重要！）
soundManager.addListenerToCamera(camera);

// 设置背景音乐
await soundManager.setBackgroundMusic('/music/adventure.mp3', {
    loop: true,
    volume: 0.8
});

// 播放音效
await soundManager.playSFX('/sounds/jump.mp3', 0.5);
```

## 🎵 SoundManager API

### 基础方法

| 方法 | 描述 |
|------|------|
| `addListenerToCamera(camera)` | 添加音频监听器到相机 |
| `setBackgroundMusic(url, options)` | 设置背景音乐 |
| `playSFX(url, volume)` | 播放普通音效 |
| `play3DSound(params)` | 播放3D空间音效 |
| `preloadSound(name, url)` | 预加载音效 |
| `playPreloadedSound(name, options)` | 播放预加载音效 |
| `pauseMusic()` | 暂停背景音乐 |
| `resumeMusic()` | 恢复背景音乐 |
| `stopMusic()` | 停止背景音乐 |
| `setMusicVolume(volume)` | 设置音乐音量 |
| `setSFXVolume(volume)` | 设置音效音量 |
| `toggleMute()` | 静音切换 |
| `getLoadedSounds()` | 获取已加载音效列表 |
| `dispose()` | 清理所有音效 |

### 3D音效参数

```javascript
await soundManager.play3DSound({
    url: '/sounds/enemy_alert.mp3',
    position: { x: 10, y: 0, z: 5 },  // 音源位置
    loop: false,
    refDistance: 10,    // 参考距离（音量开始衰减的距离）
    volume: 1,
    name: 'enemyAlert'
});
```

## 🎶 SoundFactory 音效工厂

预定义15种常用游戏音效，快速集成：

```javascript
const { SoundManager } = require('./src/GameEngine');

const soundManager = new SoundManager();
const factory = new SoundFactory(soundManager);

// 初始化音效工厂
await factory.initialize({
    basePath: '/sounds/'
});

// 播放各种音效
factory.playJump();        // 跳跃
factory.playAttack();      // 攻击
factory.playCollectCoin(); // 收集金币
factory.playEnemyHit();    // 敌人受伤
factory.playPlayerHit();  // 玩家受伤
factory.playLevelUp();    // 升级
factory.playVictory();    // 胜利
factory.playGameOver();   // 游戏结束
factory.playPotionDrink(); // 喝药水
factory.playChestOpen();  // 宝箱开启

// 事件驱动播放
factory.playEvent('attack');
factory.playEvent('level_up');
```

### 可用音效

| 方法 | 描述 | 默认快捷键 |
|------|------|-----------|
| `playJump()` | 跳跃音效 | J |
| `playLand()` | 落地音效 | - |
| `playAttack()` | 攻击音效 | A |
| `playEnemyHit()` | 敌人受伤 | - |
| `playPlayerHit()` | 玩家受伤 | - |
| `playCollectCoin()` | 收集金币 | C |
| `playCollectItem()` | 收集物品 | - |
| `playLevelUp()` | 升级 | L |
| `playGameOver()` | 游戏结束 | - |
| `playVictory()` | 胜利 | V |
| `playDoorOpen()` | 开门 | - |
| `playChestOpen()` | 宝箱开启 | - |
| `playPotionDrink()` | 喝药水 | - |
| `playWeaponSwing()` | 武器挥动 | - |
| `playMagicCast()` | 魔法施放 | - |

## 📁 音效文件结构

建议组织方式：

```
assets/
└── sounds/
    ├── music/
    │   ├── adventure.mp3
    │   ├── battle.mp3
    │   └── victory.mp3
    │
    ├── sfx/
    │   ├── jump.mp3
    │   ├── attack.mp3
    │   ├── collect_coin.mp3
    │   ├── enemy_hit.mp3
    │   ├── player_hit.mp3
    │   ├── level_up.mp3
    │   ├── game_over.mp3
    │   ├── potion_drink.mp3
    │   └── chest_open.mp3
    │
    └── 3d/
        ├── enemy_alert.mp3
        ├── waterfall.mp3
        └── wind.mp3
```

## 🎮 演示

打开 `demos/sound-system-demo/index.html` 查看完整演示：

```bash
# 或直接在浏览器打开
ai-game-engine/demos/sound-system-demo/index.html
```

演示包含：
- 🎵 背景音乐播放/暂停/停止
- 🔊 10种游戏音效
- 📊 实时频谱可视化
- ⚙️ 音量控制
- ⌨️ 快捷键支持
- 3D场景渲染

### 演示快捷键

| 按键 | 功能 |
|------|------|
| `空格` | 播放/暂停音乐 |
| `J` | 跳跃音效 |
| `A` | 攻击音效 |
| `C` | 收集金币 |
| `L` | 升级音效 |
| `V` | 胜利音效 |
| `M` | 静音切换 |

## 💡 使用技巧

### 1. 用户交互前不播放
由于浏览器自动播放策略，首次播放需要用户交互：

```javascript
// 用户点击后初始化音频
document.addEventListener('click', async () => {
    if (soundManager.context.state === 'suspended') {
        await soundManager.context.resume();
    }
    // 播放音效
    factory.playJump();
}, { once: true });
```

### 2. 3D音效添加空间感
```javascript
// 更新移动音源的位置
soundManager.update3DPosition('enemyAlert', 
    enemy.position, 
    enemy.mesh
);
```

### 3. 批量预加载
```javascript
// 游戏开始时预加载所有音效
async function loadAllSounds() {
    await Promise.all([
        factory.initialize({ basePath: '/sounds/' }),
        soundManager.setBackgroundMusic('/music/bgm.mp3', { loop: true })
    ]);
    console.log('所有音效加载完成！');
}
```

## 🔧 与其他系统集成

### 与敌人系统集成
```javascript
const { EnemySystem, SoundFactory } = require('./src/GameEngine');

const enemySystem = engine.registerSystem('enemy', EnemySystem);
enemySystem.setSoundFactory(factory);

// 敌人受伤时自动播放音效
enemySystem.on('enemyHit', (enemy) => {
    factory.playEnemyHit();
});
```

### 与物品系统集成
```javascript
const { ItemSystem, SoundFactory } = require('./src/GameEngine');

const itemSystem = new ItemSystem();
itemSystem.setSoundFactory(factory);

// 收集物品时播放音效
itemSystem.on('collect', (item) => {
    if (item.type === 'coin') {
        factory.playCollectCoin();
    } else {
        factory.playCollectItem();
    }
});
```

---

# 🎆 粒子系统 (Particle System) - 新增!

## 概述

完整的粒子系统，让游戏更加生动有趣！支持火焰、烟雾、爆炸、雨滴、冰霜、电击、金币闪光等10种预设特效。

## 快速开始

```javascript
const { ParticleSystem } = require('./src/GameEngine');

// 创建粒子系统
const particleSystem = new ParticleSystem();

// 从模板创建特效
const emitter = particleSystem.createFromTemplate('fire', {
    position: { x: 0, y: 0, z: 0 },
    loop: true
});

// 启动特效
emitter.play();

// 在游戏循环中更新
particleSystem.update(deltaTime);
```

## 🎨 ParticleSystem API

### 基础方法

| 方法 | 描述 |
|------|------|
| `createEmitter(name, options)` | 创建自定义发射器 |
| `createFromTemplate(name, overrides)` | 从模板创建发射器 |
| `playEffect(templateName, position)` | 播放一次性特效 |
| `startLoopingEffect(templateName, position)` | 启动循环特效 |
| `update(deltaTime)` | 更新所有粒子 |
| `getAllParticles()` | 获取所有粒子（用于渲染） |
| `clear()` | 清除所有粒子 |
| `setGlobalSpeed(speed)` | 设置全局速度 |
| `addTemplate(name, options)` | 添加自定义模板 |

### 获取统计信息

```javascript
const stats = particleSystem.getStats();
console.log(`粒子总数: ${stats.totalParticles}`);
console.log(`发射器数量: ${stats.emitterCount}`);
```

## 📦 预定义特效模板

### 🔥 环境特效（循环）

| 模板名 | 描述 | 使用场景 |
|--------|------|---------|
| `fire` | 火焰效果 | 火堆、燃烧、熔岩 |
| `smoke` | 烟雾效果 | 篝火、爆炸余烟 |
| `rain` | 雨滴效果 | 雨天场景 |
| `magicAura` | 魔法光环 | 魔法生物、法杖 |
| `frost` | 冰霜效果 | 冰系魔法、寒冷环境 |

### 💥 一次性特效

| 模板名 | 描述 | 使用场景 |
|--------|------|---------|
| `explosion` | 爆炸效果 | 炸弹、魔法爆裂 |
| `lightning` | 电击效果 | 雷击、电系攻击 |
| `coinSparkle` | 金币闪光 | 收集金币 |
| `bloodSplatter` | 飘血效果 | 受伤、攻击 |
| `levelUp` | 升级光环 | 升级、获得经验 |

## 🎯 使用示例

### 1. 创建火焰特效
```javascript
const fire = particleSystem.createFromTemplate('fire', {
    position: { x: 0, y: 0.5, z: 0 },
    loop: true
});
fire.play();
```

### 2. 触发爆炸特效
```javascript
// 在指定位置触发爆炸
particleSystem.playEffect('explosion', {
    x: enemy.position.x,
    y: enemy.position.y,
    z: enemy.position.z
});
```

### 3. 自定义发射器
```javascript
const customEmitter = particleSystem.createEmitter('myEffect', {
    position: { x: 0, y: 1, z: 0 },
    emissionRate: 30,
    life: 1.5,
    color: { r: 0.2, g: 0.8, b: 1, a: 1 },
    size: 0.5,
    loop: true
});
customEmitter.play();
```

### 4. 集成到游戏循环
```javascript
function gameLoop(deltaTime) {
    // 更新所有游戏系统
    enemySystem.update(deltaTime);
    itemSystem.update(deltaTime);
    
    // 🎆 更新粒子系统
    particleSystem.update(deltaTime);
    
    // 渲染粒子
    renderParticles(particleSystem.getAllParticles());
}
```

## 🎮 粒子系统演示

打开 `demos/particle-system-demo/index.html` 查看完整演示：

```bash
# 或直接在浏览器打开
ai-game-engine/demos/particle-system-demo/index.html
```

演示包含：
- 🔥 5种环境循环特效（火焰、烟雾、雨、魔法光环、冰霜）
- 💥 5种一次性特效（爆炸、电击、金币闪光、飘血、升级）
- 🔧 全局速度/数量控制
- 🖱️ 鼠标点击触发特效
- ⌨️ 键盘快捷键支持
- 📊 实时粒子统计

### 演示快捷键

| 按键 | 功能 |
|------|------|
| `1` | 切换火焰特效 |
| `2` | 切换烟雾特效 |
| `3` | 切换雨效 |
| `4` | 切换魔法光环 |
| `5` | 切换冰霜特效 |
| `6` | 触发爆炸 |
| `7` | 触发电击 |
| `8` | 触发金币闪光 |
| `点击` | 随机触发一次性特效 |

## 🔧 高级配置

### 粒子属性选项

```javascript
const emitter = particleSystem.createEmitter('custom', {
    // 发射位置
    position: { x: 0, y: 0, z: 0 },
    positionSpread: { x: 1, y: 0.5, z: 1 },
    
    // 发射方向
    direction: { x: 0, y: 1, z: 0 },
    directionSpread: { x: 30, y: 30, z: 30 },
    
    // 发射速度
    speed: 5,
    speedSpread: 2,
    
    // 发射速率
    emissionRate: 30,
    maxParticles: 200,
    
    // 粒子寿命
    life: 1.0,
    lifeSpread: 0.5,
    
    // 粒子大小
    size: 0.5,
    sizeSpread: 0.2,
    endSize: 0,
    
    // 颜色
    color: { r: 1, g: 0.5, b: 0.2, a: 1 },
    endColor: { r: 0.5, g: 0.1, b: 0, a: 0 },
    
    // 物理效果
    gravity: { x: 0, y: -9.8, z: 0 },
    damping: 0.98,
    
    // 特殊效果
    glow: true,
    trail: false,
    
    // 发射模式
    loop: true,
    duration: 1.0,
    delay: 0
});
```

### 与其他系统集成

#### 与敌人系统集成
```javascript
const { EnemySystem, ParticleSystem } = require('./src/GameEngine');

const enemySystem = engine.registerSystem('enemy', EnemySystem);
const particleSystem = new ParticleSystem();

// 敌人死亡时触发爆炸
enemySystem.on('death', (enemy) => {
    particleSystem.playEffect('explosion', enemy.position);
});

// 敌人攻击时触发火花
enemySystem.on('attack', (enemy) => {
    particleSystem.playEffect('sparks', {
        x: enemy.position.x,
        y: enemy.position.y + 1,
        z: enemy.position.z
    });
});
```

#### 与物品系统集成
```javascript
const { ItemSystem, ParticleSystem } = require('./src/GameEngine');

const itemSystem = new ItemSystem();
const particleSystem = new ParticleSystem();

// 收集金币时触发闪光
itemSystem.on('collect', (item) => {
    if (item.type === 'coin') {
        particleSystem.playEffect('coinSparkle', item.position);
    }
});

// 喝药水时触发特效
itemSystem.on('use', (item) => {
    if (item.type === 'potion') {
        particleSystem.playEffect('magicAura', item.user.position);
    }
});
```

## 💡 性能优化建议

1. **限制粒子数量**：设置合理的 `maxParticles` 和 `maxTotalParticles`
2. **使用对象池**：复用粒子对象减少GC压力
3. **简化渲染**：使用粒子贴图代替复杂几何体
4. **分层渲染**：将静态粒子和动态粒子分开处理
5. **LOD**：根据距离动态调整粒子数量

---

## 📦 版本历史

### v1.2.0 - 粒子系统 (2026-02-11)
**🎆 新增完整粒子系统模块**

- **ParticleEmitter** - 粒子发射器核心
  - 支持多种发射形状（点、方、球、锥）
  - 自定义颜色渐变和大小变化
  - 重力和阻尼物理模拟
  - Shader材质实现高性能渲染
  - 支持一次性爆发和持续发射模式

- **ParticleSystem** - 粒子系统管理器
  - 多个发射器统一管理
  - 自动场景集成
  - 批量更新和渲染

- **ParticleFactory** - 粒子工厂（16种预设特效）
  - 🔥 火焰 (Fire)
  - 💨 烟雾 (Smoke)
  - 💥 爆炸 (Explosion)
  - ⚡ 火花 (Sparks)
  - ✨ 魔法光环 (Magic Aura)
  - 🔮 魔法球 (Magic Orb)
  - 🌧️ 雨 (Rain)
  - ❄️ 雪 (Snow)
  - 🛡️ 能量护盾 (Energy Shield)
  - ⚔️ 武器火花 (Weapon Sparks)
  - ⭐ 经验球 (Exp Orb)
  - ☠️ 毒雾 (Poison Cloud)
  - ❅ 冰霜 (Frost)
  - 💰 金币收集 (Coin Collect)
  - 🕳️ 虚空 (Void)

- **demos/particle-system-demo/** - 交互式演示页面

**代码统计**:
- 核心模块: 14,259 行 (ParticleEmitter.js)
- 预设工厂: 13,168 行 (ParticleFactory.js)
- 演示页面: 19,222 行
- 总新增: 46,649 行
