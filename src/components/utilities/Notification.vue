<script setup lang="ts">

const props = defineProps<{
    notificationData: string
}>()

const emit = defineEmits(['closeNotification'])
</script>

<template>

<div class="notification-container">
    <span @click="emit('closeNotification')" class="notification-element notification-element-icon">
        <img width="30px" height="30px" src="../../../public/error-10376.png" />
    </span>
    <span class="notification-element notification-element-text">
        Fehler: {{ props.notificationData }}
    </span>
    <span @click="emit('closeNotification')" class="notification-element-icon">
        <img width="30px" height="30px" src="../../../public/211652_close_icon.png" />
    </span>
</div>

</template>

<style>

    .notification-element {
        margin-left: 0px;
    }

    /**
     * Mit flex-grow kann man bestimmen, wie viel Platz die Elemente bekommen. 
     * Da wir zwei .notification-element-icon und ein .notification-element-text Elemente
     * haben, bekommen die jeweils 10%, 80% und 10% des Platzes (der Breite).
     */
    .notification-element-icon {
        display: flex;
        justify-content: center;
        flex-grow: 1
    }

    .notification-element-text {
        flex-grow: 8
    }

    .notification-container {
        display: flex;
        align-items: center;
        align-content: center;
        position: absolute;
        transform: translate(-50%, 0%);
        width: 400px;
        height: 50px;
        background-color: red;
    }

</style>