import { ref } from "vue";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useSubmitRating() {
  const ratingError = ref(null)
  const isRatingSubmitting = ref(false)
  const ratingSuccessMessage = ref(null)

  const submitRating = async (storyUuid, rating) => {
    ratingError.value = null
    isRatingSubmitting.value = true
    ratingSuccessMessage.value = null

    try {
      const response = await fetch(`${API_BASE_URL}/stories/${storyUuid}/rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating })
      })

      isRatingSubmitting.value = false

      if (!response.ok) {
        const errorData = await response.json()
        ratingError.value = errorData.message || 'Failed to submit rating.'
        return false
      }

      const data = await response.json()
      ratingSuccessMessage.value = data.message || 'Rating submitted successfully'
      return true
    } catch (error) {
      isRatingSubmitting.value = false
      ratingError.value = 'An unexpected error ocurred while submitting the rating'
      console.error('Error submitting rating:', error)
      return false
    }
  }
  return { ratingError, isRatingSubmitting, ratingSuccessMessage, submitRating }
}