<!-- FileButton.vue -->
<template>
   <div
    ref="dragContainer"
    class="file-button-container"
    :style="containerStyle"
  >
    <button
      class="floating-button"
      @click="toggleContent"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      :style="buttonStyle"
    >
      <slot name="icon">
        <!-- 默认图标 -->
        <svg class="icon" :class="{ 'icon-hover': isHovered }" viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
          <path d="M14 2v6h6M12 18v-6M9 15h6"/>
        </svg>
      </slot>
    </button>

    <transition name="fade-slide">
      <div v-if="showContent" class="content-wrapper">
        <div class="content-arrow"></div>
        <div class="content-body">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 新增拖拽相关逻辑
const dragContainer = ref(null)
const isDragging = ref(false)
const pos = ref({ x: 20, y: 20 }) // 默认位置
const dragStartPos = ref({ x: 0, y: 0 })

// 容器样式
const containerStyle = computed(() => ({
  left: `${pos.value.x}px`,
  top: `${pos.value.y}px`,
  zIndex: 9999,
  cursor: isDragging.value ? 'grabbing' : 'grab'
}))

// 拖拽事件处理
const startDrag = (e) => {
  isDragging.value = true
  dragStartPos.value = {
    x: e.clientX - pos.value.x,
    y: e.clientY - pos.value.y
  }
  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

const drag = (e) => {
  if (!isDragging.value) return

  // 计算新位置
  let newX = e.clientX - dragStartPos.value.x
  let newY = e.clientY - dragStartPos.value.y

  // 边界限制
  const containerWidth = dragContainer.value?.offsetWidth || 0
  const containerHeight = dragContainer.value?.offsetHeight || 0
  newX = Math.max(0, Math.min(newX, window.innerWidth - containerWidth))
  newY = Math.max(0, Math.min(newY, window.innerHeight - containerHeight))

  pos.value = { x: newX, y: newY }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
  // 可选：保存位置到 localStorage
}

onMounted(() => {
  // 初始化拖拽
  dragContainer.value.addEventListener('mousedown', startDrag)

  // 恢复保存的位置
  const savedPos = localStorage.getItem('fileButtonPos')
  if (savedPos) {
    pos.value = JSON.parse(savedPos)
  }
})
</script>

<style scoped>
.file-button-container {
  position: fixed;
  z-index: 9999;
}

.top-left { top: 20px; left: 20px; }
.top-center { top: 20px; left: 50%; transform: translateX(-50%); }
.top-right { top: 20px; right: 20px; }
.bottom-left { bottom: 20px; left: 20px; }
.bottom-center { bottom: 20px; left: 50%; transform: translateX(-50%); }
.bottom-right { bottom: 20px; right: 20px; }

.floating-button {
  background: var(--button-color);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-button:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}

.icon {
  width: 24px;
  height: 24px;
  fill: white;
  transition: transform 0.3s ease;
}

.icon-hover {
  transform: rotate(15deg);
}

.content-wrapper {
  position: absolute;
  margin-top: 10px;
  min-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.content-arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  top: -6px;
  left: 20px;
}

.content-body {
  position: relative;
  padding: 16px;
  border-radius: 8px;
  background: white;
  z-index: 1;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>