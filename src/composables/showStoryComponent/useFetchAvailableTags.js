import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchAvailableTags() {
  const availableTags = ref([])

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tags`)
      if (!response.ok) {
        console.error('Failed to fetch available tags:', await response.json())
        return
      }
      const data = await response.json()
      availableTags.value = data.data
    } catch (error) {
      console.error('Error fetching available tags:', error)
    }
  }
  return { availableTags, fetchAvailableTags }
}