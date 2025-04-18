<script setup lang="ts">
import { useForm } from 'vee-validate';
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';
import * as yup from 'yup'

const errorStore = useErrorStore()
const authStore = useAuthStore()
const router = useRouter()

const jwtToken = authStore.token

const userSchema = yup.object({
    email: yup.string().required().email(),
    password: yup.string().required()
})

const { values, errors, handleSubmit, defineField } = useForm({
    validationSchema: userSchema
});


const [email, emailAttrs] = defineField('email', {
    validateOnModelUpdate: false
});
const [password, passwordAttrs] = defineField('password', {
    validateOnModelUpdate: false,
});

function onSuccess(values: Record<string, unknown>) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
    }

    fetch("http://localhost:3000/user/login", requestOptions)
        .then(async res => {
            const responseParsed = await res.json()
            if (res.status === 200) {
                authStore.setUserData(responseParsed.token, responseParsed.userInfo)
                router.go(0)
            } else if (res.status === 401) {
                if (responseParsed.errorcode === 1) {
                    errorStore.setError("Benutzer existiert nicht oder das Passwort ist falsch.")
                }
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
                <hr>
                <div class="input-field">
                    <input v-model="email" v-bind="emailAttrs" type="text" name="email" />
                </div>
                <hr>
                <div class="input-field-title">Passwort</div>
                <hr>
                <div class="input-field">
                    <input v-model="password" v-bind="passwordAttrs" type="password" name="password" />
                </div>
                <hr>
                <button>Login</button>
            </form>
        </div>
    </div>
</template>

<style>

</style>