<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pendingTagCount = ref(0)
const error = ref(null)
const loading = ref(true)
const storyReportCount = ref(0)
const commentReportCount = ref(0)

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:8000/api/moderator/home', {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      }
    })

    if (!response.ok) {
      error.value = `Failed to fetch dashboard data: ${response.status}`
      console.error('Failed to fetch dashboard data:', await response.json())
      return;
    }

    const data = await response.json()
    pendingTagCount.value = data.pendingTagCount || 0
    storyReportCount.value = data.storyReportCount || 0
    commentReportCount.value = data.commentReportCount || 0
  } catch (err) {
    error.value = `An error ocurred while fetching dashboard data: ${err.message}`
    console.error('Error fetching dashboard data:', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
<div class="container mt-5">
  <h1>Moderator Dashboard</h1>

  <div class="row mt-4">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-between align-items-center">
            Review Pending Tags
            <span v-if="pendingTagCount" class="badge bg-warning rounded-pill">{{ pendingTagCount }}</span>
          </h5>
          <p class="card-text">Here you can review and approve or reject tags that users have suggested for stories.</p>
          <router-link to="/moderator/pending-tags" class="btn btn-primary btn-sm">Go to Pending Tags</router-link>
        </div>
      </div>
    </div>
    <div class="col-md-6 mt-md-0 mt-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title d-flex justify-content-between align-items-center">
            Manage Reports
            <div>
              <span v-if="storyReportCount" class="badge bg-danger rounder-pill me-2">{{ storyReportCount }}</span>
              <span v-if="commentReportCount" class="badge bg-warning rounded-pill">{{ commentReportCount }}</span>
            </div>
          </h5> 
            <p class="card-text">View and manage reports submitted by users for inappropiate content</p>
            <router-link to="/moderator/reports" class="btn btn-info btn-sm">View Reports</router-link>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped></style>