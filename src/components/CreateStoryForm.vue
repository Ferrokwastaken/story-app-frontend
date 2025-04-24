<script setup>
import { ref, onMounted } from 'vue'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import { useRouter } from 'vue-router';

const quillEditor = ref(null)
const storyContent = ref('')
const storyTitle = ref('')
const router = useRouter()
const categories = ref([])
const selectedCategoryId = ref('')

onMounted(async () => {
  quillEditor.value = new Quill('#quill-editor', {
    theme: 'snow',
  })

  quillEditor.value.on('text-change', () => {
    storyContent.value = quillEditor.value.root.innerHTML
  })

  try {
    const response = await fetch('http://localhost:8000/api/categories')

    if (!response.ok) {
      console.error('Failed to fetch categories', await response.json())
      return
    }
    const data = await response.json()
    categories.value = data.data
  } catch (error) {
    console.error('Error fetching categories: ', error)
  }
})

const handleSaveStory = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/stories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: storyTitle.value,
        content: storyContent.value,
        category_id: selectedCategoryId.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Error saving story:', errorData)
      return
    }

    const data = await response.json()
    console.log('Story saved successfully:', data)
    alert('Story saved successfully!')
    router.push('/')
  } catch (error) {
    console.error('Error sending the save request:', error)
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <div class="card shadow-sm">
          <div class="card-header bg-secondary text-white text-center">
            <h1>Create a New Story</h1>
          </div>
          <div class="card-body p-4">
            <form @submit.prevent="handleSaveStory">
              <div class="mb-3">
                <label for="storyTitle" class="form-label">Title</label>
                <input type="text" id="storyTitle" class="form-control" v-model="storyTitle" placeholder="Enter your story title">
              </div>
              <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <select id="category" class="form-select" v-model="selectedCategoryId">
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="quill-editor" class="form-label">Your Story</label>
                <div id="quill-editor" style="height: 300px; border: 1px solid #ccc;"></div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg">Save Story</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>