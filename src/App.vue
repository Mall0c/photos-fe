<script setup lang="ts">
import Navigation from '@/components/navigation/Navigation.vue'
import Notification from '@/components/utilities/Notification.vue';
import { useErrorStore } from './stores/errors.store';
import { storeToRefs } from 'pinia';

const errorStore = useErrorStore()
const { currentError } = storeToRefs(errorStore)

function onCloseNotification() {
    errorStore.setError(null)
}
</script>

<template>
    <div class="mother-container">
        <div class="notification-center">
            <Notification v-if="currentError" :notificationData="currentError" @closeNotification="onCloseNotification"></Notification>
        </div>
        <div class="nav-container">
            <Navigation></Navigation>
        </div>
        <div class="overall-container col-10">
            <router-view v-slot="{ Component }">
                <component :is="Component" />
            </router-view>
        </div>
    </div>
</template>

<style>

    /*
    .notification-center {

    }
    */

    .nav-container {
        padding: 25px 0px 25px 0px;
    }

    .mother-container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .overall-container::after {
        content: "";
        clear: both;
        display: table;
    }

    .debug {
        border: 1px solid red;
    }

    /* https://stackoverflow.com/a/4407335 */
    .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
            -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none; /* Non-prefixed version, currently
                                    supported by Chrome, Edge, Opera and Firefox */
    }

</style>