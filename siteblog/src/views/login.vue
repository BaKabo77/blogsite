<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs">
              <li class="nav-item">
                <a class="nav-link" :class="{ active: !showRegister }" @click="showRegister = false">Connexion</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" :class="{ active: showRegister }" @click="showRegister = true">Inscription</a>
              </li>
            </ul>
          </div>
          <div class="card-body">
            <!-- Formulaire de connexion -->
            <form v-if="!showRegister" @submit.prevent="login">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="loginData.email" type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input v-model="loginData.password" type="password" class="form-control" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">Se connecter</button>
              </div>
            </form>

            <!-- Formulaire d'inscription -->
            <form v-else @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Nom d'utilisateur</label>
                <input v-model="registerData.username" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="registerData.email" type="email" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input v-model="registerData.password" type="password" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Prénom</label>
                <input v-model="registerData.firstName" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input v-model="registerData.lastName" type="text" class="form-control" required>
              </div>
              <div class="d-grid">
                <button type="submit" class="btn btn-primary">S'inscrire</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showRegister = ref(false)

const loginData = ref({
  email: '',
  password: ''
})



watch(showRegister,(newVal)=>{
  console.log(newVal)
})

const registerData = ref({
  username: '',
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const login = async () => {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData.value)
    })

    const result = await response.json()

    console.log(result)

    if (result.user.success) {
      localStorage.setItem('token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user.user[0]))
      router.push('/MainMenu')
    } else {
      alert('Erreur de connexion : ' + result.error)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la connexion')
  }
}

const register = async () => {
  try {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData.value)
    })

    const result = await response.json()

    if (result.success) {
      alert('Inscription réussie ! Vous pouvez maintenant vous connecter.')
      showRegister.value = false
      loginData.value.email = registerData.value.email
      loginData.value.password = registerData.value.password
    } else {
      alert('Erreur lors de l\'inscription : ' + result.error)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de l\'inscription')
  }
}
</script>

