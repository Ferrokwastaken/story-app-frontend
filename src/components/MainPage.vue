<script setup>
  import {ref, onMounted} from 'vue'
  import { useRouter } from 'vue-router'

  const stories = ref([])
  const error = ref(null)
  const router = useRouter()
  const categories = ref([])
  const filterTitle = ref('')
  const filterCategory = ref('')

  // Start by fetching the stories without applying any filters
  const fetchStories = async (title = '', categoryId = '') => {
  try {
    let url = 'http://localhost:8000/api/stories?'
    // If the request has either the title of a story or a category
    // add them to the URL
    if (title) {
      url += `title=${encodeURIComponent(title)}&`
    }
    if (categoryId) {
      url += `category_id=${categoryId}&`
    }
    url = url.slice(0, -1) // Remove the trailing '&' if any

    console.log('Fetching URL:', url)
    const response = await fetch(url)
    if (!response.ok) {
      error.value = 'Failed to load stories.'
      console.error('Failed to load stories:', await response.json())
      return
    }
    const data = await response.json()
    stories.value = data.data
  } catch (err) {
    error.value = 'An error occurred while loading stories.'
    console.error('Error loading stories:', err)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/categories')
    if (!response.ok) {
      console.error('Failed to fetch categories:', await response.json())
      return
    }
    const data = await response.json()
    categories.value = data.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const applyFilters = () => {
  console.log(filterCategory.value)
  fetchStories(filterTitle.value, filterCategory.value)
}

onMounted(() => {
  fetchStories() // Initial load without filters
  fetchCategories() // Load categories for the dropdown
})
</script>

<template>
  <div class="main-page">
    <header class="main-header bg-light py-3 mb-4">
      <div class="container">
        <h1>Story App</h1>
      </div>
    </header>

    <div class="container mb-4">
      <div class="row g-3 align-items-center">
        <div class="col-md-6">
          <label for="filterTitle" class="form-label">Filter by Title</label>
          <input type="text" id="filterTitle" class="form-control" v-model="filterTitle" @input="applyFilters">
        </div>
        <div class="col-md-6">
          <label for="filterCategory" class="form-label">Filter by Category:</label>
          <select id="filterCategory" class="form-select" v-model="filterCategory" @change="applyFilters">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }} - {{ category.id }}</option>
          </select>
        </div>
      </div>
    </div>

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