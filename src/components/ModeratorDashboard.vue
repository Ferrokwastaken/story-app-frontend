<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const pendingTags = ref(null)
const loading = ref(false)
const error = ref(null)

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const fetchPendingTags = async () => {
  loading.value = true;
  error.value = null;
  try {

    const csrfToken = getCookie('XSRF-TOKEN')
    const response = await fetch('http://localhost:8000/api/moderator/stories', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'X-XSRF-TOKEN': csrfToken,
      },
      credentials: 'include',
    });
    if (!response.ok) {
      error.value = 'Failed to fetch stories for pending tags.';
      console.error('Error fetching stories:', await response.json());
      return; // Important to return here to prevent further errors
    }
    const data = await response.json();
    let fetchedPendingTags = {};
    // Access the actual array of stories using data.data.data (nested 'data' due to pagination)
    if (data && data.data && Array.isArray(data.data.data)) {
      for (const story of data.data.data) {
        const pendingTagsResponse = await fetch(`/api/moderator/stories/${story.uuid}/pending-tags`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
            'X-XSRF-TOKEN': csrfToken,
          },
          credentials: 'include',
        });
        if (pendingTagsResponse.ok) {
          const pendingTagsData = await pendingTagsResponse.json();
          if (pendingTagsData.data && Array.isArray(pendingTagsData.data) && pendingTagsData.data.length > 0) {
            fetchedPendingTags[story.uuid] = pendingTagsData.data;
          }
        } else {
          console.error(`Error fetching pending tags for story ${story.uuid}:`, await pendingTagsResponse.json());
        }
      }
      pendingTags.value = fetchedPendingTags;
    } else {
      console.error('Unexpected structure for stories data:', data);
      error.value = 'Failed to process stories data.';
    }
  } catch (err) {
    error.value = 'An error occurred while loading pending tags.';
    console.error('Error loading pending tags:', err);
  } finally {
    loading.value = false;
  }
};

const approveTag = async (storyUuid, tagId) => {
  const csrfToken = getCookie('XSRF-TOKEN')
  try {
    const response = await fetch(`http://localhost:8000/api/moderator/stories/${storyUuid}/tags/${tagId}/approve`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({}),
    })
    if (response.ok) {
      await fetchPendingTags()
    } else {
      console.error('Failed to approve tag:', await response.json())
      alert('Failed to approve tag')
    }
  } catch (error) {
    console.error('Error approving tag:', error)
    alert('Error approving tag.')
  }
}

const rejectTag = async (storyUuid, tagId) => {
  const csrfToken = getCookie('XSRF-TOKEN')
  try {
    const response = await fetch(`http://localhost:8000/api/moderator/stories/${storyUuid}/tags/${tagId}/reject`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify({}),
    })
    if (response.ok) {
      await fetchPendingTags()
    } else {
      console.error('Failed to reject tag:', await response.json())
      alert('Failed to reject tag')
    }
  } catch (error) {
    console.error('Error reject tag:', error)
    alert('Error reject tag.')
  }
}

onMounted(() => {
  fetchPendingTags()
})
</script>

<template>
  <div class="container mt-5">
    <h1>Moderator Dashboard</h1>

    <div v-if="pendingTags && Object.keys(pendingTags).length > 0">
      <h2>Pending User Tags</h2>
      <div v-for="(tags, storyUuid) in pendingTags" :key="storyUuid" class="mb-4">
        <h3>Story UUID: {{ storyUuid }}</h3>
        <ul class="list-group">
          <li v-for="tag in tags" :key="tag.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            {{ tag.name }}
            <div>
              <button @click="approveTag(storyUuid, tag.id)" class="btn btn-sm btn-success me-2">Approve</button>
              <button @click="rejectTag(storyUuid, tag.id)" class="btn btn-sm btn-danger">Reject</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else-if="loading">
      Loading pending tags...
    </div>
    <div v-else>
      No pending user tags.
    </div>
  </div>
</template>