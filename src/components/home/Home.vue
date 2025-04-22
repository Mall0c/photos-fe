<script setup lang="ts">
import { getAPIURL } from "@/utils"

const COVER_IMAGE = import.meta.env.VITE_COVER_IMAGE
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
        <div class="box"><img :src="`${getAPIURL()}/api/images/${COVER_IMAGE}`"></div>
    </div>
</template>

<style>
    .landing-page-container {
        display: grid;
        grid-template-columns: repeat(2, 1fr); /* Creates two equal columns */
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

    @media only screen and (max-width: 600px) {
        .landing-page-container {
            grid-template-columns: repeat(1, 1fr); /* Creates two equal columns */
        }
    }
</style>