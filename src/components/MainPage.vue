<script setup>
  import {ref, onMounted} from 'vue'
  import { useRouter } from 'vue-router'

  const stories = ref([])
  const error = ref(null)
  const router = useRouter()

  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stories')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      stories.value = data.data
    } catch (err) {
      error.value = err
      console.error('Error fetching stories', err)
    }
  })

  const handleCreateStory = () => {
    console.log('Create Story button clicked!')
    router.push('/create')
  }
</script>

<template>
  <div class="main-page">
    <header class="main-header">
      <h1>Story App</h1>
    </header>

    <main class="story-list-container">
      <div v-if="error" class="error-message">Error loading stories: {{ error }}</div>
      <ul v-else-if="stories.length > 0" class="story-list">
        <li v-for="story in stories" :key="story.uuid">{{ story.title }}</li>
      </ul>
      <div v-else class="fst-italic text-secondary">Loading stories...</div>
    </main>

    <button class="btn btn-primary" @click="handleCreateStory">Create Story</button>
  </div>
</template>

<style src="../styles/mainPage.css" scoped></style>