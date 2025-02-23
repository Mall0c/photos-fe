<script setup>
import { ref, onMounted } from "vue"
import Table from '@/components/utilities/Table.vue';

const error = ref(null)
const activities = ref({
    "owner-gallery": [],
    "guest-gallery": [],
    "comments": []
})

/**
 * Fetch activities from backend.
 */
function fetchActivities(type) {
    fetch(`http://localhost:3000/activities/${type}`)
        .then(res => res.json())
        .then(res => activities.value[type] = res)
        .catch(err => error.value = err)
}

onMounted(() => {
    fetchActivities("owner-gallery")
    fetchActivities("guest-gallery")
    fetchActivities("comments")
})
</script>

<template>
Aktivitäten

    <!-- Kommentare -->
    <Table
        tableTitle="Neuste Kommentare"
        tableColumns='["Uhrzeit", "Autor", "Kommentar"]'
    >
        <tr v-for="comment in activities.comments">
            <td>{{ comment.commented_at }}</td>
            <td>{{ comment.users_id }}</td>
            <td>{{ comment.comment }}</td>
        </tr>
    </Table>

    <!-- Gästebilder -->

    <!-- Adminbilder -->

</template>

<style>

</style>