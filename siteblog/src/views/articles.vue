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

    <p v-if="!art">
      vous n'avez pas encore d'articles
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
</template>

<script setup>

import { onMounted,watch,ref } from 'vue';
import { RouterLink } from 'vue-router';

let art = ref()


onMounted(async()=>{

    const user = JSON.parse(localStorage.getItem('user'))
    
    const id = user.id

    const req = await fetch('http://localhost:3000/articles/'+id)
    const data = await req.json()
    
    art.value = data.articles

    art.value.forEach(element => {
      element.slug = element.slug.split('-')
    });




})



</script>