/**
 * 粒子系统核心模块
 * AI Game Engine - Particle System
 */

class ParticleEmitter {
    constructor(options = {}) {
        this.options = {
            maxParticles: options.maxParticles || 100,
            lifetime: options.lifetime || 1000,      // 粒子生命周期(ms)
            lifetimeVar: options.lifetimeVar || 0,   // 生命周期随机变化
            emissionRate: options.emissionRate || 10, // 每秒发射数量
            loop: options.loop !== false,
            
            // 位置
            position: options.position || { x: 0, y: 0, z: 0 },
            positionVar: options.positionVar || { x: 0, y: 0, z: 0 },
            
            // 速度
            velocity: options.velocity || { x: 0, y: 1, z: 0 },
            velocityVar: options.velocityVar || { x: 0.5, y: 0.5, z: 0.5 },
            
            // 颜色
            startColor: options.startColor || { r: 1, g: 1, b: 1, a: 1 },
            endColor: options.endColor || { r: 1, g: 1, b: 1, a: 0 },
            
            // 大小
            startSize: options.startSize || 1,
            endSize: options.endSize || 0,
            sizeVar: options.sizeVar || 0,
            
            // 旋转
            rotationSpeed: options.rotationSpeed || 0,
            rotationSpeedVar: options.rotationSpeedVar || 0,
            
            // 物理
            gravity: options.gravity || { x: 0, y: 0, z: 0 },
            damping: options.damping || 1,
            
            // 渲染
            blending: options.blending || 'additive', // additive | normal
            depthWrite: options.depthWrite || false,
            texture: options.texture || null,
            transparent: options.transparent !== false,
            
            // 发射形状
            emitterShape: options.emitterShape || 'point', // point | box | sphere | cone
            emitterSize: options.emitterSize || { x: 1, y: 1, z: 1 },
            emitterAngle: options.emitterAngle || 0,
            
            // 一次性发射
            burst: options.burst || null,
            
            // 跟随目标
            followTarget: options.followTarget || null,
            followOffset: options.followOffset || { x: 0, y: 0, z: 0 }
        };

        this.particles = [];
        this.active = true;
        this.elapsedTime = 0;
        this.lastEmitTime = 0;
        this.emissionCount = 0;
        
        // 几何体和材质（共享）
        this.geometry = null;
        this.material = null;
        this.mesh = null;
        
        this._initGeometry();
    }

    _initGeometry() {
        // 创建粒子几何体
        this.geometry = new THREE.BufferGeometry();
        
        // 粒子属性
        const positions = new Float32Array(this.options.maxParticles * 3);
        const colors = new Float32Array(this.options.maxParticles * 4);
        const sizes = new Float32Array(this.options.maxParticles);
        const rotations = new Float32Array(this.options.maxParticles);
        
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        this.geometry.setAttribute('rotation', new THREE.BufferAttribute(rotations, 1));
        
        // 初始化所有粒子为"死亡"状态
        for (let i = 0; i < this.options.maxParticles; i++) {
            positions[i * 3] = 99999; // 移出视野
            positions[i * 3 + 1] = 99999;
            positions[i * 3 + 2] = 99999;
            this.particles.push({
                alive: false,
                life: 0,
                maxLife: 0,
                position: { x: 0, y: 0, z: 0 },
                velocity: { x: 0, y: 0, z: 0 },
                color: { r: 1, g: 1, b: 1, a: 1 },
                size: 1,
                rotation: 0,
                rotationSpeed: 0
            });
        }

        // 创建着色器材质
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: this.options.texture },
                uBlending: { value: this.options.blending === 'additive' ? THREE.AdditiveBlending : THREE.NormalBlending }
            },
            vertexShader: `
                attribute float size;
                attribute vec4 color;
                varying vec4 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform int uBlending;
                varying vec4 vColor;
                void main() {
                    vec2 uv = gl_PointCoord;
                    vec4 texColor = texture2D(uTexture, uv);
                    gl_FragColor = vColor * texColor;
                    if (uBlending == 1) {
                        gl_FragColor.rgb *= gl_FragColor.a;
                    }
                }
            `,
            transparent: this.options.transparent,
            depthWrite: this.options.depthWrite,
            blending: this.options.blending === 'additive' ? THREE.AdditiveBlending : THREE.NormalBlending,
            vertexColors: true
        });

        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.frustumCulled = false;
    }

    _getRandomInRange(base, variance) {
        if (variance === 0) return base;
        return base + (Math.random() * 2 - 1) * variance;
    }

    _getRandomPosition() {
        const { emitterShape, emitterSize, position, positionVar, emitterAngle } = this.options;
        let x = this._getRandomInRange(position.x, positionVar.x);
        let y = this._getRandomInRange(position.y, positionVar.y);
        let z = this._getRandomInRange(position.z, positionVar.z);

        if (emitterShape === 'box') {
            x += (Math.random() - 0.5) * emitterSize.x;
            y += (Math.random() - 0.5) * emitterSize.y;
            z += (Math.random() - 0.5) * emitterSize.z;
        } else if (emitterShape === 'sphere') {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = Math.random() * emitterSize.x;
            x += r * Math.sin(phi) * Math.cos(theta);
            y += r * Math.sin(phi) * Math.sin(theta);
            z += r * Math.cos(phi);
        } else if (emitterShape === 'cone') {
            const angle = (Math.random() - 0.5) * emitterAngle;
            const radius = Math.random() * emitterSize.x;
            x += Math.sin(angle) * radius;
            z += Math.cos(angle) * radius;
            y += Math.random() * emitterSize.y;
        }

        return { x, y, z };
    }

    _getRandomVelocity() {
        const { velocity, velocityVar, emitterShape, emitterAngle } = this.options;
        
        let vx = this._getRandomInRange(velocity.x, velocityVar.x);
        let vy = this._getRandomInRange(velocity.y, velocityVar.y);
        let vz = this._getRandomInRange(velocity.z, velocityVar.z);

        // 锥形发射器
        if (emitterShape === 'cone') {
            const angle = (Math.random() - 0.5) * emitterAngle;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const tempX = vx * cos - vz * sin;
            const tempZ = vx * sin + vz * cos;
            vx = tempX;
            vz = tempZ;
        }

        return { x: vx, y: vy, z: vz };
    }

    emit(count = 1) {
        let emitted = 0;
        for (let i = 0; i < this.particles.length && emitted < count; i++) {
            if (!this.particles[i].alive) {
                const particle = this.particles[i];
                particle.alive = true;
                particle.maxLife = this.options.lifetime + this._getRandomInRange(0, this.options.lifetimeVar);
                particle.life = particle.maxLife;
                particle.position = this._getRandomPosition();
                particle.velocity = this._getRandomVelocity();
                particle.color = { ...this.options.startColor };
                particle.size = this._getRandomInRange(this.options.startSize, this.options.sizeVar);
                particle.rotation = Math.random() * Math.PI * 2;
                particle.rotationSpeed = this._getRandomInRange(this.options.rotationSpeed, this.options.rotationSpeedVar);
                emitted++;
            }
        }
    }

    update(deltaTime) {
        if (!this.active) return;

        this.elapsedTime += deltaTime * 1000;

        // 处理一次性爆发
        if (this.options.burst && this.emissionCount === 0) {
            this.emit(this.options.burst.count || this.options.maxParticles);
            this.emissionCount++;
            if (!this.options.loop) {
                this.active = false;
            }
        }

        // 正常发射
        if (this.active && this.options.emissionRate > 0) {
            const emitInterval = 1000 / this.options.emissionRate;
            while (this.elapsedTime - this.lastEmitTime >= emitInterval) {
                this.emit(1);
                this.lastEmitTime += emitInterval;
            }
        }

        // 更新粒子
        const positions = this.geometry.attributes.position.array;
        const colors = this.geometry.attributes.color.array;
        const sizes = this.geometry.attributes.size.array;
        const rotations = this.geometry.attributes.rotation.array;

        let aliveCount = 0;

        for (let i = 0; i < this.particles.length; i++) {
            const particle = this.particles[i];
            
            if (!particle.alive) continue;

            // 更新生命周期
            particle.life -= deltaTime * 1000;
            
            if (particle.life <= 0) {
                particle.alive = false;
                positions[i * 3] = 99999;
                positions[i * 3 + 1] = 99999;
                positions[i * 3 + 2] = 99999;
                continue;
            }

            aliveCount++;

            // 更新位置（跟随目标）
            if (this.options.followTarget && this.options.followTarget.position) {
                const target = this.options.followTarget.position;
                particle.position.x = target.x + this.options.followOffset.x;
                particle.position.y = target.y + this.options.followOffset.y;
                particle.position.z = target.z + this.options.followOffset.z;
            }

            // 应用速度和重力
            particle.velocity.x *= this.options.damping;
            particle.velocity.y *= this.options.damping;
            particle.velocity.z *= this.options.damping;
            
            particle.velocity.x += this.options.gravity.x * deltaTime;
            particle.velocity.y += this.options.gravity.y * deltaTime;
            particle.velocity.z += this.options.gravity.z * deltaTime;

            particle.position.x += particle.velocity.x * deltaTime;
            particle.position.y += particle.velocity.y * deltaTime;
            particle.position.z += particle.velocity.z * deltaTime;

            // 更新旋转
            particle.rotation += particle.rotationSpeed * deltaTime;

            // 计算生命周期进度 (0 = 出生, 1 = 死亡)
            const lifeProgress = 1 - (particle.life / particle.maxLife);

            // 更新颜色
            particle.color.r = this.options.startColor.r + 
                (this.options.endColor.r - this.options.startColor.r) * lifeProgress;
            particle.color.g = this.options.startColor.g + 
                (this.options.endColor.g - this.options.startColor.g) * lifeProgress;
            particle.color.b = this.options.startColor.b + 
                (this.options.endColor.b - this.options.startColor.b) * lifeProgress;
            particle.color.a = this.options.startColor.a + 
                (this.options.endColor.a - this.options.startColor.a) * lifeProgress;

            // 更新大小
            particle.size = this.options.startSize + 
                (this.options.endSize - this.options.startSize) * lifeProgress;

            // 更新几何体数据
            positions[i * 3] = particle.position.x;
            positions[i * 3 + 1] = particle.position.y;
            positions[i * 3 + 2] = particle.position.z;

            colors[i * 4] = particle.color.r;
            colors[i * 4 + 1] = particle.color.g;
            colors[i * 4 + 2] = particle.color.b;
            colors[i * 4 + 3] = particle.color.a;

            sizes[i] = particle.size;
            rotations[i] = particle.rotation;
        }

        // 标记几何体需要更新
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.rotation.needsUpdate = true;

        return aliveCount;
    }

    getMesh() {
        return this.mesh;
    }

    dispose() {
        if (this.geometry) this.geometry.dispose();
        if (this.material) this.material.dispose();
    }
}

// 粒子系统管理器
class ParticleSystem {
    constructor() {
        this.emitters = new Map();
        this.scene = null;
        this.clock = new THREE.Clock();
    }

    add(name, emitter) {
        if (this.scene && !emitter.mesh.parent) {
            this.scene.add(emitter.mesh);
        }
        this.emitters.set(name, emitter);
        return emitter;
    }

    remove(name) {
        const emitter = this.emitters.get(name);
        if (emitter) {
            if (this.scene && emitter.mesh.parent) {
                this.scene.remove(emitter.mesh);
            }
            emitter.dispose();
            this.emitters.delete(name);
        }
    }

    get(name) {
        return this.emitters.get(name);
    }

    setScene(scene) {
        this.scene = scene;
        // 将所有发射器添加到场景
        this.emitters.forEach(emitter => {
            if (!emitter.mesh.parent) {
                scene.add(emitter.mesh);
            }
        });
    }

    update(deltaTime) {
        this.emitters.forEach(emitter => {
            emitter.update(deltaTime);
        });
    }

    dispose() {
        this.emitters.forEach(emitter => emitter.dispose());
        this.emitters.clear();
    }
}

module.exports = { ParticleEmitter, ParticleSystem };
