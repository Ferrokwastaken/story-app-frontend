<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useFetchPendingTags } from '@/composables/ModeratorPendingTagsComponent/useFetchPendingTags';
import { useSubmitTagDecisions } from '@/composables/ModeratorPendingTagsComponent/useSubmitTagDecisions';

const { storiesWithPendingTags, loading, error, fetchPendingTags } = useFetchPendingTags()
const { tagDecisions, submitTagDecisions } = useSubmitTagDecisions(fetchPendingTags)

const updateTagDecision = (storyUuid, tagId) => {
  if (!tagDecisions.value[storyUuid]) {
    tagDecisions.value[storyUuid] = {}
  }

  if (!tagDecisions.value[storyUuid][tagId]) {
    tagDecisions.value[storyUuid][tagId] = 'approve'
  } else if (tagDecisions.value[storyUuid][tagId] === 'approve') {
    tagDecisions.value[storyUuid][tagId] = 'reject'
  } else if (tagDecisions.value[storyUuid][tagId] === 'reject') {
    tagDecisions.value[storyUuid][tagId] = null
  }
}

onMounted(() => {
  fetchPendingTags()
  useSubmitTagDecisions()
})
</script>

<template>
  <div class="container mt-5">
    <h1>Moderator Pending Tags</h1>

    <div v-if="storiesWithPendingTags && storiesWithPendingTags.length > 0">
      <form @submit.prevent="submitTagDecisions">
        <div v-for="story in storiesWithPendingTags" :key="story.uuid" class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">{{ story.title }}</h5>
            <h6 class="card-subtitle mb-2 text-muted">UUID: {{ story.uuid }}</h6>
            <p class="card-text">{{ story.description }}</p>
            <p class="card-text" v-if="story.contentSnippet">{{ story.contentSnippet }}...</p>
            <router-link :to="`/stories/${story.uuid}`" class="btn btn-sm btn-outline-primary mb-2">View
              Story</router-link>

            <div class="mt-3">
              <strong>Pending Tags:</strong>
              <div v-if="story.pending_tags && story.pending_tags.length > 0" class="d-flex flex-wrap">
                <button v-for="tag in story.pending_tags" :key="tag.id" type="button" class="btn btn-sm me-2 mb-2"
                  :class="{ 'btn-success': tagDecisions[story.uuid]?.[tag.id] === 'approve', 'btn-danger': tagDecisions[story.uuid]?.[tag.id] === 'reject', 'btn-secondary': !tagDecisions[story.uuid]?.[tag.id] }"
                  @click="updateTagDecision(story.uuid, tag.id)">
                  {{ tag.name }}
                </button>
              </div>
              <div v-else class="text-muted">No pending tags for this story.</div>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary">Confirm Tag Decisions</button>
      </form>
    </div>
    <div v-else-if="loading">
      Loading pending tags...
    </div>
    <div v-else>
      No stories with pending user tags.
    </div>
  </div>
</template>