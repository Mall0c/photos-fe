<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useErrorStore } from '@/stores/errors.store';
import Activities from '@/components/activities/Activities.vue';

const authStore = useAuthStore()
const errorStore = useErrorStore()

const userName = defineModel<string>("userName")
userName.value = authStore.name

const email = defineModel<string>("email")
email.value = authStore.email

const currentPassword = defineModel<string>("currentPassword")
const newPassword = defineModel<string>("newPassword")
const newPasswordRepeat = defineModel<string>("newPasswordRepeat")

function saveData(type: "general" | "password") {
    let data: Record<string, string> = Object.create(null)
    
    if (
        type === "general" 
        && typeof userName.value === "string" && userName.value.length > 0
        && typeof email.value === "string" && userName.value.length > 0
    ) {
        data.userName = userName.value
        data.email = email.value
    } else if (
        type === "password"
        && typeof currentPassword.value === "string" && currentPassword.value.length > 0
        && typeof newPassword.value === "string" && newPassword.value.length > 0
        && typeof newPasswordRepeat.value === "string" && newPasswordRepeat.value.length > 0
    ) {
        if (newPassword.value === newPasswordRepeat.value) {
            data.currentPassword = currentPassword.value
            data.newPassword = newPassword.value
        } else {
            // Passwords are not equal
            errorStore.setError("Passwörter sind ungleich.")
            return
        }
    } else {
        return
    }

    const requestOptions = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-Auth-Token": "Bearer " + authStore.jwtToken
        },
        body: JSON.stringify(data)
    }
    fetch(`http://localhost/api/user/edit/${authStore.userId}`, requestOptions)
        .then(async response => {
            if (response.status === 200) {
                if (type === "general") {
                    // Save new name and email in pinia store + local storage.
                    authStore.setUserData(
                        authStore.jwtToken,
                        {
                            name: userName.value as string,
                            email: email.value as string,
                            id: authStore.userId,
                            role: authStore.role
                        }
                    )
                }
                console.log("Success")
            } else if (response.status === 400) {
                console.log("Nicht so viel Success")
            }
        })
        .catch(err => {
            errorStore.setError(err)
        })
}

</script>

<template>
    <div class="profile-container debug">
        <span class="section-title">Allgemeine Informationen</span>
        <hr>
        <div class="profile-grid">
            <div class="profile-grid-box">Name</div>
            <div class="profile-grid-box">
                <input v-model="userName" id="user-name" type="text" />
            </div>
            <div class="profile-grid-box">E-Mail Adresse</div>
            <div class="profile-grid-box">
                <input v-model="email" id="user-email" type="text" />
            </div>
        </div>
        <button @click="saveData('general')">Speichern</button>
        <span class="section-title">Passwort ändern</span>
        <hr>
        <div class="profile-grid">
            <div class="profile-grid-box">Aktuelles Passwort</div>
            <div class="profile-grid-box">
                <input v-model="currentPassword" id="user-current-password" type="password" />
            </div>
            <div class="profile-grid-box">Neues Passwort</div>
            <div class="profile-grid-box">
                <input v-model="newPassword" id="user-new-password" type="password" />
            </div>
            <div class="profile-grid-box">Neues Passwort wiederholen</div>
            <div class="profile-grid-box">
                <input v-model="newPasswordRepeat" id="user-new-password-repeat" type="password" />
            </div>
        </div>
        <button @click="saveData('password')">Speichern</button>
        <span class="section-title">Meine letzten Aktivitäten</span>
        <hr>
        <Activities :userId="authStore.userId"></Activities>
        <span class="section-title">Konto löschen</span>
        <hr>
    </div>
</template>

<style>
    .profile-container {
        
    }

    .profile-grid {
        display: grid;
        grid-template-columns: 1fr 3fr;
    }

    .profile-grid-box {
        padding: 10px 0;
    }

    .section-title {
        display: block;
        padding: 10px 0;
        font-size: 20px;
    }
</style>