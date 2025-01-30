<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <h1 class="mb-4">Créer un nouvel article</h1>
        
        <form @submit.prevent="submitArticle">
          <!-- Titre de l'article -->
          <div class="mb-4">
            <label for="title" class="form-label">Titre de l'article</label>
            <input 
              type="text" 
              class="form-control" 
              id="title" 
              v-model="article.title"
              required
            >
          </div>

          <div class="mb-4">

            <label for="categorie" class="form-label">Catégorie de l'article</label>

            <select class="form-control" name="categorie" id="" v-model="article.category" required>
                <option disabled :value="null">Selectionner une catégorie</option>
                <option v-for="cat in categories" :value="cat.name">{{ cat.name }}</option>
            </select>

          </div>

          

          <div class="mb-4">

            <label for="excerpt" class="form-label">Phrase résumant l'article</label>
            <input 
              type="text" 
              class="form-control" 
              id="excerpt" 
              v-model="article.excerpt"
              required
            >
          </div>

          <!-- Contenu de l'article -->
          <div class="mb-4">
            <label for="content" class="form-label">Contenu</label>
            <textarea 
              class="form-control" 
              id="content" 
              rows="10" 
              v-model="article.content"
              required
            ></textarea>
          </div>

          <!-- Tags -->
          <div class="mb-4">
            <label for="tags" class="form-label">Tags (séparés par des tirets)</label>
            <input 
              type="text" 
              class="form-control" 
              id="tags" 
              v-model="article.tags"
              placeholder="tag1-tag2-tag3"
            >
            <small class="text-muted">Exemple: javascript-vuejs-web</small>
          </div>

          <!-- Boutons -->
          <div class="d-flex gap-3">
            <button type="submit" class="btn btn-primary">
              <i class="bi bi-save me-2"></i>Publier
            </button>
            <RouterLink to="/vos-articles">
              <button type="button" class="btn btn-outline-secondary">
                Annuler
              </button>
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const article = ref({
  title: '',
  excerpt:'',
  content: '',
  tags: '',
  category:null
})

let categories = ref([])

const getCategorie = async()=>{
    try{

    const requete = await fetch('http://localhost:3000/categories')
    const data = await requete.json()
    categories.value = data.categories

}catch(error){

    alert('erreur lors de la recuperation des catégories : '+ error)
    console.log(error)

}

}

getCategorie()

const submitArticle = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    
    const articleData = {
      title: article.value.title,
      excerpt: article.value.excerpt,
      categorie: article.value.category,
      content: article.value.content,
      slug: article.value.tags,
      author_id: user.id
    }

    // Convertir les tags en tableau

    const response = await fetch('http://localhost:3000/articles', {
      method: 'POST',
      credentials:'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articleData)
    })

    const result = await response.json()

    console.log(result)

    if (result.success) {
      router.push('/vos-articles')
    } else {
      console.error('Erreur lors de la création de l\'article')
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}
</script> 