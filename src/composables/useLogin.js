import { ref } from "vue"
import { useRouter } from 'vue-router'
import { authState } from "@/store/authState";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Composable that fetches both a Laravel csrf-cookie, and the logic of
 * the login page
 * 
 * @returns {object} An object containing reactive state and functions for logging in.
 */
export function useLogin() {
  const email = ref('')
  const password = ref('')
  const username = ref('')
  const error = ref(null)
  const isLogginIn = ref(false)
  const loginSuccess = ref(false)
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
    loginSuccess.value = false

    try {
      await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      })

      const response = await fetch(`${API_BASE_URL}/moderator/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })

      const data = await response.json();

      if (data.token && data.name) {
        localStorage.setItem('authToken', data.token);
        authState.username = data.name;
        authState.isLoggedIn = true
        loginSuccess.value = true; // Set to true on successful login
        console.log('USERNAME (from store):', authState.username);
        router.push('/moderator/dashboard');
      } else {
        error.value = data.message || 'Login failed. Please check your credentials.';
        isLogginIn.value = false;
        authState.isLoggedIn = false;
        authState.username = null;
      }
    } catch (err) {
      error.value = 'An unexpected error occurred during the login process.';
      isLogginIn.value = false;
      authState.isLoggedIn = false;
      authState.username = null;
      console.error('Moderator login error:', err);
    } finally {
      isLogginIn.value = false;
    }
  }

  return { email, password, error, isLogginIn, login, loginSuccess }
}