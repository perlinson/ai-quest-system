/**
 * Environment Module - 环境系统模块
 * 包含日夜循环、天气系统等环境效果
 */

const { DayNightCycle } = require('./DayNightCycle.js');
const { WeatherSystem } = require('./WeatherSystem.js');
const { EnvironmentManager } = require('./EnvironmentManager.js');

module.exports = {
    DayNightCycle,
    WeatherSystem,
    EnvironmentManager
};

// 演示
if (require.main === module) {
    console.log('🎮 AI Game Engine - Environment Module');
    console.log('=====================================\n');
    
    EnvironmentManager.demo();
    
    console.log('\n📝 使用示例:');
    console.log(`
const { EnvironmentManager } = require('./Environment');

// 创建环境管理器
const env = new EnvironmentManager({ scene: yourThreeJSScene });

// 应用预设
env.applyPreset('sunset');
env.applyPreset('thunderStorm');

// 手动控制
env.setTime(18);           // 设置时间 (0-24)
env.setWeather('rain', 0.8); // 设置天气和强度

// 在游戏循环中更新
function gameLoop(deltaTime) {
    env.update(deltaTime);
}
`);
}
