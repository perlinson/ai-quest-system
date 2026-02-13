/**
 * EnvironmentManager - 环境管理器
 * 整合日夜循环和天气系统，提供统一的环境控制接口
 */

class EnvironmentManager {
    constructor(options = {}) {
        this.scene = options.scene || null;
        this.game = options.game || null;
        
        // 子系统
        this.dayNightCycle = null;
        this.weatherSystem = null;
        
        // 预设
        this.presets = {
            sunrise: { time: 6, weather: 'clear' },
            noon: { time: 12, weather: 'clear' },
            sunset: { time: 18, weather: 'clear' },
            midnight: { time: 0, weather: 'clear' },
            rainyDay: { time: 10, weather: 'rain', intensity: 0.8 },
            snowyNight: { time: 22, weather: 'snow', intensity: 0.7 },
            foggyMorning: { time: 7, weather: 'fog', intensity: 0.6 },
            thunderStorm: { time: 14, weather: 'storm', intensity: 1 }
        };
        
        this.init();
    }
    
    init() {
        if (!this.scene) {
            console.warn('EnvironmentManager: scene is required');
            return;
        }
        
        // 初始化日夜循环
        this.dayNightCycle = new DayNightCycle({
            scene: this.scene,
            startTime: 12,
            timeScale: 1
        });
        
        // 初始化天气系统
        this.weatherSystem = new WeatherSystem({
            scene: this.scene
        });
        
        // 设置默认天气
        this.weatherSystem.setWeather('clear');
    }
    
    update(deltaTime) {
        if (this.dayNightCycle) {
            this.dayNightCycle.update(deltaTime);
        }
        
        if (this.weatherSystem) {
            this.weatherSystem.update(deltaTime);
        }
    }
    
    // === 时间控制 ===
    
    setTime(hour) {
        if (this.dayNightCycle) {
            this.dayNightCycle.setTime(hour);
        }
        return this;
    }
    
    setTimeScale(scale) {
        if (this.dayNightCycle) {
            this.dayNightCycle.setTimeScale(scale);
        }
        return this;
    }
    
    getTime() {
        return this.dayNightCycle ? this.dayNightCycle.getFormattedTime() : '00:00';
    }
    
    getPhase() {
        return this.dayNightCycle ? this.dayNightCycle.getPhase() : 'day';
    }
    
    // === 天气控制 ===
    
    setWeather(weather, intensity = 1) {
        if (this.weatherSystem) {
            this.weatherSystem.setWeather(weather, intensity);
        }
        return this;
    }
    
    getWeather() {
        return this.weatherSystem ? this.weatherSystem.getWeather() : 'clear';
    }
    
    // === 预设控制 ===
    
    applyPreset(presetName) {
        const preset = this.presets[presetName];
        if (!preset) {
            console.warn(`EnvironmentManager: unknown preset "${presetName}"`);
            return this;
        }
        
        if (preset.time !== undefined) {
            this.setTime(preset.time);
        }
        
        if (preset.weather) {
            this.setWeather(preset.weather, preset.intensity || 1);
        }
        
        return this;
    }
    
    addPreset(name, config) {
        this.presets[name] = config;
        return this;
    }
    
    // === 便捷方法 ===
    
    pause() {
        if (this.dayNightCycle) this.dayNightCycle.pause();
    }
    
    resume() {
        if (this.dayNightCycle) this.dayNightCycle.resume();
    }
    
    // 创建预设的演示
    static demo() {
        console.log('🎮 环境系统预设:');
        console.log('  sunrise    - 日出 (6:00)');
        console.log('  noon       - 正午 (12:00)');
        console.log('  sunset     - 日落 (18:00)');
        console.log('  midnight   - 午夜 (0:00)');
        console.log('  rainyDay   - 雨天');
        console.log('  snowyNight - 雪夜');
        console.log('  foggyMorning - 雾晨');
        console.log('  thunderStorm - 雷暴');
    }
    
    destroy() {
        if (this.dayNightCycle) this.dayNightCycle.destroy();
        if (this.weatherSystem) this.weatherSystem.destroy();
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EnvironmentManager };
}
