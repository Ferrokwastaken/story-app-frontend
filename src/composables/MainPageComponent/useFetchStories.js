import { ref } from "vue"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Composable for fetching and managing a list of stories, with optional filtering.
 *
 * @returns {object} An object containing reactive state and functions for interacting with stories.
 */
export function useFetchStories() {
  const stories = ref([])
  const error = ref(null)

  /**
     * Fetches stories from the backend API, optionally applying filters.
     *
     * @param {string} [title='']  
     * Optional title to filter stories by (performs a 'like' search).
     * @param {string|number} [categoryId='']  
     * Optional category ID to filter stories by.
     * @param {string|null} [startDate=null]  
     * Optional start date (YYYY-MM-DD) to filter stories by creation date range.
     * @param {string|null} [endDate=null]  
     * Optional end date (YYYY-MM-DD) to filter stories by creation date range.
     * @param {string|null} [orderBy=null]
     * 
     * @param {string|null} [direction=null]
     * 
     * 
     * @returns {Promise<void>} 
     * A Promise that resolves when the fetch operation is complete.
     */
  const fetchStories = async (title = '', categoryId = '', startDate = null, endDate = null, orderBy = null, direction = null) => {
    try {
      let url = `${API_BASE_URL}/stories?`
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
      if (orderBy) {
        url += `order_by=${orderBy}&`
        if (direction) {
          url+= `direction=${direction}&`
        }
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