<template>
  <link
      rel="stylesheet"
      href="https://at.alicdn.com/t/c/font_1234567_abcdefghijk.css"
  >
  <div class="main-menu">
    <div class="file-manager">
      <h1 class="cyber-title">
        <a
            href="https://github.com/WJZ-P/Bilibili-File"
            target="_blank"
            rel="noopener noreferrer"
            class="title-link"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
        >
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
          <span>点击上传 / 拖放文件</span>
          <!--          这里要放一个隐藏的input元素，用来触发事件-->
          <input
              type="file"
              ref="fileInputEl"
              multiple
              style="display: none"
              @change="handleFileSelect"
          >
        </div>
        <div class="search-box">
          <input type="text" placeholder="🔍搜索文件...">
          <i class="iconfont icon-search"></i>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
        <!-- 表头 -->
        <div class="list-header">
          <div class="col-name">文件名</div>
          <div class="col-size" style="text-align: center">大小</div>
          <div class="col-date" style="text-align: center">上传日期</div>
          <div class="col-actions" style="text-align: center">操作</div>
        </div>

        <!-- 动态文件项 -->
        <div
            class="list-item"
            v-for="file in files"
            :key="file.name + file.size"
        >
          <div class="col-name" style="text-align: center">
            <i class="iconfont icon-file">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                   fill="#5f6368">
                <path
                    d="M330-250h300v-60H330v60Zm0-160h300v-60H330v60Zm-77.69 310Q222-100 201-121q-21-21-21-51.31v-615.38Q180-818 201-839q21-21 51.31-21H570l210 210v477.69Q780-142 759-121q-21 21-51.31 21H252.31ZM540-620v-180H252.31q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v615.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46V-620H540ZM240-800v180-180V-160v-640Z"/>
              </svg>
            </i>
            {{ file.name }}
          </div>
          <div class="col-size" style="text-align: center">{{ formatSize(file.size) }}</div>
          <div class="col-date" style="text-align: center">{{ formatDate(file.lastModified) }}</div>
          <div class="col-actions">
            <button
                v-if="isImage(file)"
                class="btn-preview"
                @click.stop="handlePreview(file)"
            >
              <i class="iconfont icon-preview"></i>
              <span>查看</span>
            </button>
            <button
                class="btn-download"
                @click.stop="handleDownload(file)"
            >
              <i class="iconfont icon-download"></i>
              <span>下载</span>
            </button>
            <button
                class="btn-delete"
                @click.stop="handleDelete(file)"
            >
              <i class="iconfont icon-delete"></i>
              <span>删除</span>
            </button>
          </div>
        </div>
      </div>


      <!-- 底部统计 -->
      <div class="status-bar" style="width: 100%">
        <div class="storage-info">
          <span>已用空间：3.2GB / 10GB</span>
          <div class="storage-progress">
            <div class="progress-inner" :style="{width: '32%'}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 查看图片的模态框 -->
  <teleport to="body">
    <transition name="modal-fade">
      <div
          v-if="showPreviewModal"
          class="preview-modal"
          @click.self="closePreview"
      >
        <div class="modal-container">
          <!-- 关闭按钮 -->
          <button class="close-btn" @click="closePreview">
            <i class="iconfont icon-close"></i>
          </button>

          <!-- 图片预览区 -->
          <div class="image-wrapper">
            <img
                :src="previewImg.url"
                :alt="previewImg.name"
                @load="handleImageLoad"
                @error="handleImageError"
            >
            <div v-if="loading" class="loading-indicator">
              <div class="spinner"></div>
              <span>加载中...</span>
            </div>
            <div v-if="loadError" class="error-message">
              图片加载失败 😢
            </div>
          </div>

          <!-- 底部文件名 -->
          <div class="file-info">
            {{ previewImg.name }}
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
// 后续可在这里添加逻辑
import {onMounted, ref} from 'vue'
import {uploadFile} from "../utils/upload.js";
import {loadFiles, saveFiles} from "../utils/save.js";

const fileInputEl = ref(null);//上传文件元素
const isHovered = ref(false);//鼠标是否悬浮在标题上
const files = ref([]);
//下面是模态需要用到的信息
const previewImg = ref(null)//预览的图片信息，
const loading = ref(false)
const loadError = ref(false)
const showViewModel = ref(false)//是否展示模态框

//加载界面的时候需要从localStorage拿保存好的数据
onMounted(() => {
  files.value = loadFiles()
})

const handleUpload = () => fileInputEl.value.click();


// 处理文件上传
const handleFileSelect = async (event) => {
  console.log("下面打印出传入的文件参数")
  console.log(event.target.files)

  //加上文件上传
  for (let file of event.target.files) {
    const result = await uploadFile(file)
    console.log(result)
    const resultFile = {}
    resultFile.name = file.name
    resultFile.size = file.size
    resultFile.url = result.data.url
    resultFile.lastModified = Date.now()
    files.value.push(resultFile)//单个资源上传
  }
  //持久化到localStorage
  saveFiles(files.value)

  // 简单反馈
  // if (newFiles.length) {
  //   alert(`成功添加 ${newFiles.length} 个文件`);
  // } else {
  //   alert('没有新文件被添加');
  // }
};

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

// 处理下载
const handleDownload = async (file) => {
  try {
    // 1. 通过 fetch 获取文件
    const response = await fetch(file.url.replace(/^http:\/\//i, 'https://'));
    const blob = await response.blob();

    // 2. 创建对象 URL 并强制下载
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name; // 必须设置文件名

    // 3. 必须将元素添加到 DOM 才能触发下载
    document.body.appendChild(a);
    a.click();

    // 4. 清理
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载失败:', error);
  }
};

// 处理删除
const handleDelete = (file) => {
  files.value = files.value.filter(
      f => !(f.name === file.name && f.size === file.size)
  );
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
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  // 从文件名提取扩展名并转为小写
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // 检查是否为图片类型
  return imageExtensions.includes(extension);
}

const handleMouseEnter = () => isHovered.value = true
const handleMouseLeave = () => isHovered.value = false

</script>

<style scoped>
.cyber-title {
  position: relative;
  text-align: center;
  margin: 2rem 0;
  perspective: 1000px;
  width: fit-content;
  display: flex; /* 新增 */
  justify-content: center; /* 新增 */
}

.gradient-text {
  font-size: 3.5rem;
  font-weight: 900;
  background: linear-gradient(
      90deg,
      #00aeec 0%,
      #7be7ff 25%,
      #00aeec 50%,
      #7be7ff 75%,
      #00aeec 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 4s linear infinite;
  display: inline-block;
  transform: translateZ(0);
  transition: transform 0.3s;
  width: fit-content; /* 新增 */
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
  justify-content: start;
  align-items: start;
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
  height: 100%;
  justify-content: center;
  align-items: center;
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

  input:focus ~ .iconfont {
    color: #0088b7;
    animation: searchPulse 1.5s infinite;
  }
}

@keyframes searchPulse {
  0%, 100% {
    transform: translateY(-50%) scale(1);
  }
  50% {
    transform: translateY(-50%) scale(1.15);
  }
}

/* 文件列表 */
.file-list {
  width: 100%;
}

.list-header {
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 1fr 1.5fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  color: #666;
  font-weight: 500;
}

.list-item {
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 1fr 1.5fr 1fr;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }

  .col-name {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #333;

    .iconfont {
      font-size: 20px;
      color: #00aeec;
    }
  }
}

.col-actions {
  display: flex;
  gap: 15px;
  justify-content: center;

  button {
    background: #00c1ff;
    border: none;
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    transition: 0.2s;
    width: 60px;

    .iconfont {
      color: white;
      font-size: 18px;
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
    }
  }
}


/* 存储进度条 */
.storage-progress {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;

  .progress-inner {
    height: 100%;
    background: #00aeec;
    transition: width 0.3s;
  }
}

/* 图标字体 */
@font-face {
  font-family: 'iconfont';
  src: url('//at.alicdn.com/t/c/font_123456_xxxxxx.css');
}

//下面是模态框设置

/* 模态框入场动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.preview-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(8px);
}

.modal-container {
  position: relative;
  background: #1a1a1a;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
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
  max-width: 1200px;
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
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
  to { transform: rotate(360deg); }
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
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
  text-align: center;
  font-size: 0.9em;
  backdrop-filter: blur(4px);
}
</style>