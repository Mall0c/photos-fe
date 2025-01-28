<script setup>
import { ref, computed, onBeforeMount, useTemplateRef } from 'vue';

const fileIds = ref(null)
const error = ref(null)
const dialogRef = useTemplateRef("dialog")
const dialogOpened = ref(false)

function toggleDialog(fileId) {
    if (dialogOpened.value === false) {
        dialogRef.value.showModal()
        dialogOpened.value = true
    } else {
        dialogRef.value.close()
        dialogOpened.value = false
    }
}

function closeModal(event) {
    if (!event.target.contains(dialogRef.value)) return;
    dialogRef.value.close()
}

/**
 * Fetch file names from backend.
 */
function fetchFileIds() {
    fetch("http://localhost:3000/images-by-guests")
        .then(res => res.json())
        .then(res => fileIds.value = res)
        .catch(err => error.value = err)
}

onBeforeMount(() => {
    fetchFileIds()
})
</script>

<template>
    <div class="image-container">
        <div v-for="fileId in fileIds" class="image-preview-box">
            <img :src="`http://localhost:3000/images/${fileId}`" @click="toggleDialog(fileId)" />
        </div>
    </div>
    <dialog class="dialog-box" ref="dialog" @click="closeModal">Moin</dialog>
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

.dialog-box {
    padding: 0;
}

.dialog-box::backdrop {
    background-color: rgba(148, 148, 148, 0.25);
}

</style>