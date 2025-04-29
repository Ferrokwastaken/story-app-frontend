import { ref } from "vue";

export function useFetchAvailableTags() {
  const availableTags = ref([])

  const fetchAvailableTags = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/tags')
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