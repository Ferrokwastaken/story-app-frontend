import { ref } from "vue"
import { useRouter } from "vue-router"

/**
 * Composable for saving a story in the database.
 * @param {string} storyTitle
 * A mandatory title to call the story.
 * @param {string} storyContent
 * The content of the story itself.
 * @param {int} selectedCategoryId
 * The ID of the category to be able to select one from
 * a deployable list.
 * @param {string} storyDescription
 * A small synopsis of the story.
 * 
 * @returns {object}
 * An object containing reactive states and a function for saving stories
 */
export function useSaveStory(storyTitle, storyContent, selectedCategoryId, storyDescription) {
  const router = useRouter()
  const saveError = ref(null)
  const isSaving = ref(false)

  /**
   * Saves the story into the database with all the given data.
   * 
   * @returns {Promise<void>}
   * A promoise that resolves when the POST operation is complete.
   */
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