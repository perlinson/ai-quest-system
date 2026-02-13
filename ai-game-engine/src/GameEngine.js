/**
 * AI Game Engine - Three.js AI敌人系统 + 任务系统
 * 
 * 可复用的AI敌人系统，包含：
 * - 敌人类 (Enemy)
 * - 敌人系统 (EnemySystem)
 * - 物品系统 (ItemSystem)
 * - 存档系统 (SaveSystem)
 * - 任务系统 (QuestSystem)
 * - 状态机 (巡逻、追击、攻击、逃跑)
 * - 视觉感知系统
 * - 路径查找
 * - 攻击逻辑
 * - 物品收集与使用
 * - 游戏存档与读档
 * - 任务管理
 */

// 导出主要类
const ComponentSystem = require('./ComponentSystem');
const Enemy = require('./AI/Enemy');
const EnemySystem = require('./AI/EnemySystem');
const ItemSystem = require('./Item/ItemSystem');
const Item = require('./Item/Item');
const Coin = require('./Item/Coin');
const Potion = require('./Item/Potion');
const Weapon = require('./Item/Weapon');
const SaveManager = require('./Save/SaveManager');
const SoundManager = require('./Sound/SoundManager');
const SoundFactory = require('./Sound/SoundFactory');
const Particle = require('./Particle/Particle');
const ParticleEmitter = require('./Particle/ParticleEmitter');
const ParticleSystem = require('./Particle/ParticleSystem');
const ParticleFactory = require('./Particle/ParticleFactory');
const Quest = require('./Quest/Quest');
const QuestManager = require('./Quest/QuestManager');
const QuestTemplates = require('./Quest/QuestTemplates');

// AI任务系统
const AIQuestManager = require('./AIQuest/QuestManager');
const AIQuestTypes = require('./AIQuest/QuestTypes');
const AIQuestRewards = require('./AIQuest/QuestRewards');

// 关卡模板
const LevelTemplates = require('./LevelTemplates');
const PlatformerLevel = require('./LevelTemplates/PlatformerLevel');
const CombatLevel = require('./LevelTemplates/CombatLevel');
const PuzzleLevel = require('./LevelTemplates/PuzzleLevel');

// 🌍 环境系统
const EnvironmentManager = require('./Environment/EnvironmentManager');
const DayNightCycle = require('./Environment/DayNightCycle');
const WeatherSystem = require('./Environment/WeatherSystem');

module.exports = {
    // 核心系统
    ComponentSystem,
    
    // AI敌人系统
    Enemy,
    EnemySystem,
    
    // 物品系统
    ItemSystem,
    Item,
    Coin,
    Potion,
    Weapon,
    
    // 存档系统
    SaveManager,
    
    // 🎵 音效系统
    SoundManager,
    SoundFactory,
    
    // 🎆 粒子系统
    Particle,
    ParticleEmitter,
    ParticleSystem,
    ParticleFactory,
    
    // 🎯 任务系统
    Quest,
    QuestManager,
    
    // 任务模板
    ...QuestTemplates,

    // 🤖 AI任务系统
    AIQuestManager,
    AIQuestTypes,
    AIQuestRewards,

    // 🏗️ 关卡模板
    LevelTemplates,
    PlatformerLevel,
    CombatLevel,
    PuzzleLevel,

    // 🌍 环境系统
    EnvironmentManager,
    DayNightCycle,
    WeatherSystem
};

// 使用示例
if (require.main === module) {
    const { ComponentSystem, EnemySystem, ItemSystem, Coin, Potion, Weapon, SaveManager, Quest, QuestManager, AIQuestManager, AIQuestTypes, AIQuestRewards, PlatformerLevel, CombatLevel, PuzzleLevel } = require('./src/GameEngine');
    console.log('AI Game Engine loaded successfully!');
    console.log('Available modules:');
    console.log('- ComponentSystem: Base component system');
    console.log('- EnemySystem: AI enemy management');
    console.log('- Enemy: AI enemy entity');
    console.log('- ItemSystem: Item management');
    console.log('- Coin: Currency items');
    console.log('- Potion: Consumable potions');
    console.log('- Weapon: Equipable weapons');
    console.log('- SaveManager: Save/Load game progress');
    console.log('- Quest: Quest entity');
    console.log('- QuestManager: Quest management system');
    
    // AI任务系统示例
    console.log('\n🤖 AI Quest System:');
    console.log('- AIQuestManager: Advanced quest management');
    console.log('- AIQuestTypes: Quest type definitions');
    console.log('- AIQuestRewards: Quest reward system');
    
    // 关卡模板示例
    console.log('\n🏗️ Level Templates:');
    console.log('- PlatformerLevel: Platformer level template');
    console.log('- CombatLevel: Combat arena level template');
    console.log('- PuzzleLevel: Puzzle game template');
}
