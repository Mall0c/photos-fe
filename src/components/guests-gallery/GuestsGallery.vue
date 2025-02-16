<script setup>
import { ref, computed, onBeforeMount, useTemplateRef } from 'vue';
import CommentArea from '@/components/photo-overview/CommentArea.vue';
import UploadImage from '@/components/photo-overview/UploadImage.vue';

const imageIds = ref(null)
const error = ref(null)
const dialogRef = useTemplateRef("dialog")
const dialogOpened = ref(false)

const currentImageIdInDialog = ref(null)

/**
 * Open the dialog for a picture, that shows the picture in bigger resolution,
 * as well as more information like description, comments, uploader, etc.
 */
function openDialog(imageId) {
    if (dialogOpened.value === false) {
        dialogRef.value.showModal()
        dialogOpened.value = true
        currentImageIdInDialog.value = imageId
    }
}

/**
 * Close the dialog when the user clicks outside the dialog (on the backdrop)
 */
function closeDialog(event) {
    const rect = dialogRef.value.getBoundingClientRect();
    if (
        rect.top <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left <= event.clientX 
        && event.clientX <= rect.left + rect.width
    ) {
        // Do nothing
    } else {
        dialogRef.value.close()
        dialogOpened.value = false
        currentImageIdInDialog.value = null
    }
}

/**
 * Fetch file names from backend.
 */
function fetchImageIds() {
    fetch("http://localhost:3000/images-by-guests")
        .then(res => res.json())
        .then(res => imageIds.value = res)
        .catch(err => error.value = err)
}

onBeforeMount(() => {
    fetchImageIds()
})
</script>

<template>
    <UploadImage />
    <div v-if="imageIds" class="image-container">
        <div v-for="imageId in imageIds" class="image-preview-box">
            <img :src="`http://localhost:3000/images/scaled/${imageId}`" @click="openDialog(imageId)" />
        </div>
    </div>
    <dialog class="dialog-element" ref="dialog" @click="closeDialog">
        <div v-if="currentImageIdInDialog" class="dialog-container">
            <div class="dialog-container-picture">
                <img :src="`http://localhost:3000/images/${currentImageIdInDialog}`">
            </div>
            <div class="dialog-description">
                <KeepAlive>
                    <CommentArea :key="currentImageIdInDialog" :file="currentImageIdInDialog" />
                </KeepAlive>
            </div>
        </div>
    </dialog>
</template>

<style>

.image-container {
    margin-top: 5vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.image-preview-box {
    margin-left: 5vw;
    margin-right: 5vw;
    margin-bottom: 5vh;
    width: 25vh;
    height: 25vh;
}

.image-preview-box img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.dialog-container {
    padding: none;
    border: none;
    min-width: 30vw;
    background-color: rgba(148, 148, 148, 0.9);
}

.dialog-element {
    padding: 0;
    border: 0;
}

.dialog-container::backdrop {
    background-color: rgba(148, 148, 148, 0.25);
}

.dialog-container-picture {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    width: 50vw;
    height: 50vh;
}

.dialog-container-picture img {
    object-fit: cover;
    max-width: 90%;
    max-height: 90%;
}

.dialog-description {
    width: 100%;
    padding: 20px;
}

</style>