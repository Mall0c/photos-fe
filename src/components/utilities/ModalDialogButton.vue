<script setup lang="ts">
import { onMounted } from 'vue';

const emit = defineEmits(['confirm', 'close'])
const props = defineProps(['message', 'buttonColor'])
const textareaContent = defineModel<string>('dataTextarea')

onMounted(() => {
    // From https://www.w3schools.com/howto/howto_css_modals.asp
    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0] as HTMLSpanElement;

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        emit('close')
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            emit('close')
        }
    }
})
</script>

<!-- This component serves as a modal dialog that has a text and a button. Clicking this button emits an event that
the parent component can listen on. -->
<template>

<div id="myModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            {{ props.message }} <span class="close">&times;</span>
        </div>
        <div v-if="textareaContent">
            <textarea 
                v-model="textareaContent"
                class="textarea-input"
            >
            </textarea>
            <br />
            <button 
                @click="emit('confirm', textareaContent)" 
                class="confirm-button" 
                :style="{ 'background-color': props.buttonColor }"
            >
                Bestätigen
            </button>
        </div>
        <div v-else>
            <button 
                @click="emit('confirm')" 
                class="confirm-button" 
                :style="{ 'background-color': props.buttonColor }"
            >
                Bestätigen
            </button>
        </div>
    </div>
</div>

</template>

<style>

    .confirm-button {
        color: white;
        padding: 10px;
        border-radius: 5px;
    }

    /* The Modal (background) */
    .modal {
        display: block; /* Hidden by default */
        position: fixed; /* Stay in place */
        z-index: 1; /* Sit on top */
        padding-top: 100px; /* Location of the box */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto; /* Enable scroll if needed */
        background-color: rgb(0,0,0); /* Fallback color */
        background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
    }

    /* Modal Content */
    .modal-content {
        background-color: #fefefe;
        margin: auto;
        padding: 20px;
        border: 1px solid #888;
        width: 20%;
    }

    .modal-header {
        display: flex;
        font-weight: bold;
        justify-content: space-between;
        align-items: center;
    }

    /* The Close Button */
    .close {
        text-align: right;
        color: #aaaaaa;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }

</style>