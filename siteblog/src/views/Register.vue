<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Inscription</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Nom d'utilisateur</label>
                <input v-model="userData.username" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="userData.email" type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input v-model="userData.password" type="password" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Prénom</label>
                <input v-model="userData.firstName" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="userData.lastName" type="text" class="form-control" required>
              </div>
              <div class="d-grid gap-2">
                <button type="submit" class="btn btn-primary">S'inscrire</button>
                <RouterLink to="/" class="btn btn-outline-secondary">Retour</RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userData = ref({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const register = async () => {
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData.value)
    })

    const result = await response.json()

    if (result.success) {
      alert('Inscription réussie !')
      router.push('/')
    } else {
      alert('Erreur lors de l\'inscription : ' + result.error)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'inscription')
  }
}
</script> 