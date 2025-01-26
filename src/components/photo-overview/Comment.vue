<script setup>
import { useAuthStore } from '@/stores/auth.store';
import { useErrorStore } from '@/stores/errors.store';
import { useRouter } from 'vue-router';
import { isAdminOrAuthor } from '@/utils'
import { ref } from 'vue';
import ModalDialogButton from '@/components/utilities/ModalDialogButton.vue';

const props = defineProps(['commentData'])
const router = useRouter()
const modalDialogRef = ref(null)
const showModal = ref(false)

const errorStore = useErrorStore()
const authStore = useAuthStore()
const jwtToken = authStore.token

function deleteComment(commentId) {
    const requestOptions = {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        }
    fetch(`http://localhost:3000/comments/${commentId}`, requestOptions)
        .then(async response => {
            if (response.status === 200) {
                console.log("Success")
            } else if (response.status === 400) {
                console.log("Nicht so viel Success")
            }
            router.go()
        })
        .catch(err => {
            errorStore.setError(err)
        })
        .finally(() => {
            
        })
}
</script>

<template>
    <hr>
    <div class="comment-card">
        <div class="comment-content">
            <b>{{ props.commentData.author }}</b> {{ props.commentData.comment }} 
        </div>
        <div class="timestamp-buttons-container">
            <div class="timestamp-info">
                {{ new Date(props.commentData.commented_at * 1000).toLocaleString() }}
            </div>
            <div v-if="isAdminOrAuthor(props.commentData.users_id)" class="edit-delete-buttons">
                <img 
                    :id="'delete-button-' + props.commentData.id" 
                    @click="showModal = true"
                    src="../../../public/pngwing.com.png" 
                    width="20px" 
                    height="20px"
                >
            </div>
        </div>
    </div>
    <ModalDialogButton 
        v-if="showModal"
        ref="modalDialogRef"
        buttonColor="red"
        message="Kommentar wirklich löschen?" 
        @confirm="deleteComment(props.commentData.id)"
        @close="showModal = false"
    />
</template>

<style>

    .comment-card {
        margin-bottom: 15px;
        padding: 5px;
        width: 100%;
    }

    .comment-content {
        border-radius: 5px;
        padding: 5px;
        background-color: lightgrey;
    }
    
</style>