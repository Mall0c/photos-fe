<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue"
import Table from '@/components/utilities/Table.vue';
import { formatTimestamp } from '@/utils'
import type { TComment } from "../photo-overview/Comment.vue";
import type { TImage } from "../guests-gallery/GuestsGallery.vue";
import { useAuthStore } from '@/stores/auth.store';

// If userId is set, then Activities.vue is called from inside the Profile.vue component.
// That means, we want to fetch the data only for this user, and not the activities of the owner.
const props = defineProps<{userId?: number}>()
const authStore = useAuthStore()

type TActivities = {
    ownerGallery: Array<TImage>,
    guestGallery: Array<TImage>,
    comments: Array<TComment & { type: number }>
}

const error = ref(null)
const activities: Ref<TActivities> = ref(
    {
        "ownerGallery": [],
        "guestGallery": [],
        "comments": []
    }
)

/**
 * Fetch activities from backend.
 */
function fetchActivities(type: keyof TActivities) {
    let url = `http://localhost:3000/activities/${type}`
    const requestOptions: any = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }

    if (props.userId !== undefined) {
        url += `/${props.userId}`
        requestOptions.headers.Authorization = "Bearer " + authStore.jwtToken
    }

    fetch(url, requestOptions)
        .then(res => res.json())
        .then(res => activities.value[type] = res)
        .catch(err => error.value = err)
}

function getPathToGallery(imgType: number) {
    if (imgType === 0) {
        return "/gallery/"
    } else if (imgType === 1) {
        return "/guests-gallery/"
    }
    return "/"
}

onMounted(() => {
    if (props.userId === undefined) fetchActivities("ownerGallery")
    fetchActivities("guestGallery")
    fetchActivities("comments")
})
</script>

<template>
    <!-- Kommentare -->
    <Table
        tableTitle="Neuste Kommentare"
        tableColumns='["Uhrzeit", "Autor", "Kommentar", "Link"]'
    >
        <tr v-for="comment in activities.comments">
            <td>{{ formatTimestamp(comment.commented_at) }}</td>
            <td>{{ comment.author }}</td>
            <td>{{ comment.comment }}</td>
            <td><router-link :to="getPathToGallery(comment.type) + comment.image_id">Bild anschauen</router-link></td>
        </tr>
    </Table>

    <!-- Gästebilder -->
    <Table
        tableTitle="Neuste Gästebilder"
        tableColumns='["Uhrzeit", "Autor", "Beschreibung", "Link"]'
    >
        <tr v-for="image in activities.guestGallery">
            <td>{{ formatTimestamp(image.uploaded_at) }}</td>
            <td>{{ image.username }}</td>
            <td>{{ image.description }}</td>
            <td><router-link :to="'/guests-gallery/' + image.id">Bild anschauen</router-link></td>
        </tr>
    </Table>

    <!-- Adminbilder -->
    <Table
        v-if="$props.userId === undefined"
        tableTitle="Neuste Bilder, die das Brautpaar hochgeladen hat"
        tableColumns='["Uhrzeit", "Beschreibung", "Link"]'
    >
        <tr v-for="image in activities.ownerGallery">
            <td>{{ formatTimestamp(image.uploaded_at) }}</td>
            <td>{{ image.description }}</td>
            <td><router-link :to="'/gallery/' + image.id">Bild anschauen</router-link></td>
        </tr>
    </Table>
</template>

<style>

</style>