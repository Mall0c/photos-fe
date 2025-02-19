<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { ref, useTemplateRef } from "vue"
import { useRouter } from 'vue-router';

const router = useRouter()

const props = defineProps(['imageType'])
const imageDescription = defineModel("imageDescription")

const authStore = useAuthStore()
const jwtToken = authStore.token
const fileInput = useTemplateRef("fileInput")

function upload() {
    console.log("Hier")
    const formData = new FormData()
    formData.append('image', fileInput.value.files[0])
    formData.append('type', props.imageType)
    formData.append('description', imageDescription.value)
    fetch(`http://localhost:3000/images-by-guests`, 
        {
            method: "POST",
            body: formData,
            headers: { 
                "Authorization": "Bearer " + jwtToken
            }
        }
    )
        .then(e => {
            router.go()
        })
        .catch(e => console.log(e))
}

</script>

<template>
    <div class="image-upload-container">
        <div class="image-upload-file-selection">
            <label for="image-upload-input" class="dialog-btn-upload">Bild auswählen</label>
            <input ref="fileInput" type="file" id="image-upload-input" style="display: none;"/>
        </div>
        <div class="image-upload-description">
        Beschreibung hinzufügen
            <textarea
                class="textarea-input"
                v-model="imageDescription"
            >
            </textarea>
        </div>
        <div class="image-upload-button">
            <button class="dialog-btn-upload" @click="upload">Upload file</button>
        </div>
    </div>
</template>

<style>

.image-upload-container {
    padding: 20px;
}

.image-upload-button, .image-upload-description {
    padding-top: 15px;
}

.dialog-btn-upload {
    color: #04AA6D;
    background-color: white;
    border: 0px;
    padding: 10px;
    font-weight: bold;
    font-size: 14px;
    border-radius: 5px;
    box-shadow: 0 0 3px black;
}

</style>