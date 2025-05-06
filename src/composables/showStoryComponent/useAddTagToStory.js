import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useAddTagToStory(story, fetchStory) {
  const isTagAttached = (tagId) => {
    return story.value && story.value.tags.some(tag => tag.id === tagId)
  }

  const addTagToStory = async (tagId) => {
    if (!story.value || isTagAttached(tagId)) {
      return
    }
  
    try {
      const response = await fetch(`${API_BASE_URL}/stories/${story.value.uuid}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tag_id: tagId }),
      })
  
      if (!response.ok) {
        console.error('Failed to add tag to story:', await response.json())
        alert('Failed to add tag')
        return
      }
  
      await fetchStory()
    } catch (error) {
      console.error('Error adding tag to story', error)
      alert('Error adding tag.')
    }
  }
  return { addTagToStory, isTagAttached }
}