<!-- FloatingUI.vue -->
<template>
  <div v-if="isVisible" ref="floatContainer" class="global-float-container">
    <div class="float-window" ref="windowRef">
      <div class="window-header" @mousedown="startDrag">
        <span class="title">Vite + Vue</span>
        <button class="close-btn" @click="toggleVisibility">×</button>
      </div>
      <div class="window-content">
        <div class="logo-container">
          <a href="https://vitejs.dev" target="_blank" class="logo-link">
            <img :src="viteLogoUrl" class="logo" alt="Vite logo">
          </a>
          <a href="https://vuejs.org/" target="_blank" class="logo-link">
            <img :src="vueLogoUrl" class="logo vue-logo" alt="Vue logo">
          </a>
        </div>
        <div class="message">全局浮动界面（Vue版）</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const floatContainer = ref(null)
const windowRef = ref(null)
const isVisible = ref(true)
const isDragging = ref(false)
const offsetX = ref(0)
const offsetY = ref(0)

// 图片URL（建议改为base64或动态加载）
const viteLogoUrl = 'https://vitejs.dev/logo.svg'
const vueLogoUrl = 'https://vuejs.org/images/logo.png'

// 拖拽相关方法
const startDrag = (e) => {
  isDragging.value = true
  const rect = windowRef.value.getBoundingClientRect()
  offsetX.value = e.clientX - rect.left
  offsetY.value = e.clientY - rect.top
}

const drag = (e) => {
  if (!isDragging.value) return
  const container = windowRef.value
  const x = e.clientX - offsetX.value
  const y = e.clientY - offsetY.value

  // 边界限制
  const maxX = window.innerWidth - container.offsetWidth
  const maxY = window.innerHeight - container.offsetHeight

  container.style.left = `${Math.min(Math.max(x, 0), maxX)}px`
  container.style.top = `${Math.min(Math.max(y, 0), maxY)}px`
}

const stopDrag = () => {
  isDragging.value = false
}

// 显示/隐藏切换
const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.global-float-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 999999;
}

.float-window {
  position: absolute;
  width: 400px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  animation: slide-in 0.3s ease-out;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%);
}

.window-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: move;
  user-select: none;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
}

.title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #ff4d4f;
}

.window-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
}

.logo-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.logo {
  width: 50px;
  height: 50px;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.1);
}

.vue-logo {
  filter: invert(0) sepia(1) saturate(5) hue-rotate(200deg);
}

.message {
  color: #666;
  font-size: 14px;
  text-align: center;
}

@keyframes slide-in {
  from { transform: translate(-50%, -100px); opacity: 0; }
  to { transform: translate(-50%, -50%); opacity: 1; }
}
</style>