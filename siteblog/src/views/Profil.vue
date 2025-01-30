<template>
  <div class="container py-5">
    <!-- Gestion du chargement global -->
    <div v-if="isLoading" class="d-flex justify-content-center">
      <CircleLoader color="grey"></CircleLoader>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">
            <h5 class="my-3">{{ user.username }}</h5>
            <div class="d-flex justify-content-center mb-2">
              <RouterLink to="/edit-profil" class="btn btn-primary">Modifier le profil</RouterLink>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-8">
        <!-- Informations utilisateur -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Nom complet</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ user.first_name }} {{ user.last_name }}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Email</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ user.email }}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="col-sm-3">
                <p class="mb-0">Membre depuis</p>
              </div>
              <div class="col-sm-9">
                <p class="text-muted mb-0">{{ user.created_at }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section articles -->
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Mes derniers articles</h5>
            <div v-if="isLoadingArticles" class="d-flex justify-content-center my-4">
              <CircleLoader color="grey"></CircleLoader>
            </div>
            
            <div v-else-if="articlesError" class="alert alert-danger">
              {{ articlesError }}
            </div>

            <div v-else-if="!lastArticles || lastArticles.length === 0" class="text-center my-4">
              Vous n'avez pas encore publié d'articles
            </div>

            <div v-else class="list-group">
              <a v-for="article in lastArticles" href="#" class="list-group-item list-group-item-action text-dark">
                <RouterLink :to="'article/'+article.id" class="text-decoration-none text-dark">
                  <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1">{{ article.title }}</h6>
                    <small class="text-muted">{{ article.published_at }}</small>
                  </div>
                  <p class="mb-1">{{ article.content.slice(0,100) + "..." }}</p>
                </RouterLink>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'

let user = ref({})
const lastArticles = ref([])
const isLoading = ref(true)
const isLoadingArticles = ref(true)
const error = ref(null)
const articlesError = ref(null)

const recupUser = () => {
  try {
    const rawData = localStorage.getItem('user')
    if (!rawData) {
      throw new Error("Données utilisateur non trouvées")
    }
    const data = JSON.parse(rawData)
    user.value = data
    user.value.created_at = user.value.created_at.slice(0,10)
  } catch(error) {
    console.error(error)
    error.value = "Erreur lors de la récupération des données utilisateur"
  }
}

const recupArticleUser = async () => {
  isLoadingArticles.value = true
  articlesError.value = null
  
  try {
    const rawData = await fetch('http://localhost:3000/articles/' + user.value.id, {
      credentials: 'include'
    })
    
    if (!rawData.ok) {
      throw new Error("Erreur lors de la récupération des articles")
    }
    
    const data = await rawData.json()
    
    if (!data.success) {
      throw new Error("Échec de la récupération des articles")
    }
    
    lastArticles.value = data.articles
  } catch(error) {
    console.error(error)
    articlesError.value = error.message
  } finally {
    isLoadingArticles.value = false
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    recupUser()
    await recupArticleUser()
  } catch(error) {
    error.value = "Une erreur est survenue lors du chargement des données"
  } finally {
    isLoading.value = false
  }
})
</script> 