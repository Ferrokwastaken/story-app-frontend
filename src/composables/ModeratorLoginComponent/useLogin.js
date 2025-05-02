import { ref } from "vue"
import { useRouter } from 'vue-router'

/**
 * Composable that fetches both a Laravel csrf-cookie, and the logic of
 * the login page
 * 
 * @returns {object} An object containing reactive state and functions for logging in.
 */
export function useLogin() {
  const email = ref('')
  const password = ref('')
  const error = ref(null)
  const isLogginIn = ref(false)
  const router = useRouter()

  /**
   * Fetches a Laravel Cookie and the login logic to the redirect the user
   * to the dashboard if the attempt is successful
   * 
   * @returns {Promise<void>} The function does not return a meaningful value
   * that should be used directly. Its effect is primarily through state updates
   * (isLogginIn, error) and route navigation.
   */
  const login = async () => {
    isLogginIn.value = true
    error.value = null

    try {
      await fetch('http://localhost:8000/sanctum/csrf-cookie', {
        credentials: 'include',
      })

      const response = await fetch('http://localhost:8000/api/moderator/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        error.value = errorData.message || 'Login failed. Please check your credentials.'
        isLogginIn.value = false
        return
      }

      const data = await response.json()
      const token = data.token

      localStorage.setItem('authToken', token)

      router.push('/moderator/dashboard')
    } catch (err) {
      error.value = 'An unexpected error occurred during the login proccess.'
      isLogginIn.value = false
      console.error('Moderator login error:', err)
    }
  }

  return { email, password, error, isLogginIn, login }
}