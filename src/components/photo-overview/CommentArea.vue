<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { watch, onMounted, computed } from 'vue';
import { debounce } from '@/utils'
import Comment from './Comment.vue'
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';
import { isAdminOrAuthor } from '@/utils'
import ModalDialogButton from '@/components/utilities/ModalDialogButton.vue';
import type { TComment } from '@/components/photo-overview/Comment.vue'

type TImageData = {
    id: number
    description: string
    timestamp: number
    uploader: string
    uploaderId: number
}

const errorStore = useErrorStore()
const authStore = useAuthStore()
const router = useRouter()

const comments: Ref<Array<TComment>> = ref([])
const commentMessage = defineModel<string>("commentMessage")
const imageData: Ref<TImageData | null> = ref(null)
const truncatedDescription: Ref<string> = ref("")
const isTruncated: Ref<boolean> = ref(true)
const currentImage = defineProps<{file?: number}>()
const commentPagination: Ref<number> = ref(0)
const jwtToken = authStore.token

// TODO Check: modalDialogDeleteImage and modalDialogEditDescription are never used. Can they be removed?
const modalDialogDeleteImage: Ref<typeof ModalDialogButton | null> = ref(null)
const modalDialogEditDescription: Ref<typeof ModalDialogButton | null> = ref(null)
const showModalDeleteImage: Ref<boolean> = ref(false)
const showModalEditDescription: Ref<boolean> = ref(false)

const TRUNCATE_LEN = 100

const hasTextBeenTruncated = computed(() => {
    return imageData.value !== null 
        && imageData.value.description.length >= TRUNCATE_LEN 
        && imageData.value.description.length !== truncatedDescription.value.length - 3
})

function truncateText(text: string) {
    return text.slice(0, TRUNCATE_LEN) + "..."
}
/**
 * Fetch comments from backend.
 */
function fetchImageData(imageUuid: number | undefined, page: number) {
    fetch(`http://localhost/api/comments/${imageUuid}/${page}`)
        .then(res => res.json())
        .then(res => {
            res.forEach((comment: TComment) => {
                comments.value.push(comment)
            })
        })
        .catch(err => errorStore.setError(err))

    fetch(`http://localhost/api/images/metadata/${imageUuid}`)
        .then(res => res.json())
        .then(res => {
            imageData.value = res
            if (imageData.value !== null) {
                truncatedDescription.value = truncateText(imageData.value.description)
            }
            // Check if the text is truncated, or not. If not, there is no reason to show the text
            // "mehr anzeigen" in the description.
            if (hasTextBeenTruncated.value === false) {
                isTruncated.value = false
            }
        })
        .catch(err => errorStore.setError(err))
}

// https://stackoverflow.com/a/71185823
function scrollDetectBottomOfDiv(e: Event) {
    const { scrollTop, offsetHeight, scrollHeight } = e.target as HTMLDivElement
    if((scrollTop + offsetHeight) >= scrollHeight) {
        commentPagination.value++
        fetchImageData(currentImage.file, commentPagination.value)
    }
}

// Aus irgendeinem Grunde kann man "debounce(scrollDetectBottomOfDiv, 500)" nicht direkt im Template unten angeben.
// Stattdessen muss das hier als Variable definiert werden, und diese Variable als Callback im scroll Event
// angeben, dann gehts.
const debouncedCb = debounce(scrollDetectBottomOfDiv, 500, false)

function submitComment() {
    if (jwtToken) {
        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": "Bearer " + jwtToken
            },
            body: JSON.stringify({ comment: commentMessage.value })
        }
        fetch(`http://localhost/api/comments/${currentImage.file}`, requestOptions)
            .then(async response => {
                const responseParsed = await response.json()
                if (response.status === 201) {
                    comments.value.push(responseParsed)
                    commentMessage.value = ""
                } else if (response.status === 400) {
                    if (responseParsed.errorcode === 1) {
                        errorStore.setError("Ungültiger Kommentar.")
                    } else if (responseParsed.errorcode === 2) {
                        errorStore.setError("Kommentar ist leer.")
                    } else if (responseParsed.errorcode === 3) {
                        errorStore.setError("Kommentar ist zu lang.")
                    }
                }
            })
            .catch(err => {
                errorStore.setError(err)
            })
    } else {
        console.log("Will not submit comment. Not logged in.")
    }
}

function editDescription(imgId: number, newDesc: string) {
    showModalEditDescription.value = false
    if (jwtToken) {
        const requestOptions = {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": "Bearer " + jwtToken
            },
            body: JSON.stringify({ description: newDesc })
        }
        fetch(`http://localhost/api/images/description/${imgId}`, requestOptions)
            .then(async response => {
                if (response.status === 200 && imageData.value?.description) {
                    truncatedDescription.value = truncateText(imageData.value.description)
                } else if (response.status === 400) {
                    console.log(response)
                }
            })
            .catch(err => {
                errorStore.setError(err)
            })
    } else {
        console.log("Will not edit comment. Not logged in.")
    }
}

function deleteImage(imgId: number) {
    showModalDeleteImage.value = false
    if (jwtToken) {
        const requestOptions = {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": "Bearer " + jwtToken
            }
        }
        fetch(`http://localhost/api/images/${imgId}`, requestOptions)
            .then(async response => {
                if (response.status === 200) {
                    router.go(0)
                } else if (response.status === 400) {
                    console.log(response)
                }
            })
            .catch(err => {
                errorStore.setError(err)
            })
    } else {
        console.log("Will not delete image. Not logged in.")
    }
}

/**
 * Initial load of comments.
 */
onMounted(() => {
    fetchImageData(currentImage.file, commentPagination.value)
})

/**
 * When the selected image changes, we need to update the states, like getting the comments.
 */
watch(currentImage, (newVal, oldVal) => {
    fetchImageData(currentImage.file, commentPagination.value)
})

</script>

<template>
    <div v-if="imageData">
        <div class="description-comment-container">
            <div class="description">
                <div><b>{{ imageData.uploader }} &nbsp;</b>
                    <!-- Description. -->
                    <span v-if="isTruncated === false">{{ imageData.description }} 
                        <span v-if="hasTextBeenTruncated" @click="isTruncated = true" class="collapse-expand-description-hint">weniger anzeigen</span>
                    </span>
                    <span v-if="isTruncated === true">{{ truncatedDescription }} {{ imageData.description.length }}
                        <span @click="isTruncated = false" class="collapse-expand-description-hint">mehr anzeigen</span>
                    </span>
                </div>
                <!-- Time info when image was uploaded. -->
                <div class="timestamp-buttons-container">
                    <div class="timestamp-info">
                        {{ new Date(imageData.timestamp * 1000).toLocaleString() }}
                    </div>
                    <!-- Edit and delete button of description. -->
                    <div v-if="isAdminOrAuthor(imageData.uploaderId)" class="edit-delete-buttons">
                        <img 
                            @click="showModalEditDescription = true"
                            src="../../../public/edit-icon-png-3602.png" 
                            width="20px" 
                            height="20px"
                        >
                        <img 
                            @click="showModalDeleteImage = true"
                            src="../../../public/pngwing.com.png" 
                            width="20px" 
                            height="20px"
                        >
                    </div>
                </div>
            </div>
            <div class="comment-container" @scroll="debouncedCb">
                <Comment 
                    v-for="(commentData, idx) in comments"
                    :key = idx
                    :commentData = commentData
                />
            </div>
        </div>
        <hr>
        <div class="new-comment-container">
            <textarea
                class="textarea-input" 
                v-model="commentMessage" 
                :placeholder= "jwtToken ? 'Neuer Kommentar' : 'Melde dich an, um einen Kommentar zu schreiben.'"
                :readonly="jwtToken ? false : true"
                @keydown.enter.prevent="submitComment"
            >
            </textarea>
            <span v-if="jwtToken" class="send-new-comment" @click="submitComment">&#x27A4;</span>
        </div>
    </div>
    <div v-else class="image-info-container">
        Warten auf Kommentare...
    </div>
    <ModalDialogButton
        v-if="showModalEditDescription && imageData !== null"
        ref="modalDialogEditDescription"
        message="Beschreibung bearbeiten"
        buttonColor="green"
        v-model:dataTextarea="imageData.description"
        @confirm="newDesc => { if(imageData !== null) { editDescription(imageData.id, newDesc) } }"
        @close="showModalEditDescription = false"
    />
    <ModalDialogButton
        v-if="showModalDeleteImage && imageData !== null"
        ref="modalDialogDeleteImage"
        buttonColor="red"
        message="Bild wirklich löschen?"
        @confirm="deleteImage(imageData.id)"
        @close="showModalDeleteImage = false"
    />
</template>

<style>

    .description-comment-container {
        height: 100%;
        overflow-y: scroll;
    }

    .description {
        margin-bottom: 15px;
    }

    .comment-container {
        overflow-y: scroll;
        margin-bottom: 15px;
    }

    .new-comment-container {
        padding-top: 5px;
        width: 100%;
        height: 10%;
        display: flex;
    }

    .send-new-comment {
        width: 20%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 45px;
    }

    .timestamp-buttons-container {
        display: flex;
    }

    .timestamp-info {
        color: darkslategray;
        width: 80%;
        display: flex;
    }

    .edit-delete-buttons {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .collapse-expand-description-hint {
        color: blue;
    }

</style>