import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */
export default defineConfig({
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        'VITE_COVER_IMAGE': JSON.stringify(process.env.VITE_COVER_IMAGE)
    }
})
