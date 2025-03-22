<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup'
import { useRouter } from 'vue-router';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore } from '@/stores/auth.store';

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
    email: yup.string().required().email(),
    password: yup.string().required(),
    passwordConfirm: yup.string().required(),
    name: yup.string().required()
})

const { values, errors, handleSubmit, defineField } = useForm({
    validationSchema: schema
});

const [email, emailAttrs] = defineField('email', {
    validateOnModelUpdate: false,
});

const [password, passwordAttrs] = defineField('password', {
    validateOnModelUpdate: false,
});
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm', {
    validateOnModelUpdate: false,
});
const [name, nameAttrs] = defineField('name', {
    validateOnModelUpdate: false,
});

function onSuccess(values) {
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
    }

    fetch("http://localhost:3000/user/register", requestOptions)
        .then(async res => {
            const responseParsed = await res.json()
            if (res.status === 201) {
                //localStorage.setItem('token', res.token)
                authStore.setUserData(responseParsed.token, responseParsed.userInfo)
                router.go()
            } else if (res.status === 400) {
                if (responseParsed.errorcode === 4) {
                    errorStore.setError("E-Mail-Adresse ist bereits in Benutzung.")
                } else if (responseParsed.errorcode === 5) {
                    errorStore.setError("Name ist bereits in Benutzung.")
                }
            }
        })
}

function onInvalidSubmit({ values, errors, results }) {
    const firstError = Object.keys(errors)[0];
    errorStore.setError(errors[firstError])
    const el = document.querySelector(`[name="${firstError}"]`);
    el?.scrollIntoView({
        behavior: 'smooth',
    });
    el.focus();
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
                <div class="input-field-title">Name</div>
                <hr>
                <div class="input-field">
                    <input v-model="name" v-bind="nameAttrs" type="text" name="name" />
                </div>
                <hr>
                <div class="input-field-title">Passwort</div>
                <hr>
                <div class="input-field">
                    <input v-model="password" v-bind="passwordAttrs" type="text" name="passwordAttrs" />
                </div>
                <hr>
                <div class="input-field-title">Passwort wiederholen</div>
                <hr>
                <div class="input-field">
                    <input v-model="passwordConfirm" v-bind="passwordConfirmAttrs" type="text" name="passwordConfirm" />
                </div>
                <hr>
                <button>Registrieren</button>
            </form>
        </div>
    </div>
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
}</style>