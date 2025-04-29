<script setup>
import { ref, onMounted } from 'vue'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import { useRouter } from 'vue-router'
import { useSaveStory } from '@/composables/CreateStoryFormComponent/useSaveStory';
import { useFetchCategories } from '@/composables/useFetchCategories';

const quillEditor = ref(null)
const storyContent = ref('')
const storyTitle = ref('')
const router = useRouter()
const selectedCategoryId = ref('')
const storyDescription = ref('')

const { handleSaveStory, saveError, isSaving } = useSaveStory(storyTitle, storyContent, selectedCategoryId, storyDescription)
const { categories, fetchCategories } = useFetchCategories()

onMounted(async () => {
  quillEditor.value = new Quill('#quill-editor', {
    theme: 'snow',
  })

  quillEditor.value.on('text-change', () => {
    storyContent.value = quillEditor.value.root.innerHTML
  })

  fetchCategories()
})
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
                <input type="text" id="storyTitle" class="form-control" v-model="storyTitle" placeholder="Enter your story title...">
              </div>
              <div class="mb-3">
                <label for="category" class="form-label">Category</label>
                <select id="category" class="form-select" v-model="selectedCategoryId">
                  <option value="" disabled>Select a category</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea id="description" class="form-control" v-model="storyDescription" placeholder="Small synopsis of the story starts here..."></textarea>
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