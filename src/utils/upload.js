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
 *         @property {string} csrf - 从cookie中获取的bili_jct值
 *         @property {string} cookie - 完整的cookie字符串
 * @returns {Promise<Object>} - 返回B站API响应结果
 */
export async function uploadFile(file) {
    //console.log(credentials)
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


    try {
        const response = await fetch(uploadUrl, {
            method: "POST",
            headers,
            body: formData,
            redirect: "follow",
            credentials: "include",
        });

        const result = await response.json();
        // B站API通过code字段判断成功 (0表示成功)
        if (result.code !== 0)
            return new Error(`上传失败: ${result.message} (code: ${result.code})`);

        return result; // 返回整个result

    } catch (error) {
        console.error('上传请求异常:', error);
        throw new Error(`网络请求失败: ${error.message}`);
    }
}

export function isImage(file) {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',];//去除svg，因为接口不支持直接传svg
    // 从文件名提取扩展名并转为小写
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // 检查是否为图片类型
    return imageExtensions.includes(extension);
}