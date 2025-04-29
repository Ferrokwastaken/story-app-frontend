import { ref } from "vue"

export function useFetchCategories() {
  const categories = ref([])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories')
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