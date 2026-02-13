/**
 * DayNightCycle - 动态日夜循环系统
 * 控制游戏世界的时间流逝和光照变化
 */

class DayNightCycle {
    constructor(options = {}) {
        this.scene = options.scene || null;
        this.gameTime = options.startTime || 6; // 0-24 小时
        this.timeScale = options.timeScale || 1; // 时间流逝速度
        this.isPaused = false;
        
        // 光照组件
        this.sunLight = null;
        this.ambientLight = null;
        this.moonLight = null;
        
        // 颜色配置
        this.colors = {
            dawn: { r: 1.0, g: 0.6, b: 0.4 },
            day: { r: 1.0, g: 1.0, b: 0.9 },
            dusk: { r: 0.8, g: 0.4, b: 0.3 },
            night: { r: 0.1, g: 0.1, b: 0.2 }
        };
        
        // 回调函数
        this.onTimeChange = null;
        this.onPhaseChange = null;
        
        this.currentPhase = 'dawn';
        this.init();
    }
    
    init() {
        if (!this.scene) return;
        
        // 创建主光源（太阳）
        this.sunLight = new THREE.DirectionalLight(0xffffff, 1);
        this.sunLight.position.set(50, 100, 50);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.scene.add(this.sunLight);
        
        // 环境光
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(this.ambientLight);
        
        // 月光
        this.moonLight = new THREE.DirectionalLight(0x6666aa, 0);
        this.moonLight.position.set(-30, 80, -30);
        this.scene.add(this.moonLight);
        
        // 天空盒
        this.createSkyDome();
        
        this.updateLighting();
    }
    
    createSkyDome() {
        const skyGeo = new THREE.SphereGeometry(500, 32, 32);
        const skyMat = new THREE.ShaderMaterial({
            uniforms: {
                topColor: { value: new THREE.Color(0x0077ff) },
                bottomColor: { value: new THREE.Color(0xffffff) },
                offset: { value: 33 },
                exponent: { value: 0.6 }
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 topColor;
                uniform vec3 bottomColor;
                uniform float offset;
                uniform float exponent;
                varying vec3 vWorldPosition;
                void main() {
                    float h = normalize(vWorldPosition + offset).y;
                    gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
                }
            `,
            side: THREE.BackSide
        });
        
        this.skyDome = new THREE.Mesh(skyGeo, skyMat);
        this.scene.add(this.skyDome);
    }
    
    update(deltaTime) {
        if (this.isPaused) return;
        
        const oldPhase = this.currentPhase;
        this.gameTime += (deltaTime / 1000) * this.timeScale / 60; // 1秒=1分钟
        
        if (this.gameTime >= 24) {
            this.gameTime = 0;
        }
        
        this.updateLighting();
        
        if (this.onTimeChange) {
            this.onTimeChange(this.gameTime);
        }
        
        if (this.currentPhase !== oldPhase && this.onPhaseChange) {
            this.onPhaseChange(this.currentPhase);
        }
    }
    
    updateLighting() {
        const hour = this.gameTime;
        let intensity, color, ambientIntensity;
        
        // 确定当前时段
        if (hour >= 5 && hour < 7) {
            this.currentPhase = 'dawn';
            const t = (hour - 5) / 2;
            intensity = t * 0.8;
            color = this.lerpColor(this.colors.night, this.colors.dawn, t);
            ambientIntensity = 0.2 + t * 0.3;
        } else if (hour >= 7 && hour < 17) {
            this.currentPhase = 'day';
            intensity = 1;
            color = this.colors.day;
            ambientIntensity = 0.5;
        } else if (hour >= 17 && hour < 20) {
            this.currentPhase = 'dusk';
            const t = (hour - 17) / 3;
            intensity = 1 - t * 0.5;
            color = this.lerpColor(this.colors.day, this.colors.dusk, t);
            ambientIntensity = 0.5 - t * 0.2;
        } else if (hour >= 20 || hour < 5) {
            this.currentPhase = 'night';
            intensity = 0;
            color = this.colors.night;
            ambientIntensity = 0.2;
        }
        
        // 更新光照
        if (this.sunLight) {
            this.sunLight.intensity = intensity;
            this.sunLight.color.setRGB(color.r, color.g, color.b);
            
            // 太阳位置随时间变化
            const angle = ((hour - 6) / 12) * Math.PI;
            this.sunLight.position.set(
                Math.cos(angle) * 100,
                Math.sin(angle) * 100,
                30
            );
        }
        
        if (this.ambientLight) {
            this.ambientLight.intensity = ambientIntensity;
        }
        
        if (this.moonLight) {
            this.moonLight.intensity = (1 - intensity) * 0.3;
        }
        
        // 更新天空颜色
        if (this.skyDome) {
            const skyColor = color || this.colors.day;
            this.skyDome.material.uniforms.topColor.value.setRGB(
                skyColor.r * 0.5,
                skyColor.g * 0.5,
                skyColor.b * 0.7
            );
        }
    }
    
    lerpColor(c1, c2, t) {
        return {
            r: c1.r + (c2.r - c1.r) * t,
            g: c1.g + (c2.g - c1.g) * t,
            b: c1.b + (c2.b - c1.b) * t
        };
    }
    
    setTime(hour) {
        this.gameTime = Math.max(0, Math.min(24, hour));
        this.updateLighting();
    }
    
    setTimeScale(scale) {
        this.timeScale = Math.max(0, scale);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    getFormattedTime() {
        const hours = Math.floor(this.gameTime);
        const minutes = Math.floor((this.gameTime - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    getPhase() {
        return this.currentPhase;
    }
    
    destroy() {
        if (this.sunLight) this.scene.remove(this.sunLight);
        if (this.ambientLight) this.scene.remove(this.ambientLight);
        if (this.moonLight) this.scene.remove(this.moonLight);
        if (this.skyDome) this.scene.remove(this.skyDome);
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DayNightCycle };
}
