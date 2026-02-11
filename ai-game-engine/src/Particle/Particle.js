/**
 * 🎆 粒子类 - AI Game Engine
 * 
 * 单个粒子对象，包含位置、速度、生命周期等属性
 */

class Particle {
    constructor(options = {}) {
        // 基础属性
        this.position = options.position || { x: 0, y: 0, z: 0 };
        this.velocity = options.velocity || { x: 0, y: 0, z: 0 };
        this.acceleration = options.acceleration || { x: 0, y: 0, z: 0 };
        
        // 外观属性
        this.color = options.color || { r: 1, g: 1, b: 1, a: 1 };
        this.size = options.size || 1;
        this.rotation = options.rotation || 0;
        this.rotationSpeed = options.rotationSpeed || 0;
        
        // 生命周期
        this.life = options.life || 1.0;           // 总寿命（秒）
        this.age = 0;                              // 当前年龄
        this.isAlive = true;                       // 是否存活
        
        // 物理属性
        this.mass = options.mass || 1;
        this.damping = options.damping || 0.98;     // 速度衰减
        
        // 特殊效果
        this.glow = options.glow || false;          // 发光效果
        this.trail = options.trail || false;        // 拖尾效果
        this.texture = options.texture || null;     // 纹理贴图
        
        // 目标颜色（渐变效果）
        this.endColor = options.endColor || this.color;
        this.colorLerp = 0;                        // 颜色渐变进度
        
        // 目标大小（变化效果）
        this.endSize = options.endSize || this.size;
        this.sizeLerp = 0;                          // 大小变化进度
        
        // 速度曲线
        this.velocityCurve = options.velocityCurve || 'linear'; // linear, easeOut, easeIn
    }
    
    /**
     * 更新粒子状态
     * @param {number} deltaTime - 时间增量（秒）
     */
    update(deltaTime) {
        if (!this.isAlive) return;
        
        // 更新年龄
        this.age += deltaTime;
        
        // 检查是否死亡
        if (this.age >= this.life) {
            this.isAlive = false;
            return;
        }
        
        // 计算生命周期进度 (0-1)
        const progress = this.age / this.life;
        
        // 更新颜色渐变
        this.colorLerp = progress;
        this.color = this.lerpColor(this.color, this.endColor, progress);
        
        // 更新大小变化
        this.sizeLerp = progress;
        this.size = this.lerp(this.size, this.endSize, progress);
        
        // 应用速度衰减
        this.velocity.x *= this.damping;
        this.velocity.y *= this.damping;
        this.velocity.z *= this.damping;
        
        // 应用加速度
        this.velocity.x += this.acceleration.x * deltaTime;
        this.velocity.y += this.acceleration.y * deltaTime;
        this.velocity.z += this.acceleration.z * deltaTime;
        
        // 根据速度曲线调整
        if (this.velocityCurve === 'easeOut') {
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            this.velocity.x *= (1 + easeProgress * 0.5);
            this.velocity.y *= (1 + easeProgress * 0.5);
        } else if (this.velocityCurve === 'easeIn') {
            const easeProgress = Math.pow(progress, 3);
            this.velocity.x *= (1 - easeProgress * 0.3);
            this.velocity.y *= (1 - easeProgress * 0.3);
        }
        
        // 更新位置
        this.position.x += this.velocity.x * deltaTime;
        this.position.y += this.velocity.y * deltaTime;
        this.position.z += this.velocity.z * deltaTime;
        
        // 更新旋转
        this.rotation += this.rotationSpeed * deltaTime;
    }
    
    /**
     * 线性插值
     */
    lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    /**
     * 颜色线性插值
     */
    lerpColor(color1, color2, t) {
        return {
            r: color1.r + (color2.r - color1.r) * t,
            g: color1.g + (color2.g - color1.g) * t,
            b: color1.b + (color2.b - color1.b) * t,
            a: color1.a + (color2.a - color1.a) * t
        };
    }
    
    /**
     * 获取当前透明度（随生命周期淡出）
     */
    getAlpha() {
        const progress = this.age / this.life;
        // 最后20%生命周期内淡出
        if (progress > 0.8) {
            return 1 - (progress - 0.8) / 0.2;
        }
        return 1;
    }
    
    /**
     * 克隆粒子
     */
    clone() {
        return new Particle({
            position: { ...this.position },
            velocity: { ...this.velocity },
            color: { ...this.color },
            size: this.size,
            life: this.life,
            glow: this.glow,
            trail: this.trail
        });
    }
}

module.exports = Particle;
