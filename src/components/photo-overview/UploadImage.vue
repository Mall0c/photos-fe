<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { ref, useTemplateRef, type Ref } from "vue"
import { useRouter } from 'vue-router';
import { getAPIURL } from '@/utils'

const router = useRouter()

const props = defineProps<{imageType: string}>()
const imageDescription = defineModel<string>("imageDescription")

const authStore = useAuthStore()
const jwtToken = authStore.token
const fileInput = useTemplateRef<HTMLInputElement>("fileInput")

const imageUploadDialogRef = useTemplateRef<HTMLDialogElement>("image-upload-dialog")
const imageUploadDialogOpened: Ref<boolean> = ref(false)

function upload() {
    if (fileInput.value?.files?.[0] !== undefined && imageDescription.value !== undefined) {
        const formData = new FormData()
        formData.append('image', fileInput.value?.files[0])
        formData.append('type', props.imageType.toString())
        formData.append('description', imageDescription.value)
        fetch(`${getAPIURL()}/api/images-by-guests`, 
            {
                method: "POST",
                body: formData,
                headers: { 
                    "X-Auth-Token": "Bearer " + jwtToken
                }
            }
        )
            .then(e => {
                router.go(0)
            })
            .catch(e => console.log(e))
    }
}

/**
 * Open the dialog for a picture, that shows the picture in bigger resolution,
 * as well as more information like description, comments, uploader, etc.
 */
function openImageUploadDialog() {
    if (imageUploadDialogOpened.value === false) {
        imageUploadDialogRef.value?.showModal()
        imageUploadDialogOpened.value = true
    }
}

/**
 * Close the dialog when the user clicks outside the dialog (on the backdrop)
 */
function closeImageUploadView(event: MouseEvent) {
    const rect = imageUploadDialogRef.value?.getBoundingClientRect();
    if (
        rect !== undefined
        && rect.top <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left <= event.clientX 
        && event.clientX <= rect.left + rect.width
    ) {
        // Do nothing
    } else {
        imageUploadDialogRef.value?.close()
        imageUploadDialogOpened.value = false
    }
}

defineExpose({ openImageUploadDialog })

</script>

<template>
    <dialog class="image-detail-view-container" ref="image-upload-dialog" @click="closeImageUploadView">
        <div class="image-detail-view-element">
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
        </div>
    </dialog>
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

    .image-upload-btn-container {
        display: flex;
        justify-content: center;
    }

</style>