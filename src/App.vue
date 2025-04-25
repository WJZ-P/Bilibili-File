<template>
   <FileButton position="top-right" button-color="#ff4081">
    <!-- 这里可以插入任何Vue组件 -->
    <div class="custom-content">
      <h3>我的文件面板</h3>
      <button @click="handleFileAction">上传文件</button>
    </div>
  </FileButton>
<!--  <FloatingUI msg="Vite + Vue" />-->
</template>

<script setup>
import FloatingUI from "./components/FloatingUI.vue";
import FileButton from "./components/FileButton.vue";

const handleFileAction = () => {
  // 处理文件操作逻辑
  console.log("我被点击辣~")
}

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.custom-content {
  padding: 16px;
}

.custom-content h3 {
  margin-bottom: 12px;
  color: #333;
}
</style>
