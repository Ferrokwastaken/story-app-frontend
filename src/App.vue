<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { ref, onMounted, watch } from 'vue'
import { useLogin } from '@/composables/useLogin';
import { authState } from './store/authState';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const { username, loginSuccess } = useLogin()
const router = useRouter()

const checkAuth = () => {
  const token = localStorage.getItem('authToken')
  authState.isLoggedIn = !!token
}

const logout = async () => {
  try {
    await fetch(`${API_BASE_URL}/moderator/logout`, {
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
  authState.isLoggedIn = false
  router.push('/')
}

onMounted(() => {
  checkAuth()
})

watch(
  () => router.currentRoute.value,
  () => {
    checkAuth()
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <router-link to="/" class="navbar-brand">Story App</router-link>
        <span v-if="authState.isLoggedIn" class="navbar-text ms-2">
          Welcome, {{ authState.username }}
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
            <li v-if="!authState.isLoggedIn" class="nav-item">
              <router-link to="/moderator/login" class="nav-link" active-class="active">Moderator Login</router-link>
            </li>
            <li v-if="authState.isLoggedIn" class="nav-item dropdown">
              <button class="nav-link dropdown-toggle" id="userOptionsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Options
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userOptionsDropdown">
                <li><router-link to="/moderator/dashboard" class="dropdown-item" active-class="active">Dashboard</router-link></li>
                <li class="dropdown-item" @click="logout" id="logoutButton">Logout</li>
              </ul>
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
#logoutButton:hover {
  cursor: pointer;
}
</style>