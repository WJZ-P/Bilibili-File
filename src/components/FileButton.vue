<!-- FileButton.vue -->
<template>
  <div :class="['file-button-container', position]">
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
import { ref, computed } from 'vue'

const props = defineProps({
  position: {
    type: String,
    default: 'top-center',
    validator: (value) => [
      'top-left',
      'top-center',
      'top-right',
      'bottom-left',
      'bottom-center',
      'bottom-right'
    ].includes(value)
  },
  buttonColor: {
    type: String,
    default: '#2196f3'
  }
})

const emit = defineEmits(['toggle'])

const isHovered = ref(false)
const showContent = ref(false)

const buttonStyle = computed(() => ({
  '--button-color': props.buttonColor,
  transform: isHovered.value ? 'scale(1.1)' : 'scale(1)'
}))

const toggleContent = () => {
  showContent.value = !showContent.value
  emit('toggle', showContent.value)
}
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