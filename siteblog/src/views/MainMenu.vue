<template>
    <div class="container mt-5">
        <h1 class="text-center display-3 mb-5">Articles les plus récents</h1>

        <!-- Section catégories avec gestion du chargement -->
        <div v-if="isLoadingCategories" class="d-flex justify-content-center my-4">
            <CircleLoader color="grey"></CircleLoader>
        </div>
        
        <div v-else-if="categoriesError" class="alert alert-danger" role="alert">
            {{ categoriesError }}
        </div>

        <div v-else class="mx-3 py-2 d-flex justify-content-between">
            <p class="h5 fw-bolder">Catégorie</p>
            <select name="categorie" id="" v-model="selectedCategorie">
                <option disabled :value="null">Selectionner une catégorie</option>
                <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{ cat.name }}</option>
            </select>
        </div>

        <!-- Section articles avec gestion du chargement -->
        <div v-if="isLoadingArticles" class="d-flex justify-content-center" style="min-height: 200px;">
            <CircleLoader color="grey"></CircleLoader>
        </div>

        <div v-else-if="articlesError" class="alert alert-danger" role="alert">
            {{ articlesError }}
        </div>

        <div v-else-if="!getArticle.length" class="text-center my-4">
            Aucun article trouvé pour cette catégorie
        </div>

        <div v-else v-for="article in getArticle" :key="article._id" class="border-bottom border-top py-4">

            <div class="d-flex justify-content-between">

                <p class="mx-3"> Par {{ article.username }}</p>

                <p class="fw-light me-3">publié le {{ article.published_at }}</p>

            </div>

            <h5 class="mx-3 fw-bold">{{ article.title }}</h5>

            <p class="mx-3">{{ article.content.slice(0,70)+'...' }}</p>

            <div class="d-flex justify-content-between">

                <RouterLink :to="'/article/'+article.id">
                <button class="btn btn-primary ms-3">Lire plus </button>
                </RouterLink>

              
                <div class="me-3">    
                    <span v-for="slug in article.slug" :key="tag" class="badge bg-secondary me-2">
                        {{ slug }}
                    </span>
                </div>      
            </div>

        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import CircleLoader from 'vue-spinner/src/MoonLoader.vue'

const router = useRouter();
const username = ref('');
const selectedCategorie = ref(null)
const categories = ref([])
const getArticle = ref([])

// États de chargement et d'erreur
const isLoadingCategories = ref(true)
const isLoadingArticles = ref(false)
const categoriesError = ref(null)
const articlesError = ref(null)

watch(selectedCategorie, async (newValue) => {
    if (newValue !== null) {
        isLoadingArticles.value = true
        articlesError.value = null
        
        try {
            const req = await fetch('http://localhost:3000/articles/category/' + newValue, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            
            if (!req.ok) {
                throw new Error('Erreur lors du chargement des articles')
            }
            
            const data = await req.json()
            getArticle.value = data.articles
            getArticle.value.forEach(element => {
                element.slug = element.slug.split('-')
            })
        } catch (error) {
            articlesError.value = `Erreur : ${error.message}`
            console.error(error)
        } finally {
            isLoadingArticles.value = false
        }
    }
})

onMounted(async () => {
    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !userStr) {
            throw new Error('Session expirée')
        }

        const user = JSON.parse(userStr);
        if (!user?.email || !user?.id || !user?.username) {
            throw new Error('Données utilisateur invalides')
        }

        username.value = user.username;

        // Chargement des catégories
        const requete = await fetch('http://localhost:3000/categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        })

        if (!requete.ok) {
            throw new Error('Erreur lors du chargement des catégories')
        }

        if(requete.status === 401){
            console.log('erreur auth')
            localStorage.clear()
            router.push("/")
        }

        const data = await requete.json()
        categories.value = data.categories

    } catch (error) {
        categoriesError.value = error.message
        console.error(error)
        if (error.message.includes('Session') || error.message.includes('utilisateur')) {
            localStorage.clear()
            router.push('/')
        }
    } finally {
        isLoadingCategories.value = false
    }
});
</script>