<script setup lang="ts">
import Login from "@/components/user/Login.vue"
import Register from "@/components/user/Register.vue"

</script>

<template>
    <Login></Login>
    <hr>
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
    border: 0px solid red;
    width: 30%;
    padding: 10px;
    display: flex;
    flex-flow: wrap;
    justify-content: center;
}

.input-field-title {
    font-size: 20px;
    padding: 5px 0 5px 0;
}

.text-input {
    background-color: rgb(236, 236, 236);
    padding: 5px;
}

.signup-button {
    padding: 10px;
    margin-top: 10px;
    background-color: blue;
    color: white;
    font-weight: bold;
    border: 0px;
    border-radius: 5px;
}

</style>