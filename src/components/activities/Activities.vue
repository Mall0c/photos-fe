<script setup lang="ts">
import { ref, onMounted, type Ref } from "vue"
import Table from '@/components/utilities/Table.vue';
import { formatTimestamp } from '@/utils'
import type { TComment } from "../photo-overview/Comment.vue";
import type { TImage } from "../guests-gallery/GuestsGallery.vue";

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
    fetch(`http://localhost:3000/activities/${type}`)
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
    fetchActivities("ownerGallery")
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
            <td>{{ comment.commented_at !== undefined ? formatTimestamp(comment.commented_at) : 0 }}</td>
            <td>{{ comment.users_id }}</td>
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
            <td>{{ image.uploaded_at !== undefined ? formatTimestamp(image.uploaded_at) : 0 }}</td>
            <td>{{ image.username }}</td>
            <td>{{ image.description }}</td>
            <td><router-link :to="'/guests-gallery/' + image.id">Bild anschauen</router-link></td>
        </tr>
    </Table>

    <!-- Adminbilder -->
    <Table
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