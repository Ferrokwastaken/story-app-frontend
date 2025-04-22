<script setup>
  import {ref} from 'vue'

  const stories = ref([])

  const handleCreateStory = () => {
    console.log('Create Story button clicked!')
  }
</script>

<template>
  <div class="main-page">
    <header class="main-header">
      <h1>Story App</h1>
    </header>

    <main class="story-list-container">
      <p v-if="stories.length === 0">No stories yet. Be the first to create one!</p>
      <ul v-else class="story-list">
        <li v-for="story in stories" :key="story.uuid">{{ story.title }}</li>
      </ul>
    </main>

    <button class="create-story-button" @click="handleCreateStory">Create Story</button>
  </div>
</template>

<style src="../styles/mainPage.css" scoped></style>