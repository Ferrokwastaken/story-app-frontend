<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin } from '@/composables/useLogin'

const {email, username, password, error, isLogginIn, login} = useLogin()

</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Moderator Login</h2>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <input type="email" id="email" class="form-control" v-model="email" required>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" id="password" class="form-control" v-model="password" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary" :disabled="isLogginIn">
                  {{ isLogginIn ? 'Loggin in...' : 'Login' }}
                </button>
              </div>
              <div v-if="error" class="mt-3 alert alert-danger">{{ error }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>