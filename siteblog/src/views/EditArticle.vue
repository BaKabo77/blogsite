<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-12 col-lg-8 offset-lg-2">
        <h1 class="mb-4">Modifier l'article</h1>
        
        <form @submit.prevent="updateArticle">
          <div class="mb-3">
            <label for="title" class="form-label">Titre</label>
            <input type="text" 
                   class="form-control" 
                   id="title" 
                   v-model="articleData.title" 
                   required>
          </div>

          <div class="mb-3">
            <label for="excerpt" class="form-label">Extrait</label>
            <textarea class="form-control" 
                      id="excerpt" 
                      v-model="articleData.excerpt" 
                      rows="3" 
                      required></textarea>
          </div>

          <div class="mb-3">
            <label for="content" class="form-label">Contenu</label>
            <textarea class="form-control" 
                      id="content" 
                      v-model="articleData.content" 
                      rows="10" 
                      required></textarea>
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">Catégorie</label>
            <select class="form-select" 
                    id="category" 
                    v-model="articleData.categorie" 
                    required>
              <option v-for="cat in categories" 
                      :key="cat.id" 
                      :value="cat.name">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary">
              Mettre à jour
            </button>
            <router-link :to="'/article/' + id" class="btn btn-secondary">
              Annuler
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const articleData = ref({
  title: '',
  excerpt: '',
  content: '',
  categorie: '',
  user_id: JSON.parse(localStorage.getItem('user')).id
})

const categories = ref([])

// Charger les catégories
const loadCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/categories')
    const data = await response.json()
    if (data.success) {
      categories.value = data.categories
    }
  } catch (error) {
    console.error('Erreur lors du chargement des catégories:', error)
  }
}

// Charger l'article existant
const loadArticle = async () => {
  try {
    const response = await fetch(`http://localhost:3000/article/${id}`)
    const data = await response.json()
    if (data.success) {
      const article = data.article
      articleData.value = {
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        categorie: article.name,
        user_id: article.user_id
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement de l\'article:', error)
  }
}

// Mettre à jour l'article
const updateArticle = async () => {
  try {
    const response = await fetch(`http://localhost:3000/article/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...articleData.value,
        slug: articleData.value.title.toLowerCase().replace(/ /g, '-')
      })
    })

    const data = await response.json()

    if (data.success) {
      router.push(`/article/${id}`)
    } else {
      alert('Erreur lors de la modification de l\'article')
    }
  } catch (error) {
    console.error('Erreur lors de la modification de l\'article:', error)
    alert('Erreur lors de la modification de l\'article')
  }
}

onMounted(() => {
  loadCategories()
  loadArticle()
})
</script> 