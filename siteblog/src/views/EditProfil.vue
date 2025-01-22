<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-center">Modifier le profil</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <div class="mb-3">
                <label class="form-label">Nom d'utilisateur</label>
                <input v-model="userData.username" type="text" class="form-control" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="userData.email" type="email" class="form-control" required>
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
                <button type="submit" class="btn btn-primary">Mettre à jour</button>
                <RouterLink to="/profil" class="btn btn-outline-secondary">Annuler</RouterLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userData = ref({
  username: '',
  email: '',
  firstName: '',
  lastName: ''
})

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    userData.value = {
      username: user.username,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }
  }
})

const updateProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    const response = await fetch(`http://localhost:3000/user/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData.value)
    })

    const result = await response.json()

    if (result.success) {
      // Mettre à jour les données utilisateur dans le localStorage
      const updatedUser = {
        ...user,
        username: userData.value.username,
        email: userData.value.email,
        first_name: userData.value.firstName,
        last_name: userData.value.lastName
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      alert('Profil mis à jour avec succès !')
      router.push('/profil')
    } else {
      alert('Erreur lors de la mise à jour : ' + result.error)
    }
  } catch (error) {
    console.error('Erreur:', error)
    alert('Erreur lors de la mise à jour du profil')
  }
}
</script> 