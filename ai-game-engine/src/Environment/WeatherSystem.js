/**
 * WeatherSystem - 动态天气系统
 * 支持雨、雪、雾、雷暴等天气效果
 */

class WeatherSystem {
    constructor(options = {}) {
        this.scene = options.scene || null;
        this.enabled = true;
        
        // 天气类型
        this.currentWeather = 'clear';
        this.weatherIntensity = 0;
        this.targetWeather = 'clear';
        this.transitionSpeed = options.transitionSpeed || 0.5;
        
        // 粒子系统
        this.rainParticles = null;
        this.snowParticles = null;
        this.fog = null;
        
        // 闪电
        this.lightningTimer = 0;
        this.lightningInterval = 3000; // 毫秒
        this.isLightningActive = false;
        
        // 回调
        this.onWeatherChange = null;
        
        // 颜色配置
        this.weatherColors = {
            clear: 0x87CEEB,
            rain: 0x4a5568,
            snow: 0xe2e8f0,
            fog: 0x718096,
            storm: 0x2d3748
        };
        
        this.init();
    }
    
    init() {
        if (!this.scene) return;
        
        this.createRain();
        this.createSnow();
        this.createFog();
        
        // 初始天气
        this.setWeather('clear');
    }
    
    createRain() {
        const rainCount = 5000;
        const rainGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(rainCount * 3);
        
        for (let i = 0; i < rainCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const rainMat = new THREE.PointsMaterial({
            color: 0xaaaadd,
            size: 0.2,
            transparent: true,
            opacity: 0.6
        });
        
        this.rainParticles = new THREE.Points(rainGeo, rainMat);
        this.rainParticles.visible = false;
        this.scene.add(this.rainParticles);
        
        // 雨滴速度
        this.rainVelocity = [];
        for (let i = 0; i < rainCount; i++) {
            this.rainVelocity.push(0.5 + Math.random() * 0.5);
        }
    }
    
    createSnow() {
        const snowCount = 3000;
        const snowGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(snowCount * 3);
        
        for (let i = 0; i < snowCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = Math.random() * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        }
        
        snowGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const snowMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.3,
            transparent: true,
            opacity: 0.8,
            map: this.createSnowflakeTexture(),
            blending: THREE.AdditiveBlending
        });
        
        this.snowParticles = new THREE.Points(snowGeo, snowMat);
        this.snowParticles.visible = false;
        this.scene.add(this.snowParticles);
        
        this.snowVelocity = [];
        for (let i = 0; i < snowCount; i++) {
            this.snowVelocity.push({
                y: 0.02 + Math.random() * 0.03,
                x: (Math.random() - 0.5) * 0.02
            });
        }
    }
    
    createSnowflakeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }
    
    createFog() {
        this.scene.fog = new THREE.Fog(0x87CEEB, 10, 100);
        this.scene.fog.visible = false;
    }
    
    setWeather(weather, intensity = 1) {
        const oldWeather = this.currentWeather;
        this.targetWeather = weather;
        this.weatherIntensity = intensity;
        
        if (this.onWeatherChange) {
            this.onWeatherChange(weather, intensity);
        }
        
        // 立即切换（可改为平滑过渡）
        this.applyWeather(weather, intensity);
        
        return this;
    }
    
    applyWeather(weather, intensity) {
        // 隐藏所有天气粒子
        if (this.rainParticles) this.rainParticles.visible = false;
        if (this.snowParticles) this.snowParticles.visible = false;
        if (this.scene.fog) this.scene.fog.visible = false;
        
        switch (weather) {
            case 'rain':
            case 'storm':
                if (this.rainParticles) {
                    this.rainParticles.visible = true;
                    this.rainParticles.material.opacity = 0.6 * intensity;
                }
                if (this.scene.fog) {
                    this.scene.fog.visible = true;
                    this.scene.fog.color.setHex(this.weatherColors[weather]);
                    this.scene.fog.near = 10 + (1 - intensity) * 40;
                    this.scene.fog.far = 50 + (1 - intensity) * 50;
                }
                // 雷暴闪电
                if (weather === 'storm') {
                    this.enableLightning();
                }
                break;
                
            case 'snow':
                if (this.snowParticles) {
                    this.snowParticles.visible = true;
                    this.snowParticles.material.opacity = 0.8 * intensity;
                }
                if (this.scene.fog) {
                    this.scene.fog.visible = true;
                    this.scene.fog.color.setHex(this.weatherColors.snow);
                    this.scene.fog.near = 5;
                    this.scene.fog.far = 30 + (1 - intensity) * 20;
                }
                break;
                
            case 'fog':
                if (this.scene.fog) {
                    this.scene.fog.visible = true;
                    this.scene.fog.color.setHex(this.weatherColors.fog);
                    this.scene.fog.near = 5;
                    this.scene.fog.far = 20 + (1 - intensity) * 30;
                }
                break;
                
            case 'clear':
            default:
                if (this.scene.fog) {
                    this.scene.fog.visible = false;
                }
                this.disableLightning();
                break;
        }
        
        this.currentWeather = weather;
    }
    
    enableLightning() {
        this.isLightningActive = true;
    }
    
    disableLightning() {
        this.isLightningActive = false;
    }
    
    triggerLightning() {
        if (!this.isLightningActive) return;
        
        // 闪光效果
        const flash = new THREE.PointLight(0xffffff, 5, 200);
        flash.position.set(
            (Math.random() - 0.5) * 100,
            50,
            (Math.random() - 0.5) * 100
        );
        this.scene.add(flash);
        
        // 淡出
        setTimeout(() => {
            this.scene.remove(flash);
        }, 100);
        
        // 可能多次闪光
        if (Math.random() > 0.5) {
            setTimeout(() => this.triggerLightning(), 150);
        }
    }
    
    update(deltaTime) {
        if (!this.enabled) return;
        
        const positions = this.rainParticles?.geometry?.attributes?.position;
        
        // 更新雨滴
        if (this.rainParticles?.visible && positions) {
            const count = positions.count;
            for (let i = 0; i < count; i++) {
                let y = positions.getY(i);
                y -= this.rainVelocity[i] * this.weatherIntensity;
                
                if (y < 0) {
                    y = 50;
                    positions.setX(i, (Math.random() - 0.5) * 100);
                    positions.setZ(i, (Math.random() - 0.5) * 100);
                }
                
                positions.setY(i, y);
            }
            positions.needsUpdate = true;
        }
        
        // 更新雪花
        if (this.snowParticles?.visible && this.snowParticles.geometry?.attributes?.position) {
            const snowPositions = this.snowParticles.geometry.attributes.position;
            const count = snowPositions.count;
            
            for (let i = 0; i < count; i++) {
                let y = snowPositions.getY(i);
                let x = snowPositions.getX(i);
                
                y -= this.snowVelocity[i].y * this.weatherIntensity;
                x += this.snowVelocity[i].x * this.weatherIntensity;
                
                if (y < 0) {
                    y = 50;
                    snowPositions.setX(i, (Math.random() - 0.5) * 100);
                    snowPositions.setZ(i, (Math.random() - 0.5) * 100);
                }
                
                snowPositions.setY(i, y);
                snowPositions.setX(i, x);
            }
            snowPositions.needsUpdate = true;
        }
        
        // 闪电计时
        if (this.isLightningActive) {
            this.lightningTimer += deltaTime;
            if (this.lightningTimer >= this.lightningInterval) {
                this.lightningTimer = 0;
                this.lightningInterval = 2000 + Math.random() * 5000;
                this.triggerLightning();
            }
        }
    }
    
    getWeather() {
        return this.currentWeather;
    }
    
    isRaining() {
        return this.currentWeather === 'rain' || this.currentWeather === 'storm';
    }
    
    isSnowing() {
        return this.currentWeather === 'snow';
    }
    
    destroy() {
        if (this.rainParticles) this.scene.remove(this.rainParticles);
        if (this.snowParticles) this.scene.remove(this.snowParticles);
        if (this.scene.fog) {
            this.scene.fog.visible = false;
        }
    }
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WeatherSystem };
}
