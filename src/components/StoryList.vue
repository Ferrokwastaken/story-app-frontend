<script setup>
  import {ref, onMounted} from 'vue'

  const stories = ref([])
  const error = ref(null)

  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stories')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      stories.value = data.data
    } catch (error) {
      error.value = error
      console.error('Error fetching stories:', error)
    }
  })
</script>

<template>
  <h1>Stories</h1>
  <div v-if="error">Error loading stories: {{ error }}</div>
  <ul v-else-if="stories.length > 0">
    <li v-for="story in stories" :key="story.uuid">{{ story.title }}</li>
  </ul>
  <div v-else>Loading stories...</div>
</template>

<style scoped>

</style>