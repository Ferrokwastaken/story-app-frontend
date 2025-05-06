import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export function useFetchPendingTags() {
  const storiesWithPendingTags = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPendingTags = async () => {
    loading.value = true
    error.value = null
    try {
      const csrfToken = getCookie('XSRF-TOKEN')
      const response = await fetch(`${API_BASE_URL}/moderator/stories-with-pending-tags`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'X-XSRF-TOKEN': csrfToken,
        },
        credentials: 'include',
      })
      if (!response.ok) {
        error.value = 'Failed to fetch stories with pending tags'
        console.error('Error fetching stories with pending tags:', await response.json())
        return
      }
      const data = await response.json()
      storiesWithPendingTags.value = data.data.data || []
    } catch (err) {
      error.value = 'An error ocurred while loading pending tags'
      console.error('Error loading pending tags', err)
    } finally {
      loading.value = false
    }
  }
  return { storiesWithPendingTags, loading, error, fetchPendingTags }
}