import { defineStore } from 'pinia'

export type TErrorsStoreState = {
    currentError: string | null
}

export const useErrorStore = defineStore('errors', {
    state: (): TErrorsStoreState => ({
        currentError: null
    }),
    getters: {

    },
    actions: {
        setError(errorText: string) {
            this.currentError = errorText
        }
    }
})