<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { ref, useTemplateRef } from "vue"

const authStore = useAuthStore()
const jwtToken = authStore.token
const fileInput = useTemplateRef("fileInput")

function upload() {
    console.log("Hier 1")
    const formData = new FormData()
    formData.append('image', fileInput.value.files[0])
    console.log("Hier 2")
    fetch(`http://localhost:3000/images-by-guests`, 
        {
            method: "POST",
            body: formData,
            headers: { 
                "Authorization": "Bearer " + jwtToken
            }
        }
    )
        .then(e => console.log("then"))
        .catch(e => console.log("catch"))
    console.log("Hier 3")
}

</script>

<template>
        <input ref="fileInput" type="file" />
        <button @click="upload">Upload file</button>
</template>

<style>

</style>