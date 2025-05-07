import { ref } from "vue"
import { useRoute } from "vue-router"
import Swal from 'sweetalert2';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchComments(story) {
  const route = useRoute()
  const comments = ref([])
  const newComment = ref('')
  const commentError = ref(null)

  const fetchComments = async () => {
    if (story.value && story.value.uuid) {
      try {
        const response = await fetch(`${API_BASE_URL}/stories/${story.value.uuid}/comments`)
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
  }

  const submitComment = async () => {
    commentError.value = null
    if (!newComment.value.trim()) {
      commentError.value = 'Comment cannot be empty'
      return
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${story.value.uuid}/comments`, {
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

  const reportComment = async (comment) => {
    Swal.fire({
      title: 'Report Comment',
      html: `
      <input type="text" id="report-reason" class="swal2-input" placeholder="Reason for report">
      <textarea id="report-details" class="swal2-textarea" placeholder="Details (optional)"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: 'Submit Report',
    preConfirm: async () => {
      const reason = document.getElementById('report-reason').value
      const details = document.getElementById('report-details').value
      const userUuid = comment.user_uuid

      if (!reason) {
        Swal.showValidationMessage('Reason is required')
        return false
      }

      try {
        const response = await fetch(`${API_BASE_URL}/comments/${comment.uuid}/report`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ reason, details, user_uuid: userUuid }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          Swal.showValidationMessage(errorData.message || 'Failed to report comment')
          return false
        }
        return response.json()
      } catch (error) {
        Swal.showValidationMessage(`Request failed: ${error}`)
        return false
      }
    },
    allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Reported!', 'The comment has been reported.', 'success')
      }
    })
  }
  
  return { comments, newComment, commentError, fetchComments, submitComment, reportComment}
}