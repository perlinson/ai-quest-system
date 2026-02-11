/**
 * 粒子系统模块导出
 * AI Game Engine - Particle System Module
 */

const { ParticleEmitter, ParticleSystem } = require('./ParticleEmitter');
const { ParticleFactory } = require('./ParticleFactory');

/**
 * 创建独立粒子系统的快捷函数
 */
function createParticleSystem() {
    return new ParticleSystem();
}

/**
 * 创建带工厂的粒子系统
 */
function createParticleSystemWithFactory(scene) {
    const system = new ParticleSystem();
    if (scene) {
        system.setScene(scene);
    }
    return {
        system: system,
        factory: new ParticleFactory(system)
    };
}

module.exports = {
    ParticleEmitter,
    ParticleSystem,
    ParticleFactory,
    createParticleSystem,
    createParticleSystemWithFactory
};
