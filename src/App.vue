<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'

const isLoggedIn = ref(false)
const username = ref(null)
const router = useRouter()

const checkAuth = () => {
  const token = localStorage.getItem('authToken')

  if (token) {
    isLoggedIn.value = true
    
    // Optionally, you could decode the token (if it's a JWT) to get the username
    // For this basic example, we'll just set a placeholder username
    username.value = 'Moderator'; // Replace with actual username retrieval logic
  } else {
    isLoggedIn.value = false
    username.value = null
  }
}

const logout = async () => {
  try {
    await fetch('http://localhost:8000/api/moderator/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Logout error: ', error)
  }

  localStorage.removeItem('authToken')
  isLoggedIn.value = false
  username.value = null
  router.push('/')
}

onMounted(() => {
  checkAuth()
})

watch(
  () => router.currentRoute.value,
  () => {
    checkAuth()
  }
)
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">Story App</router-link>
        <span v-if="isLoggedIn" class="navbar-text ms-2">
          Welcome, {{ username }}
        </span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link" active-class="active" exact>Home</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/create" class="nav-link" active-class="active">Create Story</router-link>
            </li>
            <li v-if="!isLoggedIn" class="nav-item">
              <router-link to="/moderator/login" class="nav-link" active-class="active">Moderator Login</router-link>
            </li>
            <li v-if="isLoggedIn" class="nav-item">
              <button @click="logout" class="nav-link btn btn-link text-decoration-none">Logout</button>
            </li>
            </ul>
          </div>
      </div>
    </nav>
    <div class="container mt-3">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>

</style>