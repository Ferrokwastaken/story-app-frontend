<script setup>
  import StoryList from './components/StoryList.vue';
</script>

<template>
  <main>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" height="125" />
    <div class="wrapper">
      <StoryList />
    </div>
  </main>
</template>

<style scoped>
  .wrapper {
    background: #eee;
    padding: 1rem;
    border-radius: 8px;
  }
  .logo {
    display: block;
    margin: 0 auto 2rem;
  }
</style>