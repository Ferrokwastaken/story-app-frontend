<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';
import { useFetchStory } from '@/composables/showStoryComponent/useFetchStory';
import { useAddTagToStory } from '@/composables/showStoryComponent/useAddTagToStory';
import { useFetchAvailableTags } from '@/composables/showStoryComponent/useFetchAvailableTags';

const route = useRoute()
const showAddTags = ref(false)
const storyUuid = ref(route.params.uuid)
const comments = ref([])
const newComment = ref('')
const commentError = ref(null)

const { story, loading, error, fetchStory } = useFetchStory()
const { availableTags, fetchAvailableTags } = useFetchAvailableTags()
const { addTagToStory, isTagAttached } = useAddTagToStory(story, fetchStory)

const fetchComments = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/stories/${storyUuid.value}/comments`)
    if (!response.ok) {
      console.error('Failed to fetch comments:', await response.json())
      return
    }
    const data = await response.json()
    comments.value = data.data
  } catch (err) {
    console.error('Error fetching comments:', err)
  }
}

const submitComment = async () => {
  commentError.value = null
  if (!newComment.value.trim()) {
    commentError.value = 'Comment cannot be empty'
    return
  }

  try {
    const response = await fetch(`http://localhost:8000/api/stories/${storyUuid.value}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: newComment.value,
      }),
    })

    if (response.ok) {
      newComment.value = ''
      await fetchComments()
    } else {
      const errorData = await response.json()
      commentError.value = errorData.message || 'Failed to submit comment'
      console.error('Error submitting comment:', errorData)
    }
  } catch (err) {
    commentError.value = 'An error ocurred while submitting the comment'
    console.error('Erro submitting comment:', err)
  }
}

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
                <button v-for="tag in availableTags" :key="tag.id" class="btn btn-sm btn-outline-primary me-2 mb-2"
                  @click="addTagToStory(tag.id)" :disabled="isTagAttached(tag.id)">
                  {{ tag.name }}
                </button>
              </div>
              <div v-else class="text-muted">Loading available tags...</div>
            </div>

            <div class="mt-4" v-html="story.content"></div>

            <hr class="my-4">

            <h3>Comments</h3>
            <div v-if="comments && comments.length > 0">
              <div v-for="comment in comments" :key="comment.uuid" class="mb-3 p-3 border rounded">
                <p class="mb-1"><strong>User:</strong> {{ comment.user ? comment.user.name : 'Anonymous' }}</p>
                <p class="mb-0">{{ comment.content }}</p>
              </div>
            </div>
            <div v-else class="text-muted">No comments yet. Be the first to comment!</div>

            <h4 class="mt-4">Add a comment</h4>
            <div v-if="commentError" class="alert alert-danger">{{ commentError }}</div>
            <textarea v-model="newComment" class="form-control mb-2" rows="3" placeholder="Add a new comment..."></textarea>
            <button class="btn btn-primary btn-sm" @click="submitComment">Post comment</button>

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