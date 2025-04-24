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
</script>

<template>
  <div class="main-page">
    <header class="main-header bg-light py-3 mb-4">
      <div class="container">
        <h1>Story App</h1>
      </div>
    </header>

    <main class="container">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <ul v-else-if="stories.length > 0" class="list-group">
        <li v-for="story in stories" :key="story.uuid" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
          <router-link :to="{ name: 'Show', params: { uuid: story.uuid } }" class="text-decoration-none text-dark">
            {{ story.title }}
          </router-link>
          <span v-if="story.category" class="badge bg-secondary">{{ story.category.name }}</span>
          <span v-else class="badge bg-light text-secondary">No Category</span>
        </li>
      </ul>
      <div v-else class="fst-italic text-secondary text-center py-5">Loading stories...</div>
    </main>

    <div class="container mt-4 text-center">
      <router-link to="/create" class="btn btn-primary">Create Story</router-link>
    </div>
  </div>
</template>

<style src="../styles/mainPage.css" scoped></style>