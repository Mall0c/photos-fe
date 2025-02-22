<script setup>
import { ref, computed, onBeforeMount, useTemplateRef } from 'vue';
import CommentArea from './CommentArea.vue'
import { useAuthStore } from '@/stores/auth.store';
import UploadImage from '@/components/photo-overview/UploadImage.vue';

// This contains the image ids that are used in the database.
const imageIds = ref(null)
const error = ref(null)
const pageNumber = ref(0)

// This value starts at 0. It says, which image is currently shown.
const currentImageNumber = ref(0)
const imgPerPage = 5
const uploadImageComponent = useTemplateRef("uploadImageComponent")

const authStore = useAuthStore()

const currentImage = computed(() => {
    return imageIds.value[currentImageNumber.value]
})

/**
 * Change the currently displayed main image.
 * @param {Number} val 
 */
function alterCurrentImage(val) {
    if (val === -1) {
        if (currentImageNumber.value === 0) {
            /* Do nothing. */
        } else {
            currentImageNumber.value--
        }
    } else if (val === 1) {
        currentImageNumber.value++
    }

    // Switch page of image preview if necessary.
    if (currentImageNumber.value % imgPerPage === 9 && val === -1) {
        alterPageNumber(-1)
    }
    else if (currentImageNumber.value % imgPerPage === 0 && val === 1) {
        alterPageNumber(1)
    }
}

/**
 * Change the currently displayed page number in the photo preview.
 * @param {Number} val 
 */
function alterPageNumber(val) {
    if (val === -1) {
        if (pageNumber.value === 0) {
            /* Do nothing. */
        } else {
            pageNumber.value--
        }
    } else if (val === 1) {
        pageNumber.value++
    }
}

/**
 * Fetch file names from backend.
 */
function fetchimageIds() {
    fetch("http://localhost:3000/images")
        .then(res => res.json())
        .then(res => imageIds.value = res)
        .catch(err => error.value = err)
}

onBeforeMount(() => {
    fetchimageIds()
})
</script>

<template>
    <!-- Image upload -->
    <UploadImage imageType="0" ref="uploadImageComponent"/>
    <!-- Main content -->
    <div v-if="imageIds" class="main-container">
        <!-- Big photo + comments -->
        <div class="interaction-container">
            <div class="slide-image-arrow noselect col-1">
                <div @click="alterCurrentImage(-1)">&#8592;</div>
            </div>
            <div class="big-photo-container col-7">
                <img :src="`http://localhost:3000/images/${imageIds[currentImageNumber]}`" />
            </div>
            <div class="slide-image-arrow noselect col-1">
                <div @click="alterCurrentImage(1)">&#8594;</div>
            </div>
            <div class="image-info-container col-3">
                <KeepAlive>
                    <CommentArea :key="currentImage" :file="currentImage"/>
                </KeepAlive>
            </div>
        </div>
        <!-- Photo slides on the bottom -->
        <div class="photo-slide-container">
            <div 
                v-for="(file, idx) in imageIds.slice(pageNumber * imgPerPage, (pageNumber + 1) * imgPerPage)" 
                class="photo-preview"
            >
                <img :src="`http://localhost:3000/images/scaled/${file}`" @click="currentImageNumber = (pageNumber * imgPerPage) + idx" />
            </div>
        </div>
        <!-- Pagination + image upload -->
        <div class="pagination-text noselect">
            <span @click="alterPageNumber(-1)">
                Vorherige Seite
            </span>
            <!-- Stop pagination after all images were shown. -->
            <span
                v-if="Math.floor(imageIds.length / imgPerPage) > pageNumber"
                @click="alterPageNumber(1)"
            >
                &nbsp;| Nächste Seite
            </span>
        </div>
        <div class="pagination-text">
            Seite {{ pageNumber + 1 }} / {{Math.ceil(imageIds.length / imgPerPage)}}
        </div>
        <div v-if="authStore.isAdmin" class="image-upload-btn-container">
            <b @click="uploadImageComponent.openImageUploadDialog">Bild hochladen</b>
        </div>
    </div>
    <div v-else-if="error">
        {{ error }}
    </div>
    <div v-else>
        Still loading....
    </div>
</template>

<style>

@media only screen and (min-width: 768px) {
    .interaction-container {
        display: flex;
        height: 70%;
        justify-content: center;
        align-items: center;
    }

    .big-photo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .big-photo-container img {
        object-fit: contain;
        width: 100%;
        height: 100%;
        max-width: 800px;
        max-height: 500px;
    }

    .slide-image-arrow {
        height: 100%;
        font-size: 50px;
    }

    .image-info-container {
        height: 55vh;
        border: 1px solid black;
        overflow-y: scroll;
    }
}

@media only screen and (max-width: 768px) {
    .interaction-container {
        height: 100%;
    }

    .big-photo-container {
        float: left;
        height: 100%;
    }

    .big-photo-container img {
        object-fit: contain;
        max-height: 100vh;
        width: 100vw;
    }

    .slide-image-arrow {
        display: none;
    }

    .main-container::after, .interaction-container::after {
        content: "";
        clear: both;
        display: table;
    }
}

.image-info-container {
    padding: 20px;
}

.photo-slide-container {
    height: 25vh;
}

.pagination-text {
    height: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.photo-preview {
    width: 20%;
    display: inline-block;
    height: 100%;
}

.photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

</style>