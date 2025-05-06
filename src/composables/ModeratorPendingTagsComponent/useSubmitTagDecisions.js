import Swal from 'sweetalert2';
import { ref } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function useSubmitTagDecisions(fetchPendingTags) {
  const tagDecisions = ref({})

  const submitTagDecisions = async () => {
    try {
      const csrfToken = getCookie('XSRF-TOKEN')
      const response = await fetch(`${API_BASE_URL}/moderator/tags/decisions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
        body: JSON.stringify({ tagDecisions: tagDecisions.value })
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        Swal.fire('Error!', errorData.message || 'Failed to submit tag decisions.', 'error')
        return
      }
  
      const responseData = await response.json()
      Swal.fire('Success!', responseData.message || 'Tag decisions submitted successfully', 'success').then(() => {
        fetchPendingTags()
        tagDecisions.value = {}
      })
    } catch (err) {
      Swal.fire('Error!', 'An unexpected error ocurred while submitting tag decisions.', 'error')
      console.error('Error submitting tag decisions:', err)
    }
  }
  return { tagDecisions, submitTagDecisions }
}