<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const authStore = useAuthStore()
const router = useRouter()

const jwtToken = authStore.token

function logout() {
    localStorage.removeItem('token')
    router.go(0)
    router.push('gallery')
}

</script>

<template>
    <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link :to="{ name: 'gallery' }">Galerie</router-link></li>
        <li><router-link to="/guests-gallery">Gästebilder</router-link></li>
        <li><router-link to="/activities">Aktivitäten</router-link></li>
        <!-- Can this be done better? With slots? Dont know if it makes sense with slots. -->
        <template v-if="jwtToken">
            <li><router-link to="/profile">Profil</router-link></li>
            <li v-if="authStore.isAdmin"><router-link to="/admin">Adminbereich</router-link></li>
            <li><a href="#" @click="logout">Logout</a></li>
        </template>
        <template v-if="!jwtToken">
            <li v-if="!jwtToken"><router-link to="/signup">Anmelden</router-link></li>
        </template>
    </ul>
</template>

<style>

    ul {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: auto;
    }

    li {
        display: inline-block;
    }

    li a {
        display: block;
        color: #000;
        padding: 8px 16px;
        text-decoration: none;
    }

    li a.active {
        background-color: #04AA6D;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        color: white;
    }

    li a:hover:not(.active) {
        background-color: #555;
        color: white;
    }

    .textarea-input {
        border-radius: 5px;
        padding: 5px;
        width: 80%;
        display: flex;
    }

</style>