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
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
             class="zhuzhan-icon" color="#fb7299" :class="{ 'icon-hover': isHovered }">
          <path fill-rule="evenodd" clip-rule="evenodd"
                d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
                fill="currentColor"></path>
        </svg>
      </slot>
<!--      点击时候的涟漪效果-->
      <span v-if="showRipple" class="ripple-effect" :style="rippleStyle"></span>
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
import {ref, computed, onMounted} from 'vue'
// 新增特效相关响应式变量
const showRipple = ref(false)
const ripplePosition = ref({ x: 0, y: 0 })

// 新增需要的响应式变量
const showContent = ref(false)//为true的时候就是点击了按钮，要展开
const isHovered = ref(false)

// 新增拖拽相关逻辑
const dragContainer = ref(null)
const isDragging = ref(false)
const pos = ref({x: 20, y: 20}) // 默认位置
const dragStartPos = ref({x: 0, y: 0})

// 计算按钮样式（新增特效参数）
const buttonStyle = computed(() => ({
  transform: `
    scale(${isHovered.value ? 1.1 : 1})
    rotate(${isDragging.value ? '2deg' : '0'})
  `,
  opacity: isDragging.value ? 0.9 : 1,
  background: isHovered.value
    ? `radial-gradient(
        circle at ${ripplePosition.value.x}px ${ripplePosition.value.y}px,
        #fb729966,
        #fb7299dd
      )`
    : '#fb7299'
}))

// 涟漪效果样式
const rippleStyle = computed(() => ({
  left: `${ripplePosition.value.x}px`,
  top: `${ripplePosition.value.y}px`,
  background: `radial-gradient(circle, #fff3 0%, #fff0 100%)`
}))

// 修改点击事件处理
const toggleContent = (e) => {
  // 触发涟漪效果
  showRipple.value = true
  ripplePosition.value = {
    x: e.offsetX,
    y: e.offsetY
  }
  setTimeout(() => showRipple.value = false, 600)

  // 原有逻辑
  showContent.value = !showContent.value
}


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
  //边界吸附
  const snapThreshold = 20
  if (newX < snapThreshold) newX = 0
  if (newX > window.innerWidth - containerWidth - snapThreshold)
    newX = window.innerWidth - containerWidth
  pos.value = {x: newX, y: newY}
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
  // 可选：保存位置到 localStorage
  // 保存位置到 localStorage
  localStorage.setItem('fileButtonPos', JSON.stringify({
    x: pos.value.x,
    y: pos.value.y
  }))
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

.floating-button {
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 防止内容截断 */
  white-space: nowrap;
  min-width: 40px;
}

.floating-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.content-wrapper {
  position: absolute;
  margin-top: 10px;
  min-width: 200px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
</style>