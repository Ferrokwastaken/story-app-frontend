import { ref } from "vue"
import { useRoute } from "vue-router"

export function useFetchComments() {
  const route = useRoute()
  const storyUuid = ref(route.params.uuid)
  const comments = ref([])
  const newComment = ref('')
  const commentError = ref(null)

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
  
  return {storyUuid, comments, newComment, commentError, fetchComments, submitComment}
}