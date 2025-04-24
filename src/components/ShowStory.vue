<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const story = ref(null)
  const loading = ref(false)
  const error = ref(null)

  onMounted(async () => {
    const uuid = route.params.uuid
    loading.value = true
    error.value = null
    story.value = null

    try {
      const response = await fetch(`http://localhost:8000/api/stories/${uuid}`)
      if (!response.ok) {
        if (response.status === 404) {
          error.value = 'Story not found'
        } else {
          error.value = 'Failed to load story'
          console.error('Failed to load story:', await response.json())
        }
        return
      }
      const data = await response.json()
      story.value = data.data
      loading.value = false
    } catch (err) {
      error.value = 'An error ocurred while loading the story'
      loading.value = false
      console.log('Error loading the story: ', err)
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <div class="show-story-page">
    <h1>Reading Story</h1>
    <p>UUID: {{ $route.params.uuid }}</p>
    <div v-if="story">
      <h2>{{ story.title }}</h2>
      <div v-html="story.content"></div>
    </div>
    <div v-else-if="loading">
      Loading story...
    </div>
    <div v-else-if="error">
      Error loading story: {{ error }}
    </div>
  </div>
</template>

<style scoped>
</style>