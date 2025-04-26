<template>
  <FileButton position="top-left" button-color="#ff4081">
    <!-- 这里可以插入任何Vue组件 -->
    <div class="custom-content">
      <h3>我的文件面板</h3>
      <button @click="handleFileAction">上传文件</button>
    </div>
  </FileButton>
  <!--  <FloatingUI msg="Vite + Vue" />-->
</template>

<script setup>
import FileButton from "./components/FileButton.vue";

const handleFileAction = () => {
  // 处理文件操作逻辑
  console.log("我被点击辣~")
}

</script>

<style>

</style>
