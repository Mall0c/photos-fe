<script setup>
import { ref, computed, onBeforeMount } from 'vue';

const fileIds = ref(null)
const error = ref(null)

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
            <img :src="`http://localhost:3000/images/${fileId}`" />
        </div>
    </div>
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

</style>