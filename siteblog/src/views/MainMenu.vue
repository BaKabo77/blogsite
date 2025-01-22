<template>
    <div class="container mt-5">
        <h1 class="text-center display-3 mb-5">Articles les plus récents</h1>

        <div class="mx-3 py-2 d-flex justify-content-between">

            <p class="h5 fw-bolder">Catégorie</p>

            <select name="categorie" id="" v-model="selectedCategorie">
                <option disabled :value="null">Selectionner une catégorie</option>
                <option v-for="cat in categories" :value="cat.name">{{ cat.name }}</option>

            </select>

        </div>


        <div v-for="article in getArticle" :key="article._id" class="border-bottom border-top py-4">

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
import { ref, onMounted,watch,computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const selectedCategorie = ref(null)
let categories = ref([])
let articles = ref([])

const getArticle = ref([])

watch(selectedCategorie, async (newValue) => {
    if (newValue !== null) {
        try {
            console.log(newValue)
            const req = await fetch('http://localhost:3000/articles/category/' + newValue)
            const data = await req.json()
            getArticle.value = data.articles
            getArticle.value.forEach(element => {element.slug = element.slug.split('-')})
            console.log(getArticle.value[0].slug)
        } catch (error) {
            alert('erreur :' + error.message)
            console.log(error)
        }
    }
})


onMounted(async () => {
    try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!token || !userStr) {
            return router.push('/');
        }

        const user = JSON.parse(userStr);
        if (!user || !user.email || !user.id || !user.username) {
            localStorage.clear();
            return router.push('/');
        }

        username.value = user.username;

    } catch (error) {
        console.error('Erreur de vérification:', error);
        localStorage.clear();
        router.push('/');
    }

    try{

    const requete = await fetch('http://localhost:3000/categories')
    const data = await requete.json()
    categories.value = data.categories

    }catch(error){

        alert('erreur lors de la recuperation des catégories : '+ error)
        console.log(error)

    }


});


</script>