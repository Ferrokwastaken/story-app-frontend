import { ref } from "vue"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useFetchCategories() {
  const categories = ref([])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        console.error('Failed to fetch categories:', await response.json())
        return
      }
      const data = await response.json()
      categories.value = data.data
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
  return { categories, fetchCategories }
}