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
        file = new File([mergedBlob], file.name)
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

/**
 * 大文件分片上传函数
 * @param {File} file - 要上传的文件
 * @param {Function} onProgress - 进度回调函数
 * @param {number} chunkSize - 分片大小，默认15MB
 * @returns {Promise<Object>} - 返回上传结果
 */
export async function uploadLargeFile(file, onProgress, chunkSize = 20 * 1024 * 1024) {
    // 校验必要参数
    if (!file || !credentials?.bili_jct) {
        throw new Error('缺少必要参数：file/csrf');
    }

    // 计算总分片数
    const totalChunks = Math.ceil(file.size / chunkSize);
    let uploadedChunks = 0;
    let uploadedSize = 0;

    // 创建临时文件对象数组
    const chunks = [];
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
        chunks.push(chunk);
    }

    // 上传每个分片
    const uploadPromises = chunks.map(async (chunk, index) => {
        // 为每个分片创建临时文件
        const chunkFile = new File([chunk], `${file.name}.part${index}.jpg`, {
            type: 'image/jpeg' // 强制设置为图片类型
        });

        try {
            // 上传分片
            const result = await uploadFile(chunkFile, (progress) => {
                // 计算总体进度
                const chunkProgress = (progress / totalChunks);
                const totalProgress = Math.round((uploadedSize + (chunk.size * progress / 100)) / file.size * 100);
                onProgress(totalProgress);
            });

            uploadedChunks++;
            uploadedSize += chunk.size;

            return {
                index,
                url: result.data.location
            };
        } catch (error) {
            throw new Error(`分片 ${index + 1}/${totalChunks} 上传失败: ${error.message}`);
        }
    });

    try {
        // 并行上传所有分片
        const results = await Promise.all(uploadPromises); //results是数组

        // 按索引排序结果
        results.sort((a, b) => a.index - b.index);

        const fileInfo = {
            urls: results,
            finishUploadTime: Math.floor(Date.now() / 1000), // 秒级时间戳
            fileName: file.name,
            fileSize: Math.ceil(file.size / 1024), // KB
        }

        // 将 JSON 二进制化并添加魔术字节
        const magicBytes = new TextEncoder().encode('BILI_JSON_MAGIC');//增加魔术字节
        const jsonData = JSON.stringify(chunkInfo);
        const jsonBytes = new TextEncoder().encode(jsonData);
        const combinedData = new Blob([magicBytes, jsonBytes]);

        const blankImage = await fetch(pixelPath).then(res => res.blob());
        const mergedBlob = new Blob([blankImage, combinedData]);

        // 上传包含 JSON 的图片
        const jsonFile = new File([mergedBlob], `${file.name}.json.png`, { type: 'image/png' });
        const jsonUploadResult = await uploadFile(jsonFile);

        // result.data.location.replace(/^http:\/\//i, 'https://') 是下载地址

        

        // 返回所有分片的URL
        return {
            code: 0,
            data: {
                location: results.map(r => r.url),
                totalChunks,
                fileName: file.name,
                fileSize: file.size
            }
        };
    } catch (error) {
        throw new Error(`大文件上传失败: ${error.message}`);
    }
}
