/**
 * 🎬 YouTube Video Downloader
 * 使用 @distube/ytdl-core 下载YouTube视频
 */

const ytdl = require('@distube/ytdl-core');
const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const { pipeline } = require('stream/promises');

const CONFIG = {
    url: 'https://www.youtube.com/watch?v=cOTApju0uEk',
    outputDir: './downloads',
    quality: 'highest'
};

if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
}

console.log('🎬 YouTube Video Downloader');
console.log('============================');
console.log(`📹 视频: ${CONFIG.url}\n`);

/**
 * 获取视频信息
 */
async function getVideoInfo() {
    console.log('📺 获取视频信息...');
    
    try {
        const info = await ytdl.getInfo(CONFIG.url);
        
        console.log(`   标题: ${info.videoDetails.title}`);
        console.log(`   作者: ${info.videoDetails.author.name}`);
        console.log(`   时长: ${info.videoDetails.lengthSeconds}秒`);
        console.log(`   观看: ${info.videoDetails.viewCount}`);
        console.log(`   格式: ${info.formats.length}种`);
        
        return info;
    } catch (error) {
        console.error('❌ 获取信息失败:', error.message);
        return null;
    }
}

/**
 * 下载视频
 */
async function downloadVideo(info) {
    console.log('\n🎯 开始下载...');
    
    try {
        // 选择最佳格式
        const format = ytdl.chooseFormat(info.formats, { 
            quality: CONFIG.quality,
            filter: 'audioandvideo'
        });
        
        if (!format) {
            throw new Error('没有找到合适的视频格式');
        }
        
        console.log(`   格式: ${format.container} / ${format.qualityLabel || 'audio'}`);
        
        // 生成文件名
        const title = info.videoDetails.title
            .replace(/[<>:"/\\|?*]/g, '')
            .substring(0, 80);
        const filename = `${title}.${format.container}`;
        const filepath = path.join(CONFIG.outputDir, filename);
        
        console.log(`   文件: ${filename}`);
        
        // 使用ytdl-core的下载功能
        const videoUrl = format.url;
        
        // 获取实际下载URL
        const actualUrl = await getRedirectUrl(videoUrl);
        
        // 下载文件
        return new Promise((resolve, reject) => {
            https.get(actualUrl, (res) => {
                if (res.statusCode === 302 || res.statusCode === 301) {
                    https.get(res.headers.location, (res2) => handleResponse(res2, filepath, resolve, reject));
                } else {
                    handleResponse(res, filepath, resolve, reject);
                }
            }).on('error', reject);
        });
        
    } catch (error) {
        console.error('\n❌ 下载失败:', error.message);
        return null;
    }
}

/**
 * 获取重定向URL
 */
function getRedirectUrl(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 302 || res.statusCode === 301) {
                resolve(res.headers.location);
            } else {
                resolve(url);
            }
        }).on('error', reject);
    });
}

/**
 * 处理下载响应
 */
function handleResponse(res, filepath, resolve, reject) {
    const total = parseInt(res.headers['content-length'], 10);
    let downloaded = 0;
    
    const file = fs.createWriteStream(filepath);
    
    res.on('data', (chunk) => {
        downloaded += chunk.length;
        if (total > 0) {
            const percent = ((downloaded / total) * 100).toFixed(1);
            process.stdout.write(`\r📊 进度: ${percent}%`);
        }
    });
    
    res.pipe(file);
    
    file.on('finish', () => {
        file.close();
        console.log('\n');
        console.log(`✅ 下载完成: ${filepath}`);
        const sizeMB = fs.statSync(filepath).size / (1024 * 1024);
        console.log(`📦 大小: ${sizeMB.toFixed(2)} MB`);
        resolve(filepath);
    });
    
    res.on('error', (err) => {
        fs.unlink(filepath, () => {});
        reject(err);
    });
}

/**
 * 主函数
 */
async function main() {
    try {
        // 获取视频信息
        const info = await getVideoInfo();
        if (!info) {
            console.log('\n❌ 无法获取视频信息');
            return;
        }
        
        // 下载视频
        const filepath = await downloadVideo(info);
        
        if (filepath) {
            console.log('\n🎉 下载成功!');
            
            // 列出下载的文件
            console.log('\n📁 下载目录:');
            const files = fs.readdirSync(CONFIG.outputDir);
            files.forEach(f => {
                const fullPath = path.join(CONFIG.outputDir, f);
                if (fs.statSync(fullPath).isFile()) {
                    const size = fs.statSync(fullPath).size;
                    console.log(`   ${f} (${(size/1024/1024).toFixed(2)} MB)`);
                }
            });
            
            console.log('\n💡 可以发送文件到钉钉群了!');
        }
        
    } catch (error) {
        console.error('\n❌ 错误:', error.message);
    }
}

main();
