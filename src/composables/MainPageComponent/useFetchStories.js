import { ref } from "vue"

export function useFetchStories() {
  const stories = ref([])
  const error = ref(null)

  // Start by fetching the stories without applying any filters
  const fetchStories = async (title = '', categoryId = '') => {
    try {
      let url = 'http://localhost:8000/api/stories?'
      // If the request has either the title of a story or a category
      // add them to the URL
      if (title) {
        url += `title=${encodeURIComponent(title)}&`
      }
      if (categoryId) {
        url += `category_id=${categoryId}&`
      }
      url = url.slice(0, -1) // Remove the trailing '&' if any

      console.log('Fetching URL:', url)
      const response = await fetch(url)
      if (!response.ok) {
        error.value = 'Failed to load stories.'
        console.error('Failed to load stories:', await response.json())
        return
      }
      const data = await response.json()
      stories.value = data.data
    } catch (err) {
      error.value = 'An error occurred while loading stories.'
      console.error('Error loading stories:', err)
    }
  }
  return { stories, error, fetchStories }
}