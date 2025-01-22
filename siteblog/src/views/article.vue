<template>
  <div class="container-fluid py-5">
    <div class="container">
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

      <!-- Contenu de l'article -->
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
          
          <!-- Formulaire commentaire -->
          <div class="card shadow-sm mb-4">
            <div class="card-body">
              <div class="form-floating mb-3">
                <textarea v-model="comment" class="form-control" 
                          placeholder="Laissez un commentaire" 
                          id="commentArea"
                          style="height: 100px"></textarea>
                <label for="commentArea" >Votre commentaire</label>
              </div>
              <button @click="submitComment" class="btn btn-primary px-4">Publier</button>
            </div>
          </div>

          <!-- Exemple de commentaire -->
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
</template>

<script setup>
import { ref, onMounted,watch } from 'vue';
import { useRoute,useRouter } from 'vue-router';

const router = useRouter()

const id = useRoute().params.id

const article = ref(null);

const comments = ref(null)

const comment = ref('')

const user_id = JSON.parse(localStorage.getItem('user')).id

console.log(user_id)

const submitComment = async () => {
    try {
        const req = await fetch('http://localhost:3000/comments/article/' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_post: id,
                id_user: user_id,
                content: comment.value
            })
        })

        const data = await req.json()

        if (data.success) {
            // Réinitialiser le champ de commentaire
            comment.value = ''
            // Recharger les commentaires
            await getComments()
        } else {
            alert('Erreur lors de la publication du commentaire')
        }

    } catch(error) {
        console.error('Erreur lors de la publication du commentaire:', error)
        alert('Erreur lors de la publication du commentaire')
    }
}

const getArticle = async()=>{

  try{

    const req = await fetch('http://localhost:3000/article/'+id)

    const data = await req.json()

    article.value = data.article

    article.value.slug = article.value.slug.split('-')


  }catch(error){

    console.error('erreur dans la recuperation darticle :', error)

  }

}

const getComments = async()=>{

  try{

    const req = await fetch('http://localhost:3000/comments/article/'+id)

    const data = await req.json()

    comments.value = data.comments

    console.log(comments.value)

  }catch(error){

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
                body: JSON.stringify({ userId: user_id })
            });

            const result = await response.json();
            if (result.success) {
                await getComments();
            } else {
                alert('Erreur lors de la suppression du commentaire');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression du commentaire');
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
                body: JSON.stringify({ userId: user_id })
            });

            const result = await response.json();

            console.log(result)

            if (result.success) {
                router.push('/vos-articles');
            } else {
                alert('Erreur lors de la suppression de l\'article');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la suppression de l\'article');
        }
    }
};

onMounted(async() => {

   getArticle()
   getComments()


});


</script>
