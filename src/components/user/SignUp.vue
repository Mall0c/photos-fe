<script setup lang="ts">
import Login from "@/components/user/Login.vue"
import Register from "@/components/user/Register.vue"

</script>

<template>
    <Login></Login>
    <Register></Register>
</template>

<style>

.outer-container {
    display: flex;
    height: 50%;
    align-items: center;
    justify-content: center;
}

.input-container {
    border: 1px solid red;
    width: 30%;
    display: flex;
    flex-flow: wrap;
    justify-content: center;
}

.input-field-title {
    font-size: 20px;
}

.input-container hr {
    width: 100%;
    flex-basis: 100%;
    height: 0;
    margin: 0;
    border: 0;
}

.input-field {
    border: 1px solid green;
}

</style>