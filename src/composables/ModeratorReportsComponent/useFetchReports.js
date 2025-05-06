import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchReports() {
  const storyReports = ref([])
  const commentReports = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchReports = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch(`${API_BASE_URL}/moderator/reports`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        }
      })
  
      if (!response.ok) {
        throw new Error(`Failed to fetch reports: ${response.status}`)
      }
  
      const data = await response.json()
      storyReports.value = data.reports_stories || []
      commentReports.value = data.comment_reports || []
      console.log('StoryReports:', storyReports.value)
      console.log('commentReports:', commentReports.value)
  
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  return {storyReports, commentReports, loading, error, fetchReports}
}