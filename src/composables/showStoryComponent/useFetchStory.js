import { ref } from 'vue'
import { useRoute } from 'vue-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchStory(storyUuidParam) {
  const route = useRoute()
  const story = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchStory = async () => {
    loading.value = true
    error.value = null
    story.value = null
  
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${storyUuidParam}`)
      if (!response.ok) {
        error.value = `Failed to load story: ${response.statusText}`
        return
      }
      const data = await response.json()
      story.value = data.data
    } catch (err) {
      error.value = 'An error ocurred while loading the story'
      console.error('Error loading story:', err)
    } finally {
      loading.value = false
    }
  }
  return { story, loading, error, fetchStory }
}