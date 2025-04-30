import { ref } from "vue"
import { useRouter } from 'vue-router'

export function useLogin() {
  const email = ref('')
  const password = ref('')
  const error = ref(null)
  const isLogginIn = ref(false)
  const router = useRouter()

  const login = async () => {
    isLogginIn.value = true
    error.value = null
  
    try {
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

  return {email, password, error, isLogginIn, login}
}