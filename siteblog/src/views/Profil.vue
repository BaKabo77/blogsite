<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-lg-4">
        <div class="card mb-4">
          <div class="card-body text-center">

            <h5 class="my-3">{{ user.username }}</h5>
            <div class="d-flex justify-content-center mb-2">
              <RouterLink to="/edit-profil" class="btn btn-primary">Modifier le profil</RouterLink>            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-8">
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

        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Mes derniers articles</h5>
            <div class="list-group">

            
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

import {onMounted,ref} from 'vue'

let user = ref({})

const lastArticles = ref()

const recupUser = ()=>{

  try{

    const rawData = localStorage.getItem('user')
    const data = JSON.parse(rawData)
    user.value = data
    user.value.created_at = user.value.created_at.slice(0,10)

}catch(error){

    console.log(error)

}

}

const recupArticleUser = async()=>{

  const rawData = await fetch('http://localhost:3000/articles/'+user.value.id)
  const data = await rawData.json()
  lastArticles.value = data.articles
}

onMounted(()=>{

  recupUser()
  recupArticleUser()
  
})


</script> 