<template>
  <div class="container-fluid py-5">
    <!-- Gestion du chargement global -->
    <div v-if="isLoading" class="d-flex justify-content-center">
      <CircleLoader color="grey"></CircleLoader>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div v-else class="container">
      <!-- En-tête de l'article -->
      <div class="row mb-5">
        <div class="col-12 col-lg-8 offset-lg-2">
          <h1 class="display-4 mb-3">{{ article?.title }}</h1>
          <div class="d-flex align-items-center text-muted mb-4">
            <small>Publié le {{ article?.published_at?.slice(0,10) }}</small>
            <div class="vr mx-2"></div>
            <small>Par {{ article?.author }}</small>
          </div>
          <div class="mb-4">
            <span v-for="tag in article?.slug" 
                  :key="tag" 
                  class="badge bg-secondary me-2 px-3 py-2">
              {{ tag }}
            </span>
          </div>
          <hr class="my-4">
          <div v-if="article?.user_id === user_id" class="mb-3">
            <div class="d-flex gap-2">
              <router-link :to="'/article/edit/' + id" class="btn btn-primary">
                Modifier l'article
              </router-link>
              <button @click="deleteArticle" class="btn btn-danger">
                Supprimer l'article
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-lg-8 offset-lg-2">
          <p class="lead mb-4 fs-2">{{ article?.excerpt }}</p>
          <div class="fs-5 lh-lg mb-5">
            {{ article?.content }}
          </div>
        </div>
      </div>

      <!-- Section commentaires -->
      <div class="row mt-5">
        <div class="col-12 col-lg-8 offset-lg-2">
          <h3 class="mb-4">Commentaires</h3>
          <hr class="mb-4">
          
          <!-- Formulaire de commentaire -->
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="form-floating mb-3">
                <textarea v-model="comment" class="form-control" 
                          placeholder="Laissez un commentaire" 
                          id="commentArea"
                          style="height: 100px"></textarea>
                <label for="commentArea">Votre commentaire</label>
              </div>
              <button @click="submitComment" 
                      class="btn btn-primary px-4"
                      :disabled="isSubmittingComment">
                {{ isSubmittingComment ? 'Publication...' : 'Publier' }}
              </button>
            </div>
          </div>

          <!-- Liste des commentaires -->
          <div v-if="isLoadingComments" class="d-flex justify-content-center my-4">
            <CircleLoader color="grey"></CircleLoader>
          </div>

          <div v-else-if="commentsError" class="alert alert-danger">
            {{ commentsError }}
          </div>

          <div v-else-if="!comments || comments.length === 0" class="text-center my-4">
            Aucun commentaire pour le moment
          </div>

          <div v-else>
            <div class="card shadow-sm mb-3" v-for="comment in comments">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center">
                    <strong class="me-2">{{ comment.username }}</strong>
                    <small class="text-muted">{{ comment.created_at }}</small>
                  </div>
                  <button v-if="comment.user_id === user_id" 
                          @click="deleteComment(comment.id)" 
                          class="btn btn-danger btn-sm">
                    Supprimer
                  </button>
                </div>
                <p class="card-text mb-0">
                  {{ comment.content }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'

const router = useRouter()
const id = useRoute().params.id

// États des données
const article = ref(null)
const comments = ref(null)
const comment = ref('')
const user_id = JSON.parse(localStorage.getItem('user')).id

// États de chargement et d'erreur
const isLoading = ref(true)
const isLoadingComments = ref(true)
const isSubmittingComment = ref(false)
const error = ref(null)
const commentsError = ref(null)

const submitComment = async () => {
    if (!comment.value.trim()) return
    
    isSubmittingComment.value = true
    try {
        const req = await fetch('http://localhost:3000/comments/article/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                id_post: id,
                id_user: user_id,
                content: comment.value
            })
        })

        const data = await req.json()

        if (data.success) {
            comment.value = ''
            await getComments()
        } else {
            throw new Error('Erreur lors de la publication du commentaire')
        }
    } catch(error) {
        console.error('Erreur:', error)
        alert(error.message)
    } finally {
        isSubmittingComment.value = false
    }
}

const getArticle = async () => {
  try {
    const req = await fetch('http://localhost:3000/article/'+id, {
      credentials: 'include'
    })

    if (!req.ok) {
      throw new Error("Erreur lors de la récupération de l'article")
    }

    const data = await req.json()

    if (!data.success) {
      throw new Error("Article non trouvé")
    }

    article.value = data.article
    article.value.slug = article.value.slug.split('-')

  } catch(error) {
    console.error(error)
    error.value = error.message
  }
}

const getComments = async () => {
  isLoadingComments.value = true
  commentsError.value = null
  
  try {
    const req = await fetch('http://localhost:3000/comments/article/'+id, {
      credentials: 'include'
    })

    if (!req.ok) {
      throw new Error("Erreur lors de la récupération des commentaires")
    }

    const data = await req.json()

    if (!data.success) {
      throw new Error("Échec de la récupération des commentaires")
    }

    comments.value = data.comments

  } catch(error) {
    console.error(error)
    commentsError.value = error.message
  } finally {
    isLoadingComments.value = false
  }
}

const deleteComment = async (commentId) => {
    if (confirm('Voulez-vous vraiment supprimer ce commentaire ?')) {
        try {
            const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user_id }),
                credentials: 'include'
            });

            const result = await response.json();
            if (result.success) {
                await getComments();
            } else {
                throw new Error('Erreur lors de la suppression du commentaire')
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    }
};

const deleteArticle = async () => {
    if (confirm('Voulez-vous vraiment supprimer cet article ?')) {
        try {
            const response = await fetch(`http://localhost:3000/article/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userId: user_id }),
                credentials: 'include'
            });

            const result = await response.json();

            if (result.success) {
                router.push('/vos-articles');
            } else {
                throw new Error("Erreur lors de la suppression de l'article")
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    }
};

onMounted(async () => {
  isLoading.value = true
  try {
    await getArticle()
    await getComments()
  } catch(error) {
    error.value = "Une erreur est survenue lors du chargement de l'article"
  } finally {
    isLoading.value = false
  }
});
</script>
