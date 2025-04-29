<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useFetchStory } from '@/composables/showStoryComponent/useFetchStory';
import { useAddTagToStory } from '@/composables/showStoryComponent/useAddTagToStory';
import { useFetchAvailableTags } from '@/composables/showStoryComponent/useFetchAvailableTags';

const route = useRoute()
const showAddTags = ref(false)

const { story, loading, error, fetchStory } = useFetchStory()
const { availableTags, fetchAvailableTags } = useFetchAvailableTags()
const { addTagToStory, isTagAttached } = useAddTagToStory(story, fetchStory)

onMounted(async () => {
  await fetchStory()
  await fetchAvailableTags()
})

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

            <p class="card-text text-muted fst-italic" v-if="story.description">{{ story.description }}</p>
            <p class="card-text fst-italic text-muted" v-else>No description available for this story.</p>

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