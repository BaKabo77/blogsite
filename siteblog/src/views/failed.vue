<template>
    <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
        <div class="row">

            <h1 class="text-danger col-12 text-center">Connexion échouée</h1>
        
            <div class="form-group mt-4 d-flex justify-content-center">

            <button @click="retour" class="btn btn-secondary">Retour a la connexion</button>

            </div>

        </div>
    </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';


const routeur = useRouter()


const retour = ()=>{

    routeur.push('/')
}


</script>