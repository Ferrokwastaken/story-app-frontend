import { ref } from 'vue'
import { useRoute } from 'vue-router';

export function useFetchStory() {
  const route = useRoute()
  const story = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  const fetchStory = async () => {
    const uuid = route.params.uuid
    loading.value = true
    error.value = null
    story.value = null
  
    try {
      const response = await fetch(`http://localhost:8000/api/stories/${uuid}`)
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