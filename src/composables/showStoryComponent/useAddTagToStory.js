import { ref } from "vue";

export function useAddTagToStory(story, fetchStory) {
  const isTagAttached = (tagId) => {
    return story.value && story.value.tags.some(tag => tag.id === tagId)
  }

  const addTagToStory = async (tagId) => {
    if (!story.value || isTagAttached(tagId)) {
      return
    }
  
    try {
      const response = await fetch(`http://localhost:8000/api/stories/${story.value.uuid}/tags`, {
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