<script setup>
import { ref, onMounted } from 'vue'
import Quill from 'quill';
import 'quill/dist/quill.snow.css'
import { useRouter } from 'vue-router';

const quillEditor = ref(null)
const storyContent = ref('')
const storyTitle = ref('')
const router = useRouter()

onMounted(() => {
  quillEditor.value = new Quill('#quill-editor', {
    theme: 'snow',
  })

  quillEditor.value.on('text-change', () => {
    storyContent.value = quillEditor.value.root.innerHTML
  })
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

const ReturnToMainPage = () => {
  console.log('Return to main menu button pressed!');
  router.push('/')
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
                <input type="text" id="storyTitle" class="form-control" v-model="storyTitle"
                  placeholder="Enter your story title">
              </div>
              <div class="mb-3">
                <label for="quill-editor" class="form-label">Your Story</label>
                <div id="quill-editor" style="height: 300px; border: 1px solid #ccc;"></div>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-success btn-lg" @click="handleSaveStory">Save Story</button>
              </div>
            </form>
            <div class="d-grid">
              <button class="btn btn-secondary btn-lg mt-2" @click="ReturnToMainPage">Return To Main Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>