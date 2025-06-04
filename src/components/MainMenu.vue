<template>
  <div class="main-menu">
    <div class="file-manager">
      <h1 class="cyber-title">
        <a href="https://github.com/WJZ-P/Bilibili-File" target="_blank" rel="noopener noreferrer" class="title-link"
          @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
          <span class="gradient-text">
            <template v-if="!isHovered">Bilibili File ( ｡・▽・｡ )ﾉ</template>
            <template v-else>Bilibili File (*ﾉωﾉ)</template>
          </span>
          <span class="glow"></span>
        </a>
      </h1>
      <!-- 头部操作区 -->
      <div class="action-bar">
        <div class="upload-area" @click="handleUpload">
          <i class="iconfont icon-upload"></i>
          <span>点击上传文件</span>
          <!--          这里要放一个隐藏的input元素，用来触发事件-->
          <input type="file" ref="fileInputEl" multiple style="display: none" @change="handleFileSelect">
        </div>
        <div class="share-link-area">
          <input type="text" v-model="shareLink" placeholder="粘贴分享链接..." @keyup.enter="handleShareLinkDownload">
          <button class="download-btn" @click="handleShareLinkDownload">
            <i class="iconfont icon-download">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                fill="#5f6368">
                <path
                  d="M480-328.46 309.23-499.23l42.16-43.38L450-444v-336h60v336l98.61-98.61 42.16 43.38L480-328.46ZM252.31-180Q222-180 201-201q-21-21-21-51.31v-108.46h60v108.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-108.46h60v108.46Q780-222 759-201q-21 21-51.31 21H252.31Z" />
              </svg>
            </i>
          </button>
        </div>
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索文件..." @input="handleSearch">
          <i class="iconfont icon-search">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
              <path
                d="M781.69-136.92 530.46-388.16q-30 24.77-69 38.77-39 14-80.69 14-102.55 0-173.58-71.01-71.03-71.01-71.03-173.54 0-102.52 71.01-173.6 71.01-71.07 173.54-71.07 102.52 0 173.6 71.03 71.07 71.03 71.07 173.58 0 42.85-14.38 81.85-14.39 39-38.39 67.84l251.23 251.23-42.15 42.16ZM380.77-395.38q77.31 0 130.96-53.66 53.66-53.65 53.66-130.96t-53.66-130.96q-53.65-53.66-130.96-53.66t-130.96 53.66Q196.15-657.31 196.15-580t53.66 130.96q53.65 53.66 130.96 53.66Z" />
            </svg>
          </i>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
        <table class="file-table">
          <!-- 表头 -->
          <thead>
            <tr>
              <th class="col-name">文件名</th>
              <th class="col-size">大小</th>
              <th class="col-date">上传日期</th>
              <th class="col-actions">操作</th>
            </tr>
          </thead>

          <!-- 动态文件项 -->
          <tbody>
            <tr v-for="file in filteredFiles" :key="file.name + file.size" class="file-row">
              <td class="col-name" @click="copyFileLink(file, $event)" :title="'点击复制下载链接'">
                <div class="file-name-cell">
                  <i v-if="isImage(file)" class="iconfont icon-file">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#5f6368">
                      <path
                        d="M212.31-140Q182-140 161-161q-21-21-21-51.31v-535.38Q140-778 161-799q21-21 51.31-21h535.38Q778-820 799-799q21 21 21 51.31v535.38Q820-182 799-161q-21 21-51.31 21H212.31Zm0-60h535.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-535.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H212.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v535.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM270-290h423.07L561.54-465.38 449.23-319.23l-80-102.31L270-290Zm-70 90v-560 560Z" />
                    </svg>
                  </i>
                  <i v-else-if="isCompressed(file)" class="iconfont icon-file">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#5f6368">
                      <path
                        d="M640-480v-80h80v80h-80Zm0 80h-80v-80h80v80Zm0 80v-80h80v80h-80ZM447.38-640l-80-80H172.31q-5.39 0-8.85 3.46t-3.46 8.85v455.38q0 5.39 3.46 8.85t8.85 3.46H560v-80h80v80h147.69q5.39 0 8.85-3.46t3.46-8.85v-375.38q0-5.39-3.46-8.85t-8.85-3.46H640v80h-80v-80H447.38ZM172.31-180Q142-180 121-201q-21-21-21-51.31v-455.38Q100-738 121-759q21-21 51.31-21h219.61l80 80h315.77Q818-700 839-679q21 21 21 51.31v375.38Q860-222 839-201q-21 21-51.31 21H172.31ZM160-240v-480 480Z" />
                    </svg>
                  </i>
                  <i v-else class="iconfont icon-file">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                      fill="#5f6368">
                      <path
                        d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z" />
                    </svg>
                  </i>
                  <span class="file-name">{{ file.name }}</span>
                </div>
              </td>
              <td class="col-size">{{ formatSize(file.size) }}</td>
              <td class="col-date">{{ formatDate(file.lastModified) }}</td>
              <td class="col-actions">
                <div class="action-buttons">
                  <button v-if="isImage(file)" class="btn-preview" @click.stop="handlePreview(file)">
                    <i class="iconfont icon-preview">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="#5f6368">
                        <path
                          d="M480.09-336.92q67.99 0 115.49-47.59t47.5-115.58q0-67.99-47.59-115.49t-115.58-47.5q-67.99 0-115.49 47.59t-47.5 115.58q0 67.99 47.59 115.49t115.58 47.5ZM480-392q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm.05 172q-137.97 0-251.43-76.12Q115.16-372.23 61.54-500q53.62-127.77 167.02-203.88Q341.97-780 479.95-780q137.97 0 251.43 76.12Q844.84-627.77 898.46-500q-53.62 127.77-167.02 203.88Q618.03-220 480.05-220ZM480-500Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                      </svg>
                    </i>
                    <span>预览</span>
                  </button>
                  <button v-if="file.status === 'success'" class="btn-download" @click.stop="handleDownload(file)">
                    <i class="iconfont icon-download">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="#5f6368">
                        <path
                          d="M480-328.46 309.23-499.23l42.16-43.38L450-444v-336h60v336l98.61-98.61 42.16 43.38L480-328.46ZM252.31-180Q222-180 201-201q-21-21-21-51.31v-108.46h60v108.46q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-108.46h60v108.46Q780-222 759-201q-21 21-51.31 21H252.31Z" />
                      </svg>
                    </i>
                    <span>下载</span>
                  </button>
                  <button class="btn-delete" @click.stop="handleDelete(file)">
                    <i class="iconfont icon-delete">
                      <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px"
                        fill="#5f6368">
                        <path
                          d="M292.31-140q-29.92 0-51.12-21.19Q220-182.39 220-212.31V-720h-40v-60h180v-35.38h240V-780h180v60h-40v507.69Q740-182 719-161q-21 21-51.31 21H292.31ZM680-720H280v507.69q0 5.39 3.46 8.85t8.85 3.46h375.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-720ZM376.16-280h59.99v-360h-59.99v360Zm147.69 0h59.99v-360h-59.99v360ZM280-720v520-520Z" />
                      </svg>
                    </i>
                    <span>删除</span>
                  </button>
                </div>
              </td>
              <div v-if="file.status === 'uploading'" class="progress-bar">
                <div class="progress-inner" :style="{ width: `${fileProgress[file.name] || 0}%` }"></div>
              </div>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
    <div class="footer-info">
      © 2025 <a href="https://github.com/WJZ-P/Bilibili-File" target="_blank" title="GitHub地址">Bilibili File</a>.
      Made by WJZ_P with love. （￣▽￣）
    </div>
  </div>

  <!-- 查看图片的模态框 -->
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="showViewModel" class="preview-modal" @click.self="closePreview">
        <div class="modal-container">
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="closePreview">
            <i class="iconfont icon-close">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#5f6368">
                <path
                  d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z" />
              </svg>
            </i>
          </button>

          <!-- 图片预览区 -->
          <div class="image-wrapper">
            <img :src="previewImg.url" :alt="previewImg.name" @load="handleImageLoad" @error="handleImageError">
            <div v-if="loading" class="loading-indicator">
              <div class="spinner"></div>
              <span>加载中...</span>
            </div>
            <!--            <div v-if="loadError" class="error-message">-->
            <!--              图片加载失败 😢-->
            <!--            </div>-->
          </div>

          <!-- 底部文件名 -->
          <div class="file-info">
            {{ previewImg.name }}
          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- 添加Toast提示组件 -->
  <teleport to="body">
    <transition name="toast-fade">
      <div v-if="showToast" class="copy-toast" :style="toastStyle">
        {{ toastMessage }}
      </div>
    </transition>
  </teleport>
</template>

<script setup>
// 后续可在这里添加逻辑
import { computed, onMounted, ref } from 'vue'
import { upload } from "../utils/upload.js";
import { loadFiles, saveFiles } from "../utils/save.js";

const fileInputEl = ref(null);//上传文件元素
const isHovered = ref(false);//鼠标是否悬浮在标题上
const files = ref([]);
//下面是模态需要用到的信息
const previewImg = ref(null)//预览的图片信息，
const loading = ref(false)
const loadError = ref(false)
const showViewModel = ref(false)//是否展示模态框

const searchQuery = ref('')//查询

const sliceIndex = 35//切割文件的下标

//加载界面的时候需要从localStorage拿保存好的数据
onMounted(() => {
  files.value = loadFiles()
})

const filteredFiles = computed(() => {
  if (!searchQuery.value.trim()) return files.value

  const query = searchQuery.value.trim().toLowerCase()

  return files.value.filter(file => {
    // 多字段匹配：文件名、大小、日期
    return file.name.toLowerCase().includes(query)
  })
})

const handleUpload = () => fileInputEl.value.click();

// 添加文件进度状态
const fileProgress = ref({});

// 添加分享链接相关的状态
const shareLink = ref('');

// 修改文件上传处理函数
const handleFileSelect = async (event) => {
  console.log("下面打印出传入的文件参数")
  console.log(event.target.files)

  // 先创建所有文件对象并添加到列表中
  const filePromises = Array.from(event.target.files).map(file => {
    const resultFile = {
      name: file.name,
      size: file.size,
      url: '',
      lastModified: Date.now(),
      status: 'uploading'
    }
    files.value.push(resultFile)
    fileProgress.value[file.name] = 0
    return { file, resultFile }
  })

  // 并行上传所有文件
  try {
    const uploadPromises = filePromises.map(({ file, resultFile }) =>
    //这里upload函数内部自动区分大文件和小文件，所以这里不需要做判断
      upload(file, (progress) => {
        fileProgress.value[file.name] = progress
      }).then(
        result => {
          resultFile.url = result.data.location.replace(/^http:\/\//i, 'https://')
          resultFile.status = 'success'
          // 立即移除进度条，不需要延迟
          delete fileProgress.value[file.name]
        }).catch(error => {
          console.error(`文件 ${file.name} 上传失败:`, error)
          resultFile.status = 'error'
          delete fileProgress.value[file.name]
          showToastMessage(`文件 ${file.name} 上传失败，请重试`, {
            clientX: window.innerWidth / 2,
            clientY: 100
          })
        })
    )

    // 等待所有上传完成
    await Promise.all(uploadPromises)

    // 持久化到localStorage
    saveFiles(files.value)
  } catch (error) {
    console.error('批量上传过程中发生错误:', error)
    showToastMessage('上传过程中发生错误，请重试', {
      clientX: window.innerWidth / 2,
      clientY: 100
    })
  }
}

// 日期格式化
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD格式
};

// 格式化文件大小
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

// 下载处理函数
const handleDownload = async (file) => {
  try {
    // 初始化进度
    fileProgress.value[file.name] = 0;

    // 1. 通过 fetch 获取文件
    const response = await fetch(file.url);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    let chunks = [];

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      chunks.push(value);
      receivedLength += value.length;

      // 更新进度
      fileProgress.value[file.name] = Math.round((receivedLength / contentLength) * 100);
    }

    // 合并数据块
    let blob = new Blob(chunks);
    if (!isImage(file)) blob = blob.slice(sliceIndex);

    // 2. 创建对象 URL 并强制下载
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();

    // 3. 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 下载完成后延迟移除进度条
    setTimeout(() => {
      delete fileProgress.value[file.name];
    }, 1000);
  } catch (error) {
    console.error('下载失败:', error);
    showToastMessage('下载失败，请重试', { clientX: window.innerWidth / 2, clientY: 100 });
    delete fileProgress.value[file.name];
  }
};

// 处理删除
const handleDelete = (file) => {
  files.value = files.value.filter(
    f => !(f.name === file.name && f.size === file.size)
  );
  console.log("删除后的总文件列表")
  console.log(files.value)
  saveFiles(files.value)
};

const handlePreview = (file) => {
  showViewModel.value = true
  previewImg.value = file
};

const closePreview = () => {
  showViewModel.value = false
  previewImg.value = null
}

// 图片加载处理
const handleImageLoad = () => {
  loading.value = false
}
const handleImageError = () => {
  loading.value = false
  loadError.value = true
}

//判断文件是否是图片
function isImage(file) {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp',];
  // 从文件名提取扩展名并转为小写
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 检查是否为图片类型
  return imageExtensions.includes(extension);
}

//判断是否是压缩包
function isCompressed(file) {
  // 常见压缩包扩展名列表（可根据需求扩展）
  const compressedExtensions = [
    'zip', 'rar', '7z',
    'tar', 'gz', 'bz2',
    'xz', 'dmg', 'iso',
    'cab', 'arj', 'z',
    'lz', 'lzma', 'tgz'
  ];

  // 从文件名提取扩展名并转为小写
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 检查是否为压缩包类型
  return compressedExtensions.includes(extension);
}

const handleMouseEnter = () => isHovered.value = true
const handleMouseLeave = () => isHovered.value = false

// Toast相关的响应式状态
const showToast = ref(false);
const toastMessage = ref('');
const toastPosition = ref({ x: 0, y: 0 });

// 计算Toast样式
const toastStyle = computed(() => ({
  left: `${toastPosition.value.x}px`,
  top: `${toastPosition.value.y}px`
}));

// 显示Toast的方法
const showToastMessage = (message, event) => {
  toastMessage.value = message;

  // 计算位置
  const x = event.clientX;
  const y = event.clientY - 40; // 在鼠标上方显示

  // 确保不超出视口
  const maxX = window.innerWidth - 200; // 假设Toast最大宽度为200px
  const maxY = window.innerHeight - 50; // 假设Toast高度为50px

  toastPosition.value = {
    x: Math.min(Math.max(x + 100, 0), maxX), // 水平居中
    y: Math.min(Math.max(y, 0), maxY)
  };

  showToast.value = true;

  // 延迟后隐藏
  setTimeout(() => {
    showToast.value = false;
  }, 1000);
};

// 修改复制链接的方法
const copyFileLink = async (file, event) => {
  try {
    await navigator.clipboard.writeText(file.url);
    showToastMessage('链接已复制到剪贴板', event);
  } catch (err) {
    console.error('复制失败:', err);
    showToastMessage('复制失败，请重试', event);
  }
};

// 分享链接下载函数
const handleShareLinkDownload = async () => {
  if (!shareLink.value.trim()) {
    showToastMessage('请输入分享链接', { clientX: window.innerWidth / 2, clientY: 100 });
    return;
  }

  try {
    // 验证链接格式
    if (!shareLink.value.startsWith('https://')) {
      showToastMessage('请输入有效的链接', { clientX: window.innerWidth / 2, clientY: 100 });
      return;
    }

    // 获取文件名
    const fileName = shareLink.value.split('/').pop() || 'downloaded_file';

    // 初始化进度
    fileProgress.value[fileName] = 0;

    // 下载文件
    const response = await fetch(shareLink.value);
    const reader = response.body.getReader();
    const contentLength = +response.headers.get('Content-Length');

    let receivedLength = 0;
    let chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      // 更新进度
      fileProgress.value[fileName] = Math.round((receivedLength / contentLength) * 100);
    }

    // 合并数据块
    const blob = new Blob(chunks);

    // 创建下载链接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // 清空输入框
    shareLink.value = '';

    // 下载完成后延迟移除进度条
    setTimeout(() => {
      delete fileProgress.value[fileName];
    }, 1000);

    showToastMessage('文件下载成功', { clientX: window.innerWidth / 2, clientY: 100 });
  } catch (error) {
    console.error('下载失败:', error);
    showToastMessage('下载失败，请检查链接是否正确', { clientX: window.innerWidth / 2, clientY: 100 });
    delete fileProgress.value[fileName];
  }
};

</script>

<style scoped>
.cyber-title {
  position: relative;
  text-align: center;
  margin: 2rem 0;
  perspective: 1000px;
  width: fit-content;
  display: flex;
  /* 新增 */
  justify-content: center;
  /* 新增 */
}

.gradient-text {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(90deg,
      #00aeec 0%,
      #7be7ff 25%,
      #00aeec 50%,
      #7be7ff 75%,
      #00aeec 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 4s linear infinite;
  display: inline-block;
  transform: translateZ(0);
  transition: transform 0.3s;
  width: fit-content;
  /* 新增 */
}

.glow {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 100%;
  background: radial-gradient(circle at 50% 50%,
      rgba(0, 174, 236, 0.4) 0%,
      transparent 70%);
  filter: blur(30px);
  z-index: -1;
}

@keyframes gradient {
  0% {
    background-position: 0% center;
  }

  100% {
    background-position: -200% center;
  }
}

/* 鼠标悬浮效果 */
.cyber-title:hover .gradient-text {
  transform: scale(1.05) rotateX(10deg) rotateY(-5deg);
  text-shadow: 0 10px 20px rgba(0, 174, 236, 0.4);
}

.main-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.file-manager {
  display: flex;
  flex-direction: column;
  width: 95%;
  margin: 20px auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: calc(100vh - 150px);
  /* 设置固定高度，减去其他元素的高度 */
  justify-content: flex-start;
  align-items: center;
  box-sizing: border-box;
}

/* 操作栏 */
.action-bar {
  width: 100%;
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  justify-content: center;
  align-items: center;
}

.upload-area {
  flex: 1;
  border: 2px dashed #00aeec;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #f5fbff;
    border-color: #0099cc;
  }
}

.share-link-area {
  flex: 1;
  display: flex;
  gap: 10px;
  align-items: center;
  background: #fff;
  border: 2px solid #00aeec;
  border-radius: 8px;
  padding: 0 15px;
  transition: all 0.3s;

  &:hover {
    border-color: #0099cc;
    box-shadow: 0 2px 8px rgba(0, 174, 236, 0.12);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 0;
    font-size: 14px;
    color: #18191c;
    background: transparent;

    &::placeholder {
      color: #9499a0;
    }
  }

  .download-btn {
    background: none;
    border: none;
    padding: 8px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: rgba(0, 174, 236, 0.1);
      transform: scale(1.05);
    }

    .iconfont {
      color: #00aeec;
      font-size: 20px;
    }
  }
}

.search-box {
  width: 320px;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  height: 45px;

  input {
    width: 100%;
    padding: 14px 48px 14px 24px;
    border: 2px solid #00aeec;
    border-radius: 40px;
    background: rgba(245, 251, 255, 0.8);
    font-size: 14px;
    color: #18191c;
    transition: all 0.3s;

    &::placeholder {
      color: #9499a0;
      font-weight: 400;
    }

    &:hover {
      border-color: #0099cc;
      box-shadow: 0 2px 8px rgba(0, 174, 236, 0.12);
    }

    &:focus {
      outline: none;
      border-color: #0088b7;
      box-shadow: 0 4px 16px rgba(0, 174, 236, 0.16);
      background: #fff;
    }
  }

  .iconfont {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #00aeec;
    font-size: 20px;
    transition: all 0.3s;
  }

  &:hover .iconfont {
    color: #0099cc;
    transform: translateY(-50%) scale(1.1);
  }

  input:focus~.iconfont {
    color: #0088b7;
    animation: searchPulse 1.5s infinite;
  }
}

@keyframes searchPulse {

  0%,
  100% {
    transform: translateY(-50%) scale(1);
  }

  50% {
    transform: translateY(-50%) scale(1.15);
  }
}

/* 文件列表 */
.file-list {
  width: 100%;
  overflow-y: auto;
  /* 允许垂直滚动 */
  flex: 1;
  /* 占据剩余空间 */
  position: relative;
  /* 为进度条定位提供参考 */
}

.file-table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}

.file-table th,
.file-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

/* 设置各列的宽度 */
.file-table .col-name {
  width: 45%;
}

.file-table .col-size {
  width: 15%;
}

.file-table .col-date {
  width: 20%;
}

.file-table .col-actions {
  width: 20%;
}

.file-table th {
  color: #666;
  font-weight: 500;
  background: #fafafa;
}

.file-row {
  position: relative;
  transition: background 0.2s;
}

.file-row:hover {
  background: #f9f9f9;
}

.file-name-cell {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: color 0.2s;
  text-align: left;
  padding-bottom: 4px;
}

.file-name-cell:hover {
  color: #00aeec;
}

.file-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.col-actions button {
  background: #00c1ff;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.2s;
  width: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;

  .iconfont {
    color: white;
    font-size: 18px;
  }

  span {
    color: white;
    font-weight: 400;
    font-size: 14px;
  }

  &:hover {
    background: #66ccff;
    transform: translateY(-2px);
    box-shadow: 0 3px 12px rgba(0, 174, 236, 0.3);
  }

  &.btn-delete {
    background: rgba(245, 75, 76, 0.86);

    &:hover {
      background: #ff6668;
      box-shadow: 0 3px 12px rgba(255, 77, 79, 0.3);
    }
  }

  &.btn-preview {
    background: rgba(0, 255, 67, 0.56);

    &:hover {
      background: rgba(0, 255, 67, 0.76);
      box-shadow: 0 3px 12px rgba(0, 255, 67, 0.3);
    }
  }
}

/* 进度条样式 */
.progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: rgba(0, 174, 236, 0.1);
  overflow: hidden;
  border-radius: 1px;
  z-index: 1;
}

.progress-inner {
  height: 100%;
  background: #00aeec;
  transition: width 0.3s ease;
  border-radius: 1px;
}

/* 图标字体 */
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/c/font_123456_xxxxxx.css');
}

/*下面是模态框设置 */

/* 模态框入场动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.preview-modal {
  position: fixed;
  inset: 0;
  background: rgba(229, 232, 232, 0.2);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(102, 204, 255, 0.35);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 1;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.icon-close {
  color: white;
  font-size: 24px;
}

.image-wrapper {
  position: relative;
  width: 80vw;
  max-width: 2000px;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.image-wrapper img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-top-color: #00aeec;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ff4d4f;
  font-size: 1.2em;
}

.file-info {

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(102, 204, 255, 0.76));
  color: #1e1d1d;
  padding: 15px;
  text-align: center;
  font-size: 1.0em;
  backdrop-filter: blur(1px);
}

.footer-info {
  width: 90%;
  text-align: center;
  color: #777;
  font-size: 1em;
  border-top: 1px solid #eee;


  a {
    color: #66ccff;
  }
}

/* Toast提示样式 */
.copy-toast {
  position: fixed;
  background: rgba(0, 174, 236, 0.85);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 174, 236, 0.3);
  z-index: 100;
  font-size: 14px;
  font-weight: 500;
  pointer-events: none;
  white-space: nowrap;
  transform: translateX(-50%);
}

/* Toast动画 */
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

.col-name {
  position: relative;
  cursor: pointer;
  transition: color 0.2s;
}

.col-name:hover {
  color: #00aeec;
}

/* 美化滚动条 */
.file-list::-webkit-scrollbar {
  width: 8px;
}

.file-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.file-list::-webkit-scrollbar-thumb {
  background: #66ccff;
  border-radius: 4px;
}

.file-list::-webkit-scrollbar-thumb:hover {
  background: #0099cc;
}

/* 确保表头固定 */
.file-table thead {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 2;
}

.file-table th {
  position: sticky;
  top: 0;
  background: #fafafa;
  z-index: 2;
}
</style>