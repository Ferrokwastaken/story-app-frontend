import { ref } from "vue"

export function useFetchStories() {
  const stories = ref([])
  const error = ref(null)

  // Start by fetching the stories without applying any filters
  const fetchStories = async (title = '', categoryId = '', startDate = null, endDate = null) => {
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
      if (startDate && endDate) {
        url += `start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}&`
      }

      url = url.slice(0, -1) // Remove the trailing '&' if any
      if (url.endsWith('?')) {
        url = url.slice(0, -1)
      }

      console.log('Fetching URL:', url)
      const response = await fetch(url)
      if (!response.ok) {
        error.value = 'Failed to load stories.'
        console.error('Failed to load stories:', await response.json())
        return
      }
      const data = await response.json()
      // Access the actual array of stories within the 'data' property of the paginated response
      if (data && data.data && Array.isArray(data.data.data)) {
        stories.value = data.data.data;
      } else if (data && Array.isArray(data.data)) {
        stories.value = data.data; // If not using pagination directly on the main list
      } else {
        console.error('Unexpected data structure:', data);
        error.value = 'Failed to load stories.';
      }
    } catch (err) {
      error.value = 'An error occurred while loading stories.'
      console.error('Error loading stories:', err)
    }
  }
  return { stories, error, fetchStories }
}