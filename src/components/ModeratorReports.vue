<script setup>
import { ref, onMounted } from 'vue';
import { useFetchReports } from '@/composables/ModeratorReportsComponent/useFetchReports';
import { useReportManagement } from '@/composables/ModeratorReportsComponent/useReportManagement';
import { useDeleteComment } from '@/composables/useDeleteComment';

const { storyReports, commentReports, loading, error, fetchReports } = useFetchReports()
const { deleteCommentError, isDeletingComment, deleteCommentSuccessMessage, deleteComment } = useDeleteComment()

const handleStoryReportDeleted = (reportId) => {
  storyReports.value = storyReports.value.filter(report => report.id !== reportId)
}

const handleCommentReportDeleted = (reportId) => {
  commentReports.value = commentReports.value.filter(report => report.id !== reportId)
}

const handleStoryResolved = (reportId) => {
  storyReports.value = storyReports.value.filter(report => report.id !== reportId)
}

const handleCommentResolved = (reportId) => {
  commentReports.value = commentReports.value.filter(report => report.id !== reportId)
}

const { deleteReport, resolveReport } = useReportManagement(handleStoryReportDeleted, handleCommentReportDeleted, handleStoryResolved, handleCommentResolved)

const handleDeleteComment = async (comment) => {
  if (comment && comment.uuid) {
    const success = await deleteComment(comment.uuid)
    if (success) {
      commentReports.value = commentReports.value.filter(report => report.comment?.uuid !== comment.uuid)
    }
  } else {
    console.warn('Invalid comment object')
  }
}

onMounted(async () => {
  fetchReports()
})

</script>

<template>
  <div class="container mt-5">
    <h1>Reported Content</h1>
    <div v-if="loading" class="alert alert-info">Loading reports...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <h2>Comment Reports</h2>
      <ul v-if="commentReports" class="list-group">
        <li v-for="report in commentReports" :key="report.id" class="list-group-item">
          <strong>Comment ID:</strong> {{ report.comment_uuid }} <br>
          <strong>Reason:</strong> {{ report.reason }} <br>
          <strong>Details:</strong> {{ report.details || 'No details provided.' }} <br>
          <router-link v-if="report.comment && report.comment.story_uuid && report.comment.uuid"
            :to="`/stories/${report.comment.story_uuid}#comment-${report.comment.uuid}`"
            class="btn btn-sm btn-outline-primary mt-2">
            View Comment
          </router-link>
          <span v-else class="text-muted mt-2">Comment Deleted</span>
          <button class="btn btn-sm btn-outline-success mt-2 ms-2" @click="resolveReport(report.id, 'comment')">Mark as Resolved</button>
          <button class="btn btn-sm btn-outline-warning mt-2 ms-2" @click="deleteReport(report.id, 'comment')">
            Delete Report
          </button>
          <button v-if="report.comment && report.comment.uuid" class="btn btn-sm btn-danger mt-2 ms-2" @click="handleDeleteComment(report.comment)" :disabled="isDeletingComment">
            <i class="bi bi-trash"></i> Delete Comment
          </button>
          <span v-if="isDeletingComment" class="ms-2 text-muted">Deleting...</span>
        </li>
      </ul>
      <div v-else class="alert alert-warning">No comment reports found</div>

      <h2 class="mt-4">Story Reports</h2>
      <ul v-if="storyReports" class="list-group mb-4">
        <li v-for="report in storyReports" :key="report.id" class="list-group-item">
          <strong>Story:</strong> {{ report.story ? report.story.title : 'Deleted Story' }}<br>
          <strong>Reason:</strong> {{ report.reason }}<br>
          <strong>Details:</strong> {{ report.details || 'No details provided.' }}<br>
          <router-link v-if="report.story" :to="`/stories/${report.story.uuid}`"
            class="btn btn-sm btn-outline-primary mt-2">
            View Story
          </router-link>
          <span v-else class="text-muted mt-2">Story Deleted</span>
          <button class="btn btn-sm btn-outline-success mt-2 ms-2" @click="resolveReport(report.id, 'story')">Mark as Resolved</button>
          <button class="btn btn-sm btn-outline-danger text-secondary mt-2 ms-2" @click="deleteReport(report.id, 'story')">
            Delete Report
          </button>
        </li>
      </ul>
      <div v-else class="alert alert-warning">No story reports found.</div>
    </div>
  </div>
</template>

<style scoped></style>