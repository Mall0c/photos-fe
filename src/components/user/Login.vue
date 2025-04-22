<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';
import * as yup from 'yup'
import { getAPIURL } from '@/utils'

const errorStore = useErrorStore()
const authStore = useAuthStore()
const router = useRouter()

const userSchema = yup.object({
    loginEmail: yup.string().required().email(),
    loginPassword: yup.string().required()
})

const { values, errors, handleSubmit, defineField } = useForm({
    validationSchema: userSchema
});


const [loginEmail, loginEmailAttrs] = defineField('loginEmail', {
    validateOnModelUpdate: false
});
const [loginPassword, loginPasswordAttrs] = defineField('loginPassword', {
    validateOnModelUpdate: false,
});

function onSuccess(values: Record<string, unknown>) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
    }

    fetch(`${getAPIURL()}/api/user/login`, requestOptions)
        .then(async res => {
            const responseParsed = await res.json()
            if (res.status === 200) {
                authStore.setUserData(responseParsed.token, responseParsed.userInfo)
                router.go(0)
            } else if (res.status === 401) {
                errorStore.setError(responseParsed.text)
            }
        })
}

function onInvalidSubmit({ values, errors, results }: {
    values: Record<string, unknown>,
    errors: Record<string, unknown>,
    results: Record<string, unknown>
}) {
    const firstError = Object.keys(errors)[0]
    if (typeof errors[firstError] === "string") {
        errorStore.setError(errors[firstError])
        const el = document.querySelector(`[name="${firstError}"]`) as HTMLInputElement
        el?.scrollIntoView({
            behavior: 'smooth',
        });
        el?.focus();
    } else {
        console.log("onInvalidSubmit, type is not string.")
    }
}

const onSubmitForm = handleSubmit(onSuccess, onInvalidSubmit)

</script>

<template>
    <div class="outer-container">
        <div class="input-container">
            <form @submit="onSubmitForm">
                <div class="input-field-title">E-Mail</div>
                <div>
                    <input v-model="loginEmail" v-bind="loginEmailAttrs" type="text" name="loginEmail" class="text-input" />
                </div>
                <div class="input-field-title">Passwort</div>
                <div>
                    <input v-model="loginPassword" v-bind="loginPasswordAttrs" type="password" name="loginPassword" class="text-input" />
                </div>
                <button class="signup-button">Login</button>
            </form>
        </div>
    </div>
</template>

<style>

</style>