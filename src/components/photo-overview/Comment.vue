<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';
import { useErrorStore } from '@/stores/errors.store';
import { useRouter } from 'vue-router';
import { isAdminOrAuthor } from '@/utils'
import { ref, type Ref } from 'vue';
import ModalDialogButton from '@/components/utilities/ModalDialogButton.vue';
import { getAPIURL } from '@/utils';

export type TComment = {
    id?: number
    users_id?: number
    image_id?: number
    commented_at?: number
    comment?: string
    author?: string
}

const props = defineProps<{
    commentData: TComment
}>()
const router = useRouter()
const modalDialogRef: Ref<typeof ModalDialogButton | null> = ref(null)
const showModal: Ref<boolean> = ref(false)

const errorStore = useErrorStore()
const authStore = useAuthStore()
const jwtToken = authStore.token

function deleteComment(commentId: number) {
    const requestOptions = {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "X-Auth-Token": "Bearer " + jwtToken
            }
        }
    fetch(`${getAPIURL()}/api/comments/${commentId}`, requestOptions)
        .then(async response => {
            if (response.status === 200) {
                console.log("Success")
            } else if (response.status === 400) {
                console.log("Nicht so viel Success")
            }
            router.go(0)
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
            <div class="timestamp-info" v-if="props.commentData.commented_at !== undefined">
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
        v-if="showModal && props.commentData.id !== undefined"
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