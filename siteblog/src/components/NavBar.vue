<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-secondary mb-4">
        <div class="container-fluid">
            <router-link class="text-decoration-none" to="/MainMenu">
            <span class="navbar-brand">KoBlog</span>
            </router-link>
            <div class="d-flex">

                <router-link to='/profil' class="text-decoration-none">
                <button class="nav-link mx-2 btn text-light btn-secondary">Mon Profil</button>
                </router-link>
                <router-link class="text-decoration-none" to="/vos-articles">
                <button class="nav-link mx-2 btn text-light btn-secondary">Mes Articles</button>
                </router-link>

                <button @click="logout" class="btn btn-outline-danger btn-sm">
                    Déconnexion
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');

onMounted(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        username.value = user.username;
    }
});

const logout = () => {
    localStorage.clear();
    router.push('/');
};
</script>