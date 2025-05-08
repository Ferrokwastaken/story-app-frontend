import { ref } from "vue"
import { useRouter } from "vue-router"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Swal from "sweetalert2";

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
export function useSaveStory(storyTitle, storyContent, selectedCategoryId, storyDescription, storyTags) {
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
    Swal.fire({
      title: 'Save Story',
      text: 'Story saved successfully! Redirecting...',
      icon: 'success',
      confirmButtonText: 'Cool',
      timer: 2000,
    })
    try {
      const response = await fetch(`${API_BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: storyTitle.value,
          content: storyContent.value,
          description: storyDescription.value,
          category_id: selectedCategoryId.value,
          tags: storyTags.value.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
        }),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error saving story:', errorData)
        Swal.showValidationMessage(errorData.message || 'Failed to save story')
        return
      }
  
      const data = await response.json()
      console.log('Story saved successfully:', data)
      router.push('/')
    } catch (error) {
      console.error('Error sending the save request:', error)
      Swal.showValidationMessage(`Request failed: ${error}`)
    }
  }
  return { handleSaveStory, saveError, isSaving }
}