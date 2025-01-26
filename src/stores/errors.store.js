import { defineStore } from 'pinia'

export const useErrorStore = defineStore('errors', {
    state: () => ({
        currentError: null
    }),
    getters: {

    },
    actions: {
        setError(errorText) {
            this.currentError = errorText
        }
    }
})