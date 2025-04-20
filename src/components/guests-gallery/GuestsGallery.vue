<script setup lang="ts">
import { ref, onBeforeMount, useTemplateRef, watch, type Ref } from 'vue';
import CommentArea from '@/components/photo-overview/CommentArea.vue';
import UploadImage from '@/components/photo-overview/UploadImage.vue';
import { useRoute, useRouter } from 'vue-router'
import { getAPIURL, getParentPath } from '@/utils'

export type TImage = {
    id?: number
    users_id?: number
    uploaded_at?: number
    description?: string
    filename?: string
    type?: number
    username?: string
}

const route = useRoute()
const router = useRouter()
const imageIds: Ref<Array<number> | null> = ref(null)
const error = ref(null)
const imageDetailDialogRef = useTemplateRef<HTMLDialogElement>("image-detail-dialog")
const uploadImageComponent = useTemplateRef<typeof UploadImage>("uploadImageComponent")
const imageDetailDialogOpened: Ref<boolean> = ref(false)
const currentImageIdInDialog: Ref<number | null> = ref(null)

/**
 * Open the dialog for a picture, that shows the picture in bigger resolution,
 * as well as more information like description, comments, uploader, etc.
 */
function openImageDetailDialog(imageId?: number) {
    if (typeof imageId !== "number") {
        return
    }
    if (imageDetailDialogOpened.value === false) {
        imageDetailDialogRef.value?.showModal()
        imageDetailDialogOpened.value = true
        currentImageIdInDialog.value = imageId
    }
}

/**
 * Close the dialog when the user clicks outside the dialog (on the backdrop)
 */
function closeImageDetailView(event: MouseEvent) {
    const rect = imageDetailDialogRef.value?.getBoundingClientRect();
    if (
        rect !== undefined
        && rect.top <= event.clientY 
        && event.clientY <= rect.top + rect.height 
        && rect.left <= event.clientX 
        && event.clientX <= rect.left + rect.width
    ) {
        // Do nothing
    } else {
        imageDetailDialogRef.value?.close()
        imageDetailDialogOpened.value = false
        currentImageIdInDialog.value = null
    }
}

/**
 * Fetch file names from backend.
 */
function fetchImageIds() {
    fetch(`${getAPIURL()}/api/images-by-guests`)
        .then(res => res.json())
        .then(res => {
            imageIds.value = res
            if (typeof route.params.imgId === "string" && route.params.imgId !== "") {
                const imageIndex = imageIds.value?.indexOf(parseInt(route.params.imgId)) ?? -1
                if (imageIndex > -1) {
                    openImageDetailDialog(imageIds.value?.[imageIndex])
                } else {
                    const parentPath = route.fullPath
                        .split('/')
                        .slice(0, -1)
                        .join('/')
                    
                    router.replace(parentPath)
                }
            }
        })
        .catch(err => error.value = err)
}

onBeforeMount(() => {
    fetchImageIds()
})

watch(currentImageIdInDialog, (newVal, oldVal) => {
    // TODO Remove hard coded path, and replace with utils.getParentPath()
    let path = "/guests-gallery"
    if (newVal !== null) {
        path += "/" + currentImageIdInDialog.value
    }
    router.replace(path)
})

</script>

<template>
    <!-- Image upload -->
    <UploadImage imageType="1" ref="uploadImageComponent"/>
    <!-- Main content -->
    <div class="content">
        <div class="image-upload-btn-container">
            <b @click="uploadImageComponent?.openImageUploadDialog">Bild hochladen</b>
        </div>
        <div v-if="imageIds" class="image-container">
            <div v-for="imageId in imageIds" class="image-preview-box">
                <img :src="`${getAPIURL()}/api/images/scaled/${imageId}`" @click="openImageDetailDialog(imageId)" />
            </div>
        </div>
    </div>
    <!-- Image detail view -->
    <dialog class="image-detail-view-container" ref="image-detail-dialog" @click="closeImageDetailView">
        <div v-if="currentImageIdInDialog" class="image-detail-view-element">
            <div class="image-detail-view">
                <img :src="`${getAPIURL()}/api/images/${currentImageIdInDialog}`">
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
        flex-direction: column;
        align-items: center;
    }

    .image-container {
        width: 80%;
        margin-top: 5vh;
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
    }

    .image-preview-box {
        margin-left: 5%;
        margin-right: 5%;
        margin-bottom: 5vh;
        width: 23.33%;
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