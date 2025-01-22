<template>
    <NavBar v-if="isAuthenticated && !isPublicRoute" />
    <router-view></router-view>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import NavBar from './components/NavBar.vue';

const route = useRoute();
const router = useRouter();
const isAuthenticated = ref(false);

// Liste des routes publiques
const publicRoutes = ['/', '/failed'];

// Computed property pour vérifier si la route actuelle est publique
const isPublicRoute = computed(() => {
    return publicRoutes.includes(route.path);
});

const checkAuth = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    isAuthenticated.value = !!(token && user);
    
    // Redirection si non authentifié et route protégée
    if (!isAuthenticated.value && !isPublicRoute.value) {
        router.push('/');
    }
};

// Vérification initiale
onMounted(() => {
    checkAuth();
});

// Vérification à chaque changement de route
watch(() => route.path, () => {
    checkAuth();
});
</script>
