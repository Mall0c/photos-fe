<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { ref, useTemplateRef } from "vue"

const props = defineProps(['imageType'])

const authStore = useAuthStore()
const jwtToken = authStore.token
const fileInput = useTemplateRef("fileInput")

function upload() {
    const formData = new FormData()
    formData.append('image', fileInput.value.files[0])
    formData.append('type', props.imageType)
    formData.append('description', "Moin")
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
}

</script>

<template>
        <input ref="fileInput" type="file" />
        <button @click="upload">Upload file</button>
</template>

<style>

</style>