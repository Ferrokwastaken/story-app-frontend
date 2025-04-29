import { ref } from "vue"
import { useRouter } from "vue-router"

export function useSaveStory(storyTitle, storyContent, selectedCategoryId, storyDescription) {
  const router = useRouter()
  const saveError = ref(null)
  const isSaving = ref(false)

  const handleSaveStory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: storyTitle.value,
          content: storyContent.value,
          description: storyDescription.value,
          category_id: selectedCategoryId.value,
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error saving story:', errorData)
        return
      }
  
      const data = await response.json()
      console.log('Story saved successfully:', data)
      alert('Story saved successfully!')
      router.push('/')
    } catch (error) {
      console.error('Error sending the save request:', error)
    }
  }
  return { handleSaveStory, saveError, isSaving }
}