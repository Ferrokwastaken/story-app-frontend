import Swal from "sweetalert2";
import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function useDeleteComment() {
  const deleteCommentError = ref(null)
  const isDeletingComment = ref(false)
  const deleteCommentSuccessMessage = ref(null)

  const deleteComment = async (commentId) => {
    deleteCommentError.value = null
    isDeletingComment.value = true
    deleteCommentSuccessMessage.value = null
    const result = await Swal.fire({
      title: 'Delete Comment',
      text: 'Are you sure you want to delete the comment? It will not be recoverable!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yeah, delete the comment',
      cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
      try {
        console.log('Deleting comment with ID:', commentId)
        const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
          },
          credentials: 'include',
        })

        isDeletingComment.value = false

        if (!response.ok) {
          const errorData = await response.json()
          deleteCommentError.value = errorData.message || 'Failed to delete comment'
          Swal.fire('Error!', `${deleteCommentError.value}`, 'error')
          return false
        }

        const data = await response.json()
        deleteCommentSuccessMessage.value = data.message || 'Comment deleted successfully!'
        Swal.fire('Deleted!', `${deleteCommentSuccessMessage.value}`, 'success')
        return true
      } catch (error) {
        isDeletingComment.value = false
        deleteCommentError.value = 'An unexpected error occurred while deleting the comment.'
        Swal.fire('Error!', `${deleteCommentError.value}: ${error.message}`, 'error')
        return false
      }
    }
  }
  return { deleteCommentError, isDeletingComment, deleteCommentSuccessMessage, deleteComment }
}