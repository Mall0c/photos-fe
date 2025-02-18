<script setup>
import { ref, computed, onBeforeMount, useTemplateRef } from 'vue';
import CommentArea from '@/components/photo-overview/CommentArea.vue';
import UploadImage from '@/components/photo-overview/UploadImage.vue';

const imageIds = ref(null)
const error = ref(null)
const imageDetailDialogRef = useTemplateRef("image-detail-dialog")
const imageDetailDialogOpened = ref(false)
const currentImageIdInDialog = ref(null)

const imageUploadDialogRef = useTemplateRef("image-upload-dialog")
const imageUploadDialogOpened = ref(false)

/**
 * Open the dialog for a picture, that shows the picture in bigger resolution,
 * as well as more information like description, comments, uploader, etc.
 */
function openImageDetailDialog(imageId) {
    if (imageDetailDialogOpened.value === false) {
        imageDetailDialogRef.value.showModal()
        imageDetailDialogOpened.value = true
        currentImageIdInDialog.value = imageId
    }
}

/**
 * Open the dialog for a picture, that shows the picture in bigger resolution,
 * as well as more information like description, comments, uploader, etc.
 */
function openImageUploadDialog() {
    if (imageUploadDialogOpened.value === false) {
        imageUploadDialogRef.value.showModal()
        imageUploadDialogOpened.value = true
    }
}

/**
 * Close the dialog when the user clicks outside the dialog (on the backdrop)
 */
function closeImageDetailView(event) {
    const rect = imageDetailDialogRef.value.getBoundingClientRect();
    if (
        rect.top <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left <= event.clientX 
        && event.clientX <= rect.left + rect.width
    ) {
        // Do nothing
    } else {
        imageDetailDialogRef.value.close()
        imageDetailDialogOpened.value = false
        currentImageIdInDialog.value = null
    }
}

/**
 * Close the dialog when the user clicks outside the dialog (on the backdrop)
 */
function closeImageUploadView(event) {
    const rect = imageUploadDialogRef.value.getBoundingClientRect();
    if (
        rect.top <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left <= event.clientX 
        && event.clientX <= rect.left + rect.width
    ) {
        // Do nothing
    } else {
        imageUploadDialogRef.value.close()
        imageUploadDialogOpened.value = false
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
    <!-- Image upload -->
    <b @click="openImageUploadDialog">Upload image</b>
    <dialog class="image-detail-view-container" ref="image-upload-dialog" @click="closeImageUploadView">
        <div class="image-detail-view-element">
            <UploadImage imageType="1"/>
        </div>
    </dialog>
    <div class="content">
        <div v-if="imageIds" class="image-container">
            <div v-for="imageId in imageIds" class="image-preview-box">
                <img :src="`http://localhost:3000/images/scaled/${imageId}`" @click="openImageDetailDialog(imageId)" />
            </div>
        </div>
    </div>
    <!-- Image detail view -->
    <dialog class="image-detail-view-container" ref="image-detail-dialog" @click="closeImageDetailView">
        <div v-if="currentImageIdInDialog" class="image-detail-view-element">
            <div class="image-detail-view">
                <img :src="`http://localhost:3000/images/${currentImageIdInDialog}`">
            </div>
            <div class="image-description">
                <KeepAlive>
                    <CommentArea :key="currentImageIdInDialog" :file="currentImageIdInDialog" />
                </KeepAlive>
            </div>
        </div>
    </dialog>
</template>

<style>

.content {
    display: flex;
    justify-content: center;
}

.image-container {
    width: 80%;
    margin-top: 5vh;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
}

.image-preview-box {
    margin-left: 5vw;
    margin-right: 5vw;
    margin-bottom: 5vh;
    width: 200px;
    height: 200px;
}

.image-preview-box img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.image-detail-view-element {
    padding: none;
    border: none;
    min-width: 30vw;
    background-color: rgba(148, 148, 148, 0.9);
}

.image-detail-view-container {
    padding: 0;
    border: 0;
}

.image-detail-view-container::backdrop {
    background-color: rgba(148, 148, 148, 0.25);
}

.image-detail-view {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: black;
    width: 50vw;
    height: 50vh;
}

.image-detail-view img {
    object-fit: cover;
    max-width: 90%;
    max-height: 90%;
}

.image-description {
    width: 100%;
    padding: 20px;
}

</style>