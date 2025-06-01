//之前用的是专栏的，发现会过期，改用动态的
const uploadUrl = "https://member.bilibili.com/x/material/up/upload";
const pixelPath = "https://i0.hdslb.com/bfs/material_up/49f20d9277765f51227fecb4db010350c3ed90ad.gif"

// const pixelBuffer = (await fetch(pixelPath))
// console.log(await pixelBuffer.arrayBuffer())

// 配置请求头
const headers = new Headers({
    "accept": "*/*",
    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
    "origin": "https://member.bilibili.com",
    //"priority": "u=1, i",
    "referer": "https://member.bilibili.com/york/image-material-upload",
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Microsoft Edge\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
    //"Cookie": credentials.cookie
});

export const credentials = {}//这个被导出后，在mian里面被传参传入upload函数


/**
 * B站图片上传函数
 * @param {File} file - 文件对象
 * @param {Function} onProgress - 进度回调函数，参数为进度百分比(0-100)
 * @returns {Promise<Object>} - 返回B站API响应结果
 */
export async function uploadFile(file, onProgress) {
    // 校验必要参数
    if (!file || !credentials?.bili_jct) {
        throw new Error('缺少必要参数：file/csrf');
    }

    //为了实现文件上传，需要用图片隐写实现
    if (!isImage(file)) {
        //如果上传的文件不是图片
        const pixelBuffer = await (await fetch(pixelPath)).arrayBuffer()
        // console.log(pixelBuffer)
        const mergedBlob = new Blob([pixelBuffer, new Blob([file])])
        //修改file为图片+文件
        file=new File([mergedBlob], file.name)
    }

    // 构建FormData
    const formData = new FormData();
    const filename = file.name ||
        `bili_upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    formData.append("bucket", "material_up");
    formData.append("dir", "");
    formData.append("file", file, filename);//这里应该是二进制数据
    formData.append("csrf", credentials.bili_jct);

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // 监听上传进度
        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable && onProgress) {
                const progress = Math.round((event.loaded / event.total) * 100);
                onProgress(progress);
            }
        });

        // 监听请求完成
        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    if (result.code !== 0) {
                        reject(new Error(`上传失败: ${result.message} (code: ${result.code})`));
                    } else {
                        resolve(result);
                    }
                } catch (error) {
                    reject(new Error('解析响应失败'));
                }
            } else {
                reject(new Error(`HTTP错误: ${xhr.status}`));
            }
        });

        // 监听错误
        xhr.addEventListener('error', () => {
            reject(new Error('网络请求失败'));
        });

        // 发送请求
        xhr.open('POST', uploadUrl);
        // 添加请求头
        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
        xhr.withCredentials = true; // 允许跨域请求携带凭证
        xhr.send(formData);
    });
}

export function isImage(file) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',];//去除svg，因为接口不支持直接传svg
    // 从文件名提取扩展名并转为小写
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // 检查是否为图片类型
    return imageExtensions.includes(extension);
}