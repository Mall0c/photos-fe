<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';

const errorStore = useErrorStore()
const authStore = useAuthStore()
const router = useRouter()

const jwtToken = authStore.token

const schema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required()
})

const { values, errors, handleSubmit, defineField } = useForm({
    validationSchema: schema
});


const [email, emailAttrs] = defineField('email', {
    validateOnModelUpdate: false
});
const [password, passwordAttrs] = defineField('password', {
    validateOnModelUpdate: false,
});

function onSuccess(values) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
    }

    fetch("http://localhost:3000/user/login", requestOptions)
        .then(async res => {
            const responseParsed = await res.json()
            if (res.status === 200) {
                authStore.setUserData(responseParsed.token, responseParsed.userInfo)
                router.go()
            } else if (res.status === 401) {
                if (responseParsed.errorcode === 1) {
                    errorStore.setError("Benutzer existiert nicht oder das Passwort ist falsch.")
                }
            }
        })
}

function onInvalidSubmit({ values, errors, results }) {
    const firstError = Object.keys(errors)[0];
    errorStore.setError(errors[firstError])
    const el = document.querySelector(`[name="${firstError}"]`);
    el?.scrollIntoView({
        behavior: 'smooth',
    });
    el.focus();
}

const onSubmitForm = handleSubmit(onSuccess, onInvalidSubmit)

function logout() {
    localStorage.removeItem('token')
    router.go()
    router.push('gallery')
}

</script>

<template>
    <ul>
        <li><router-link to="/home">Home</router-link></li>
        <li><router-link to="/gallery">Galerie</router-link></li>
        <li><router-link to="/guests-gallery">Gästebilder</router-link></li>
        <li><router-link to="/activities">Aktivitäten</router-link></li>
        <!-- Can this be done better? With slots? Dont know if it makes sense with slots. -->
        <template v-if="jwtToken">
            <li><router-link to="/profile">Profil</router-link></li>
            <li v-if="authStore.isAdmin"><router-link to="/admin">Adminbereich</router-link></li>
            <li><a href="#" @click="logout">Logout</a></li>
        </template>
        <template v-if="!jwtToken">
            <li v-if="!jwtToken"><router-link to="/register">Registrieren</router-link></li>
        </template>
    </ul>
    <template v-if="!jwtToken">
        <form @submit="onSubmitForm">
            <div class="login-container">
                <input v-model="email" v-bind="emailAttrs" type="text" name="email" />
                <input v-model="password" v-bind="passwordAttrs" type="password" name="password" />
                <button class="login-button">Login</button>
            </div>
        </form>
    </template>
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

.login-container {
    display: flex;
    flex-direction: column;
    margin: 10px;
}

.login-container input {
    background-color: white;
    max-width: 100%;
    margin-top: 10px;
}

.login-button {
    background-color: blue;
    color: white;
    margin-top: 15px;
    padding: 10px;
    border-radius: 15px;
}

.textarea-input {
    border-radius: 5px;
    padding: 5px;
    width: 80%;
    display: flex;
}

</style>