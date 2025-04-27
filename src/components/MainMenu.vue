<script setup>
// 后续可在这里添加逻辑
import {ref} from 'vue'

const isHovered = ref(false);

const handleMouseEnter = () => isHovered.value = true
const handleMouseLeave = () => isHovered.value = false

</script>

<template>
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
        </div>
        <div class="search-box">
          <input type="text" placeholder="🔍搜索文件...">
          <i class="iconfont icon-search"></i>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="file-list">
        <div class="list-header">
          <div class="col-name">文件名</div>
          <div class="col-size">大小</div>
          <div class="col-date">修改日期</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="list-item" v-for="item in 5" :key="item">
          <div class="col-name">
            <i class="iconfont icon-file"></i>
            示例文件_{{ item }}.zip
          </div>
          <div class="col-size">2.3MB</div>
          <div class="col-date">2023-12-15</div>
          <div class="col-actions">
            <button class="btn-download">
              <i class="iconfont icon-download"></i>
            </button>
            <button class="btn-delete">
              <i class="iconfont icon-delete"></i>
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
</template>

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
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.15); }
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

  button {
    border: none;
    background: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;

    &:hover {
      background: #f5f5f5;
    }

    .iconfont {
      font-size: 18px;
    }
  }

  .btn-download .iconfont {
    color: #00aeec;
  }

  .btn-delete .iconfont {
    color: #ff4d4f;
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
</style>