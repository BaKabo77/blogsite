<template>
  <div class="container-fluid py-5">
    <!-- En-tête avec bouton Créer -->
    <div class="row mb-4">
      <div class="col-12 col-lg-10 offset-lg-1 d-flex justify-content-between align-items-center">
        <h1 class="display-4 mb-3">Mes Articles</h1>
        <RouterLink to="/creer-article">
          <button class="btn btn-success">
            <i class="bi bi-plus-circle me-2"></i>Créer un article
          </button>
        </RouterLink>
      </div>
      <div class="col-12 col-lg-10 offset-lg-1">
        <hr class="mb-4">
      </div>
    </div>

    <div v-if="isLoading">
      <CircleLoader class="d-flex align-content-center justify-content-center" color="grey"></CircleLoader>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <p v-else-if="!art || art.length === 0">
      Vous n'avez pas encore d'articles
    </p>

    <!-- Liste des articles dans un container -->
    <div class="container" v-else>
      <div class="row g-4 justify-content-center">
        <div v-for="article in art" class="col-12 col-md-6 col-lg-4 col-xxl-3" :key="article.id" :id="article.id">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ article.title.slice(0,25)+'...' }}</h5>
              <p class="card-text text-muted">
                <small>Publié le {{ article.published_at }}</small>
              </p>
              <p class="card-text text-truncate">{{ article.content }}</p>

              <div class="d-flex justify-content-between">

                <RouterLink :to="'/article/'+article.id">
                <button class="btn btn-primary">Lire</button>
                </RouterLink>
                
                <div class="d-flex align-content-end">
                  <span v-for="s in article.slug" class="badge bg-secondary me-2">
                    {{ s }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>


</template >

<script setup>

import { onMounted,watch,ref } from 'vue';
import { RouterLink } from 'vue-router';
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'

let isLoading = ref(true)
let error = ref(null)
let art = ref(null)

const getArticles = async () => {
    isLoading.value = true
    try {
        const user = JSON.parse(localStorage.getItem('user'))
        const id = user.id
        
        const req = await fetch('http://localhost:3000/articles/'+id, {
            credentials:'include'
        })
        const data = await req.json()
        
        if (!data.success) {
            throw new Error(data.error)
        }
        
        art.value = data.articles
        art.value.forEach(element => {
            element.slug = element.slug.split('-')
        })
    } catch(error) {
        console.error('Erreur:', error)
        art.value = null
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    getArticles()
})

</script>