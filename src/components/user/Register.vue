<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';
import { getAPIURL } from '@/utils'

export type TUser = {
    id?: number
    email?: string
    name?: string
    role?: number
}

const errorStore = useErrorStore()
const authStore = useAuthStore()

const router = useRouter()

if (authStore.token !== null) {
    router.push('/gallery')
}

const schema = yup.object({
    registerEmail: yup.string().required().email(),
    registerPassword: yup.string().required(),
    registerPasswordConfirm: yup.string().required(),
    registerName: yup.string().required(),
    registrationToken: yup.string().required()
})

const { values, errors, handleSubmit, defineField } = useForm({
    validationSchema: schema
});

const [registerEmail, registerEmailAttrs] = defineField('registerEmail', {
    validateOnModelUpdate: false,
});

const [registerPassword, registerPasswordAttrs] = defineField('registerPassword', {
    validateOnModelUpdate: false,
});

const [registerPasswordConfirm, registerPasswordConfirmAttrs] = defineField('registerPasswordConfirm', {
    validateOnModelUpdate: false,
});

const [registerName, registerNameAttrs] = defineField('registerName', {
    validateOnModelUpdate: false,
});

const [registrationToken, registrationTokenAttrs] = defineField('registrationToken', {
    validateOnModelUpdate: false,
});

function onSuccess(values: Record<string, string>) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
    }

    fetch(`${getAPIURL()}/api/user/register`, requestOptions)
        .then(async res => {
            const responseParsed = await res.json()
            if (res.status === 201) {
                //localStorage.setItem('token', res.token)
                authStore.setUserData(responseParsed.token, responseParsed.userInfo)
                router.go(0)
            } else if (res.status === 400 || res.status === 401) {
                errorStore.setError(responseParsed.text)
            }
        })
}

function onInvalidSubmit({ values, errors, results }: {
    values: Record<string, string>,
    errors: Record<string, unknown>,
    results: Record<string, unknown>
}) {
    const firstError = Object.keys(errors)[0];
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
                    <input v-model="registerEmail" v-bind="registerEmailAttrs" type="text" name="registerEmail" class="text-input" />
                </div>
                <div class="input-field-title">Name</div>
                <div>
                    <input v-model="registerName" v-bind="registerNameAttrs" type="text" name="registerName" class="text-input" />
                </div>
                <div class="input-field-title">Passwort</div>
                <div>
                    <input v-model="registerPassword" v-bind="registerPasswordAttrs" type="password" name="registerPasswordAttrs" class="text-input" />
                </div>
                <div class="input-field-title">Passwort wiederholen</div>
                <div>
                    <input v-model="registerPasswordConfirm" v-bind="registerPasswordConfirmAttrs" type="password" name="registerPasswordConfirm" class="text-input" />
                </div>
                <div class="input-field-title">Registration Token</div>
                <div>
                    <input v-model="registrationToken" v-bind="registrationTokenAttrs" type="password" name="registrationToken" class="text-input" />
                </div>
                <button class="signup-button">Registrieren</button>
            </form>
        </div>
    </div>
</template>

<style>

</style>