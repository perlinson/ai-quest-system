/**
 * 🎆 粒子系统管理器 - AI Game Engine
 * 
 * 管理所有粒子发射器，提供统一的更新和渲染接口
 */

const ParticleEmitter = require('./ParticleEmitter');

class ParticleSystem {
    constructor() {
        this.emitters = new Map();
        this.isEnabled = true;
        this.globalScale = 1.0;
        this.globalSpeed = 1.0;
        this.maxTotalParticles = 10000;
        
        // 预定义的特效模板
        this.templates = {
            /**
             * 火焰效果
             */
            fire: {
                name: 'fire',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.5, y: 0.1, z: 0.5 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 20, y: 10, z: 20 },
                speed: 3,
                speedSpread: 1,
                emissionRate: 30,
                maxParticles: 200,
                life: 0.8,
                lifeSpread: 0.3,
                size: 0.8,
                sizeSpread: 0.3,
                endSize: 0.1,
                color: { r: 1, g: 0.5, b: 0.1, a: 1 },
                colorSpread: { r: 0.2, g: 0.1, b: 0 },
                endColor: { r: 0.5, g: 0.1, b: 0, a: 0 },
                glow: true,
                gravity: { x: 0, y: 0.5, z: 0 },
                loop: true
            },
            
            /**
             * 烟雾效果
             */
            smoke: {
                name: 'smoke',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 1, y: 0.5, z: 1 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 30, y: 15, z: 30 },
                speed: 2,
                speedSpread: 0.5,
                emissionRate: 15,
                maxParticles: 150,
                life: 2,
                lifeSpread: 0.5,
                size: 1.5,
                sizeSpread: 0.5,
                endSize: 3,
                color: { r: 0.3, g: 0.3, b: 0.3, a: 0.6 },
                colorSpread: { r: 0.1, g: 0.1, b: 0.1 },
                endColor: { r: 0.1, g: 0.1, b: 0.1, a: 0 },
                gravity: { x: 0, y: 0.2, z: 0 },
                loop: true
            },
            
            /**
             * 爆炸效果
             */
            explosion: {
                name: 'explosion',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.5, y: 0.5, z: 0.5 },
                direction: { x: 0, y: 0, z: 1 },
                directionSpread: { x: 180, y: 180, z: 180 },
                speed: 10,
                speedSpread: 5,
                emissionRate: 100,
                maxParticles: 300,
                life: 0.5,
                lifeSpread: 0.3,
                size: 0.6,
                sizeSpread: 0.3,
                endSize: 0,
                color: { r: 1, g: 0.6, b: 0.2, a: 1 },
                colorSpread: { r: 0.3, g: 0.2, b: 0.1 },
                endColor: { r: 0.5, g: 0.1, b: 0, a: 0 },
                glow: true,
                gravity: { x: 0, y: -5, z: 0 },
                loop: false,
                duration: 0.3
            },
            
            /**
             * 魔法光环效果
             */
            magicAura: {
                name: 'magicAura',
                position: { x: 0, y: 1, z: 0 },
                positionSpread: { x: 0.1, y: 0.1, z: 0.1 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 360, y: 180, z: 360 },
                speed: 0.5,
                speedSpread: 0.2,
                emissionRate: 40,
                maxParticles: 100,
                life: 1.5,
                lifeSpread: 0.5,
                size: 0.3,
                sizeSpread: 0.1,
                endSize: 0,
                color: { r: 0.4, g: 0.6, b: 1, a: 0.8 },
                colorSpread: { r: 0.1, g: 0.1, b: 0.2 },
                endColor: { r: 0.2, g: 0.4, b: 1, a: 0 },
                glow: true,
                trail: true,
                gravity: { x: 0, y: 0.1, z: 0 },
                loop: true
            },
            
            /**
             * 冰霜效果
             */
            frost: {
                name: 'frost',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.5, y: 0.5, z: 0.5 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 30, y: 30, z: 30 },
                speed: 4,
                speedSpread: 1,
                emissionRate: 25,
                maxParticles: 120,
                life: 1,
                lifeSpread: 0.3,
                size: 0.4,
                sizeSpread: 0.2,
                endSize: 0.2,
                color: { r: 0.6, g: 0.8, b: 1, a: 0.9 },
                colorSpread: { r: 0.1, g: 0.1, b: 0.1 },
                endColor: { r: 0.8, g: 0.9, b: 1, a: 0 },
                glow: true,
                gravity: { x: 0, y: -1, z: 0 },
                loop: true
            },
            
            /**
             * 电击效果
             */
            lightning: {
                name: 'lightning',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.2, y: 0.2, z: 0.2 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 45, y: 45, z: 45 },
                speed: 8,
                speedSpread: 3,
                emissionRate: 50,
                maxParticles: 80,
                life: 0.3,
                lifeSpread: 0.1,
                size: 0.2,
                sizeSpread: 0.1,
                endSize: 0,
                color: { r: 0.9, g: 0.9, b: 1, a: 1 },
                colorSpread: { r: 0.1, g: 0.1, b: 0.2 },
                endColor: { r: 0.5, g: 0.5, b: 1, a: 0 },
                glow: true,
                gravity: { x: 0, y: -2, z: 0 },
                loop: false,
                duration: 0.2,
                repeatDelay: 0.3
            },
            
            /**
             * 雨滴效果
             */
            rain: {
                name: 'rain',
                position: { x: 0, y: 10, z: 0 },
                positionSpread: { x: 20, y: 0, z: 20 },
                direction: { x: 0, y: -1, z: 0 },
                directionSpread: { x: 5, y: 0, z: 5 },
                speed: 15,
                speedSpread: 2,
                emissionRate: 200,
                maxParticles: 500,
                life: 1.5,
                lifeSpread: 0.2,
                size: 0.1,
                sizeSpread: 0.05,
                endSize: 0.05,
                color: { r: 0.6, g: 0.7, b: 0.9, a: 0.5 },
                endColor: { r: 0.4, g: 0.5, b: 0.7, a: 0 },
                gravity: { x: 0, y: -20, z: 0 },
                damping: 1,
                loop: true
            },
            
            /**
             * 金币闪光效果
             */
            coinSparkle: {
                name: 'coinSparkle',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.3, y: 0.3, z: 0.3 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 60, y: 60, z: 60 },
                speed: 3,
                speedSpread: 1,
                emissionRate: 20,
                maxParticles: 50,
                life: 0.5,
                lifeSpread: 0.2,
                size: 0.15,
                sizeSpread: 0.05,
                endSize: 0,
                color: { r: 1, g: 0.8, b: 0.2, a: 1 },
                colorSpread: { r: 0.2, g: 0.1, b: 0 },
                endColor: { r: 1, g: 0.9, b: 0.4, a: 0 },
                glow: true,
                gravity: { x: 0, y: -2, z: 0 },
                loop: false,
                duration: 0.3
            },
            
            /**
             * 受伤飘血效果
             */
            bloodSplatter: {
                name: 'bloodSplatter',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0.3, y: 0.3, z: 0.3 },
                direction: { x: 0, y: 0.5, z: 1 },
                directionSpread: { x: 60, y: 30, z: 60 },
                speed: 5,
                speedSpread: 2,
                emissionRate: 40,
                maxParticles: 60,
                life: 0.8,
                lifeSpread: 0.3,
                size: 0.2,
                sizeSpread: 0.1,
                endSize: 0.1,
                color: { r: 0.8, g: 0.1, b: 0.1, a: 0.9 },
                colorSpread: { r: 0.1, g: 0, b: 0 },
                endColor: { r: 0.4, g: 0, b: 0, a: 0 },
                gravity: { x: 0, y: -8, z: 0 },
                loop: false,
                duration: 0.2
            },
            
            /**
             * 升级光环效果
             */
            levelUp: {
                name: 'levelUp',
                position: { x: 0, y: 0, z: 0 },
                positionSpread: { x: 0, y: 0, z: 0 },
                direction: { x: 0, y: 1, z: 0 },
                directionSpread: { x: 180, y: 90, z: 180 },
                speed: 2,
                speedSpread: 0.5,
                emissionRate: 60,
                maxParticles: 200,
                life: 1.5,
                lifeSpread: 0.3,
                size: 0.4,
                sizeSpread: 0.2,
                endSize: 0.1,
                color: { r: 1, g: 0.9, b: 0.3, a: 1 },
                colorSpread: { r: 0.1, g: 0.1, b: 0 },
                endColor: { r: 1, g: 0.6, b: 0.1, a: 0 },
                glow: true,
                gravity: { x: 0, y: 1, z: 0 },
                loop: false,
                duration: 1.0
            }
        };
    }
    
    /**
     * 创建发射器
     * @param {string} name - 发射器名称
     * @param {Object} options - 配置选项
     * @returns {ParticleEmitter}
     */
    createEmitter(name, options = {}) {
        const emitter = new ParticleEmitter({
            name,
            ...options
        });
        
        this.emitters.set(name, emitter);
        return emitter;
    }
    
    /**
     * 从模板创建发射器
     * @param {string} templateName - 模板名称
     * @param {Object} overrides - 覆盖选项
     * @returns {ParticleEmitter}
     */
    createFromTemplate(templateName, overrides = {}) {
        const template = this.templates[templateName];
        if (!template) {
            console.warn(`ParticleSystem: Template "${templateName}" not found`);
            return null;
        }
        
        const emitter = new ParticleEmitter({
            ...template,
            ...overrides,
            name: overrides.name || templateName
        });
        
        this.emitters.set(emitter.name, emitter);
        return emitter;
    }
    
    /**
     * 获取发射器
     */
    getEmitter(name) {
        return this.emitters.get(name);
    }
    
    /**
     * 删除发射器
     */
    removeEmitter(name) {
        const emitter = this.emitters.get(name);
        if (emitter) {
            emitter.reset();
            this.emitters.delete(name);
        }
    }
    
    /**
     * 播放特效
     * @param {string} templateName - 模板名称
     * @param {Object} position - 位置
     * @returns {ParticleEmitter|null}
     */
    playEffect(templateName, position = { x: 0, y: 0, z: 0 }) {
        const emitter = this.createFromTemplate(templateName, {
            position,
            loop: false
        });
        
        if (emitter) {
            emitter.play();
        }
        
        return emitter;
    }
    
    /**
     * 启动持续特效
     * @param {string} templateName - 模板名称
     * @param {Object} position - 位置
     * @returns {ParticleEmitter|null}
     */
    startLoopingEffect(templateName, position = { x: 0, y: 0, z: 0 }) {
        const emitter = this.createFromTemplate(templateName, {
            position,
            loop: true
        });
        
        if (emitter) {
            emitter.play();
        }
        
        return emitter;
    }
    
    /**
     * 更新所有发射器
     * @param {number} deltaTime - 时间增量
     */
    update(deltaTime) {
        if (!this.isEnabled) return;
        
        const scaledDelta = deltaTime * this.globalSpeed;
        let totalParticles = 0;
        
        for (const [name, emitter] of this.emitters) {
            emitter.update(scaledDelta);
            totalParticles += emitter.getParticleCount();
        }
        
        // 如果粒子总数超过限制，移除最早的发射器
        if (totalParticles > this.maxTotalParticles) {
            const firstEmitter = this.emitters.values().next().value;
            if (firstEmitter) {
                this.removeEmitter(firstEmitter.name);
            }
        }
    }
    
    /**
     * 获取所有粒子（用于渲染）
     * @returns {Array}
     */
    getAllParticles() {
        const particles = [];
        
        for (const emitter of this.emitters.values()) {
            particles.push(...emitter.particles);
        }
        
        return particles;
    }
    
    /**
     * 获取粒子统计信息
     */
    getStats() {
        let totalParticles = 0;
        const emitterStats = [];
        
        for (const [name, emitter] of this.emitters) {
            const count = emitter.getParticleCount();
            totalParticles += count;
            emitterStats.push({
                name,
                count,
                isPlaying: emitter.isPlaying,
                isComplete: emitter.isComplete
            });
        }
        
        return {
            totalParticles,
            emitterCount: this.emitters.size,
            emitters: emitterStats
        };
    }
    
    /**
     * 停止并清除所有发射器
     */
    clear() {
        for (const emitter of this.emitters.values()) {
            emitter.stop();
            emitter.reset();
        }
        this.emitters.clear();
    }
    
    /**
     * 暂停/恢复系统
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
    }
    
    /**
     * 设置全局速度
     */
    setGlobalSpeed(speed) {
        this.globalSpeed = speed;
    }
    
    /**
     * 添加自定义模板
     */
    addTemplate(name, options) {
        this.templates[name] = {
            name,
            ...options
        };
    }
}

module.exports = ParticleSystem;
