<script setup lang="ts">

</script>

<template>
    <div class="landing-page-container">
        <div class="box">
            <p class="landing-page-headline">Unsere Katzen heißen Dich willkommen.</p>
            <p>Schön, dass Du den Weg zu unserer Website gefunden hast. Neben unseren Fotos können Gäste
            auch Bilder ihrer eigenen Katzen hochladen und somit mit uns teilen. Wir würden uns sehr darüber freuen.</p>
            <p>Viel Freude beim Stöbern in den Bildern.</p>
            <p>Richard</p>
        </div>
        <div class="box"><img :src="`http://localhost/api/images/2475`"></div>
    </div>
</template>

<style>
    .landing-page-container {
        display: grid;
        grid-template-columns: 1fr 1fr; /* Creates two equal columns */
        justify-items: center;
    }

    .box {
        padding: 10px;
    }

    .landing-page-headline {
        font-weight: bold;
    }

    .box img {
        max-width: 80vh;
        max-height: 80vh;
    }
</style>