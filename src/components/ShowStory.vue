<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()
const story = ref(null)
const loading = ref(false)
const error = ref(null)
const availableTags = ref([])
const showAddTags = ref(false)

onMounted(async () => {
  await fetchStory()
  await fetchAvailableTags()
})

const fetchStory = async () => {
  const uuid = route.params.uuid
  loading.value = true
  error.value = null
  story.value = null

  try {
    const response = await fetch(`http://localhost:8000/api/stories/${uuid}`)
    if (!response.ok) {
      error.value = `Failed to load story: ${response.statusText}`
      return
    }
    const data = await response.json()
    story.value = data.data
  } catch (err) {
    error.value = 'An error ocurred while loading the story'
    console.error('Error loading story:', err)
  } finally {
    loading.value = false
  }
}

const fetchAvailableTags = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/tags')
    if (!response.ok) {
      console.error('Failed to fetch available tags:', await response.json())
      return
    }
    const data = await response.json()
    availableTags.value = data.data
  } catch (error) {
    console.error('Error fetching available tags:', error)
  }
}

const addTagToStory = async (tagId) => {
  if (!story.value || isTagAttached(tagId)) {
    return
  }

  try {
    const response = await fetch(`http://localhost:8000/api/stories/${story.value.uuid}/tags`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tag_id: tagId }),
    })

    if (!response.ok) {
      console.error('Failed to add tag to story:', await response.json())
      alert('Failed to add tag')
      return
    }

    await fetchStory()
  } catch (error) {
    console.error('Error adding tag to story', error)
    alert('Error adding tag.')
  }
}
const isTagAttached = (tagId) => {
  return story.value && story.value.tags.some(tag => tag.id === tagId)
}

const toggleAddTags = () => {
  showAddTags.value = !showAddTags.value
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-body p-4" v-if="story">
            <h2 class="card-title">{{ story.title }}</h2>

            <div v-if="story.tags && story.tags.length > 0" class="mb-3">
              <span v-for="tag in story.tags" :key="tag.id" class="badge bg-secondary me-2">{{ tag.name }}</span>
            </div>
            <div v-else class="mb-3 text-muted">No tags added yet.</div>

            <hr class="my-4">

            <div class="mb-3">
              <button class="btn btn-outline-info btn-sm" @click="toggleAddTags">
                {{ showAddTags ? 'Hide Tags' : 'Add Tags' }}
              </button>
            </div>

            <div v-if="showAddTags">
              <h3>Available Tags</h3>
              <div v-if="availableTags && availableTags.length > 0">
                <button
                  v-for="tag in availableTags"
                  :key="tag.id"
                  class="btn btn-sm btn-outline-primary me-2 mb-2"
                  @click="addTagToStory(tag.id)"
                  :disabled="isTagAttached(tag.id)"
                >
                  {{ tag.name }}
                </button>
              </div>
              <div v-else class="text-muted">Loading available tags...</div>
            </div>

            <div class="mt-4" v-html="story.content"></div>
          </div>
          <div class="card-body p-4" v-else-if="loading">
            Loading story...
          </div>
          <div class="card-body p-4" v-else-if="error">
            Error loading story: {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>