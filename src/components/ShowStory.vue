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

    try {
      // Simulating the API call
      console.log('Fetching story with UUID:', uuid)
      setTimeout(() => {
        story.value = {
          uuid: uuid,
          title: 'Placeholder',
          content: '<p>Placeholder text</p>'
        }
        loading.value = false
      }, 1000)      
    } catch (err) {
      error.value = err.message
      loading.value = false
      console.log('Error loading the story: ', error)
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