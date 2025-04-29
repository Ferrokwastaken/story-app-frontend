<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFetchStories } from '@/composables/MainPageComponent/useFetchStories'
import { useFetchCategories } from '@/composables/useFetchCategories'

const router = useRouter()
const filterTitle = ref('')
const filterCategory = ref('')

const { stories, error, fetchStories } = useFetchStories()
const { categories, fetchCategories } = useFetchCategories()

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
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }} - {{
              category.id }}</option>
          </select>
        </div>
      </div>
    </div>

    <main class="container">
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <ul v-else-if="stories.length > 0" class="list-group">
        <li v-for="story in stories" :key="story.uuid" class="list-group-item">
          <div class="d-flex justify-content-between align-items-center" data-bs-toggle="collapse"
            :data-bs-target="'#description-' + story.uuid" aria-expanded="false"
            aria-controls="'description-' + story.uuid" style="cursor: pointer;">
            <h6 class="mb-0 text-dark">{{ story.title }}</h6>
            <div>
              <span v-if="story.category" class="badge bg-secondary me-2">{{ story.category.name }}</span>
              <i class="bi bi-chevron-down"></i>
            </div>
          </div>
          <div class="collapse mt-2" :id="'description-' + story.uuid">
            <p class="text-muted">{{ story.description }}</p>
            <router-link :to="{ name: 'Show', params: { uuid: story.uuid } }" class="btn btn-sm btn-primary">
              Read More
            </router-link>
          </div>
        </li>
      </ul>
      <div v-else class="fst-italic text-secondary text-center py-5">Loading stories...</div>
    </main>

    <div class="container mt-4 text-center">
      <router-link to="/create" class="btn btn-primary">Create Story</router-link>
    </div>
  </div>
</template>

<style src="../styles/mainPage.css" scoped>
.list-group-item {
  padding: 0.75rem 1.25rem;
}
</style>