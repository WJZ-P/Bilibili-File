<template>
  <div class="main-container">
    <MainMenu/>
  </div>

  <!--  <FloatingUI msg="Vite + Vue" />-->
</template>

<script setup>
import MainMenu from "./components/MainMenu.vue";
</script>

<style>
.main-container {
  width: 100%;
  height: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
