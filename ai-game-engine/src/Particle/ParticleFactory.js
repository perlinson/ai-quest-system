/**
 * 粒子工厂 - 预设效果集合
 * AI Game Engine - Particle Factory
 */

const { ParticleEmitter, ParticleSystem } = require('./ParticleEmitter');

class ParticleFactory {
    constructor(particleSystem) {
        this.system = particleSystem;
    }

    /**
     * 创建火焰效果
     */
    createFire(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 200,
            lifetime: 1500,
            lifetimeVar: 500,
            emissionRate: 50,
            position: position,
            positionVar: { x: 0.5, y: 0.1, z: 0.5 },
            velocity: { x: 0, y: 3, z: 0 },
            velocityVar: { x: 0.5, y: 1, z: 0.5 },
            startColor: { r: 1, g: 0.5, b: 0, a: 1 },
            endColor: { r: 1, g: 0, b: 0, a: 0 },
            startSize: 1.5,
            endSize: 0.3,
            sizeVar: 0.3,
            gravity: { x: 0, y: -1, z: 0 },
            damping: 0.98,
            blending: 'additive',
            emitterShape: 'cone',
            emitterAngle: 0.3
        });
    }

    /**
     * 创建烟雾效果
     */
    createSmoke(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 100,
            lifetime: 3000,
            lifetimeVar: 1000,
            emissionRate: 20,
            position: position,
            positionVar: { x: 0.5, y: 0.1, z: 0.5 },
            velocity: { x: 0, y: 1.5, z: 0 },
            velocityVar: { x: 0.3, y: 0.5, z: 0.3 },
            startColor: { r: 0.3, g: 0.3, b: 0.3, a: 0.4 },
            endColor: { r: 0.2, g: 0.2, b: 0.2, a: 0 },
            startSize: 2,
            endSize: 4,
            sizeVar: 1,
            gravity: { x: 0, y: 0.2, z: 0 },
            damping: 0.99,
            blending: 'normal',
            emitterShape: 'cone',
            emitterAngle: 0.2
        });
    }

    /**
     * 创建爆炸效果
     */
    createExplosion(position = { x: 0, y: 0, z: 0 }) {
        const emitter = new ParticleEmitter({
            maxParticles: 100,
            lifetime: 800,
            lifetimeVar: 200,
            emissionRate: 0,
            position: position,
            positionVar: { x: 0.5, y: 0.5, z: 0.5 },
            velocity: { x: 0, y: 0, z: 0 },
            velocityVar: { x: 8, y: 8, z: 8 },
            startColor: { r: 1, g: 0.8, b: 0.2, a: 1 },
            endColor: { r: 1, g: 0.2, b: 0, a: 0 },
            startSize: 2,
            endSize: 0.5,
            sizeVar: 0.5,
            gravity: { x: 0, y: -5, z: 0 },
            damping: 0.95,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 1, y: 1, z: 1 }
        });
        emitter.options.burst = { count: 100 };
        return emitter;
    }

    /**
     * 创建火花效果
     */
    createSparks(position = { x: 0, y: 0, z: 0 }) {
        const emitter = new ParticleEmitter({
            maxParticles: 50,
            lifetime: 500,
            lifetimeVar: 200,
            emissionRate: 0,
            position: position,
            positionVar: { x: 0.2, y: 0.2, z: 0.2 },
            velocity: { x: 0, y: 2, z: 0 },
            velocityVar: { x: 3, y: 3, z: 3 },
            startColor: { r: 1, g: 0.9, b: 0.5, a: 1 },
            endColor: { r: 1, g: 0.5, b: 0, a: 0 },
            startSize: 0.3,
            endSize: 0.1,
            sizeVar: 0.1,
            gravity: { x: 0, y: -3, z: 0 },
            damping: 0.97,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 0.5, y: 0.5, z: 0.5 }
        });
        emitter.options.burst = { count: 30 };
        return emitter;
    }

    /**
     * 创建魔法光环效果
     */
    createMagicAura(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 80,
            lifetime: 2000,
            lifetimeVar: 500,
            emissionRate: 30,
            position: position,
            positionVar: { x: 1, y: 1, z: 1 },
            velocity: { x: 0, y: 0.5, z: 0 },
            velocityVar: { x: 0.3, y: 0.3, z: 0.3 },
            startColor: { r: 0.5, g: 0.3, b: 1, a: 0.8 },
            endColor: { r: 0.8, g: 0.2, b: 1, a: 0 },
            startSize: 0.5,
            endSize: 1.5,
            sizeVar: 0.2,
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.99,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 1.5, y: 1.5, z: 1.5 }
        });
    }

    /**
     * 创建魔法球效果
     */
    createMagicOrb(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 60,
            lifetime: 1500,
            lifetimeVar: 300,
            emissionRate: 40,
            position: position,
            positionVar: { x: 0.2, y: 0.2, z: 0.2 },
            velocity: { x: 0, y: 0, z: 0 },
            velocityVar: { x: 0.5, y: 0.5, z: 0.5 },
            startColor: { r: 0.2, g: 0.8, b: 1, a: 1 },
            endColor: { r: 0.1, g: 0.5, b: 0.9, a: 0 },
            startSize: 0.8,
            endSize: 0.2,
            sizeVar: 0.2,
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.98,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 0.5, y: 0.5, z: 0.5 }
        });
    }

    /**
     * 创建雨效果
     */
    createRain(bounds = { x: 20, y: 10, z: 20 }, position = { x: 0, y: 10, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 500,
            lifetime: 1000,
            lifetimeVar: 200,
            emissionRate: 300,
            position: position,
            positionVar: { x: bounds.x / 2, y: 0, z: bounds.z / 2 },
            velocity: { x: 0, y: -15, z: 0 },
            velocityVar: { x: 0.5, y: 2, z: 0.5 },
            startColor: { r: 0.6, g: 0.7, b: 0.9, a: 0.6 },
            endColor: { r: 0.5, g: 0.6, b: 0.8, a: 0.3 },
            startSize: 0.1,
            endSize: 0.05,
            sizeVar: 0.02,
            gravity: { x: 0, y: -20, z: 0 },
            damping: 0.99,
            blending: 'normal',
            emitterShape: 'box',
            emitterSize: bounds
        });
    }

    /**
     * 创建雪效果
     */
    createSnow(bounds = { x: 20, y: 10, z: 20 }, position = { x: 0, y: 10, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 300,
            lifetime: 5000,
            lifetimeVar: 2000,
            emissionRate: 50,
            position: position,
            positionVar: { x: bounds.x / 2, y: 0, z: bounds.z / 2 },
            velocity: { x: 0, y: -2, z: 0 },
            velocityVar: { x: 1.5, y: 0.5, z: 1.5 },
            startColor: { r: 1, g: 1, b: 1, a: 0.9 },
            endColor: { r: 0.9, g: 0.9, b: 1, a: 0 },
            startSize: 0.3,
            endSize: 0.1,
            sizeVar: 0.1,
            gravity: { x: 0, y: -0.5, z: 0 },
            damping: 0.99,
            blending: 'normal',
            emitterShape: 'box',
            emitterSize: bounds
        });
    }

    /**
     * 创建能量护盾效果
     */
    createEnergyShield(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 100,
            lifetime: 100,
            lifetimeVar: 0,
            emissionRate: 100,
            loop: true,
            position: position,
            positionVar: { x: 2, y: 2, z: 2 },
            velocity: { x: 0, y: 0, z: 0 },
            velocityVar: { x: 0.1, y: 0.1, z: 0.1 },
            startColor: { r: 0.2, g: 0.6, b: 1, a: 0.8 },
            endColor: { r: 0.1, g: 0.3, b: 0.8, a: 0 },
            startSize: 0.5,
            endSize: 1,
            sizeVar: 0.3,
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.95,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 2, y: 2, z: 2 }
        });
    }

    /**
     * 创建武器攻击火花
     */
    createWeaponSparks(position = { x: 0, y: 0, z: 0 }) {
        const emitter = new ParticleEmitter({
            maxParticles: 20,
            lifetime: 300,
            lifetimeVar: 100,
            emissionRate: 0,
            position: position,
            positionVar: { x: 0.1, y: 0.1, z: 0.1 },
            velocity: { x: 0, y: 1, z: 1 },
            velocityVar: { x: 2, y: 2, z: 2 },
            startColor: { r: 1, g: 1, b: 0.8, a: 1 },
            endColor: { r: 1, g: 0.8, b: 0.4, a: 0 },
            startSize: 0.2,
            endSize: 0.05,
            sizeVar: 0.05,
            gravity: { x: 0, y: -5, z: 0 },
            damping: 0.92,
            blending: 'additive',
            emitterShape: 'cone',
            emitterAngle: 0.5
        });
        emitter.options.burst = { count: 15 };
        return emitter;
    }

    /**
     * 创建经验球效果（游戏升级）
     */
    createExpOrb(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 40,
            lifetime: 1500,
            lifetimeVar: 300,
            emissionRate: 25,
            position: position,
            positionVar: { x: 0.3, y: 0.3, z: 0.3 },
            velocity: { x: 0, y: 0, z: 0 },
            velocityVar: { x: 0.5, y: 0.8, z: 0.5 },
            startColor: { r: 0.2, g: 1, b: 0.4, a: 1 },
            endColor: { r: 0.1, g: 0.8, b: 0.2, a: 0 },
            startSize: 0.4,
            endSize: 0.8,
            sizeVar: 0.1,
            gravity: { x: 0, y: -0.3, z: 0 },
            damping: 0.98,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 0.5, y: 0.5, z: 0.5 }
        });
    }

    /**
     * 创建毒雾效果
     */
    createPoisonCloud(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 80,
            lifetime: 3000,
            lifetimeVar: 1000,
            emissionRate: 20,
            position: position,
            positionVar: { x: 0.8, y: 0.3, z: 0.8 },
            velocity: { x: 0, y: 0.3, z: 0 },
            velocityVar: { x: 0.2, y: 0.2, z: 0.2 },
            startColor: { r: 0.3, g: 0.8, b: 0.2, a: 0.6 },
            endColor: { r: 0.2, g: 0.5, b: 0.1, a: 0 },
            startSize: 1,
            endSize: 2.5,
            sizeVar: 0.5,
            gravity: { x: 0, y: 0.1, z: 0 },
            damping: 0.98,
            blending: 'normal',
            emitterShape: 'sphere',
            emitterSize: { x: 1, y: 1, z: 1 }
        });
    }

    /**
     * 创建冰霜效果
     */
    createFrost(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 60,
            lifetime: 2000,
            lifetimeVar: 500,
            emissionRate: 25,
            position: position,
            positionVar: { x: 1, y: 0.5, z: 1 },
            velocity: { x: 0, y: 0.5, z: 0 },
            velocityVar: { x: 0.5, y: 0.3, z: 0.5 },
            startColor: { r: 0.6, g: 0.9, b: 1, a: 0.9 },
            endColor: { r: 0.8, g: 0.9, b: 1, a: 0 },
            startSize: 0.6,
            endSize: 1.2,
            sizeVar: 0.2,
            gravity: { x: 0, y: -0.2, z: 0 },
            damping: 0.98,
            blending: 'additive',
            emitterShape: 'cone',
            emitterAngle: 0.4
        });
    }

    /**
     * 创建金币收集效果
     */
    createCoinCollect(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 30,
            lifetime: 800,
            lifetimeVar: 200,
            emissionRate: 40,
            position: position,
            positionVar: { x: 0.3, y: 0.3, z: 0.3 },
            velocity: { x: 0, y: 2, z: 0 },
            velocityVar: { x: 1, y: 1, z: 1 },
            startColor: { r: 1, g: 0.9, b: 0.2, a: 1 },
            endColor: { r: 1, g: 0.7, b: 0, a: 0 },
            startSize: 0.3,
            endSize: 0.1,
            sizeVar: 0.1,
            gravity: { x: 0, y: -3, z: 0 },
            damping: 0.95,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 0.3, y: 0.3, z: 0.3 }
        });
    }

    /**
     * 创建黑洞/虚空效果
     */
    createVoid(position = { x: 0, y: 0, z: 0 }) {
        return new ParticleEmitter({
            maxParticles: 80,
            lifetime: 2500,
            lifetimeVar: 500,
            emissionRate: 30,
            position: position,
            positionVar: { x: 1.5, y: 1.5, z: 1.5 },
            velocity: { x: 0, y: 0, z: 0 },
            velocityVar: { x: 0.8, y: 0.8, z: 0.8 },
            startColor: { r: 0.3, g: 0, b: 0.5, a: 0.8 },
            endColor: { r: 0.1, g: 0, b: 0.2, a: 0 },
            startSize: 0.5,
            endSize: 2,
            sizeVar: 0.3,
            gravity: { x: 0, y: 0, z: 0 },
            damping: 0.96,
            blending: 'additive',
            emitterShape: 'sphere',
            emitterSize: { x: 2, y: 2, z: 2 }
        });
    }

    /**
     * 快捷方法：创建并添加到系统
     */
    add(name, type, position) {
        const method = 'create' + type.charAt(0).toUpperCase() + type.slice(1);
        if (typeof this[method] === 'function') {
            const emitter = this[method](position);
            this.system.add(name, emitter);
            return emitter;
        }
        return null;
    }
}

module.exports = { ParticleFactory };
