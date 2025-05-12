const SAVE_FILES_KEY = 'bili_files'

export function saveFiles(files) {
    //files是个数组
    try {
        localStorage.setItem(SAVE_FILES_KEY, JSON.stringify(files));
    } catch (error) {
        console.error("[Bilibili-File] 本地存储失败", error)

    }
}

export function loadFiles() {
    try {
        const data = localStorage.getItem(SAVE_FILES_KEY);
        return data ? JSON.parse(data) : []
    } catch (error) {
        console.log("存储读取失败", error)
        return []
    }
}