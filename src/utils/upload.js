const uploadUrl = "https://api.bilibili.com/x/article/creative/article/upcover?w_rid=578224db7224b0cab6f62c9abbe7aee2&wts=";
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
    if (!file || !credentials?.bili_jct || !credentials?.cookie) {
        throw new Error('缺少必要参数：file/csrf/cookie');
    }

    // 构建FormData
    const formData = new FormData();
    const filename = file.name ||
        `bili_upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

    formData.append("binary", file, filename);//这里应该是二进制数据
    formData.append("filename", filename);
    formData.append("csrf", credentials.bili_jct);

    // 配置请求头
    const headers = new Headers({
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
        "origin": "https://member.bilibili.com",
        //"priority": "u=1, i",
        "referer": "https://member.bilibili.com/",
        "sec-ch-ua": "\"Microsoft Edge\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0",
        //"Cookie": credentials.cookie
    });

    try {
        const response = await fetch(uploadUrl+"w_rid", {
            method: "POST",
            headers,
            body: formData,
            redirect: "follow",
            credentials:"include",
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