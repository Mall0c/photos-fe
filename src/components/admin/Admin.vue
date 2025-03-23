<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';
import { useErrorStore } from '@/stores/errors.store';
import { useAuthStore, ROLES } from '@/stores/auth.store';
import { onBeforeRouteLeave, useRouter } from 'vue-router';
import ModalDialogButton from '@/components/utilities/ModalDialogButton.vue';
import Table from '@/components/utilities/Table.vue';
import type { TUser } from '@/components/user/Register.vue'

const router = useRouter()

const errorStore = useErrorStore()
const authStore = useAuthStore()

const showModalDeleteUser: Ref<boolean> = ref(false)

// Array of users.
const users: Ref<Array<TUser>> = ref([])
// ID of the user, when the delete button is clicked.
const userToDelete: Ref<number | undefined> = ref(undefined)
const jwtToken = authStore.token
const editing: Ref<boolean> = ref(false)
// Do we have unsaved changes? If yes, ask the user before refreshing or leaving the page.
const unsavedChanges: Ref<boolean> = ref(false)
const currentlyEditedRow: Ref<number | null> = ref(null)

function fetchUsers(offset: number) {
    const requestOptions = {
            method: "GET",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        }
        fetch(`http://localhost:3000/users/${offset}`, requestOptions)
            .then(async response => {
                const responseParsed = await response.json()
                if (response.status === 200) {
                    users.value = responseParsed
                } else if (response.status === 401 || response.status === 403) {
                    errorStore.setError("Nicht eingeloggt oder keine Berechtigung.")
                }
            })
            .catch(err => {
                errorStore.setError(err)
            })
}

/**
 * Initial load of users.
 */
onMounted(() => {
    fetchUsers(0)
})

/**
 * Ask for confirmation if user wants to switch to a different component.
 */
onBeforeRouteLeave(() => {
    if(unsavedChanges.value === true) {
        if (confirm("Es gibt ungespeicherte Änderungen. Möchtest Du die Seite wirklich verlassen?")) {
            return true
        }
        return false
    }
    return true
})

/**
 * Ask for confirmation if user wants to reload / close tab when there is unsaved data.
 */
window.onbeforeunload = function (e) {
    // Um den Dialog *NICHT* anzuzeigen, kann man z. B. "null" zurückgeben. "false" funktioniert nicht.
    // https://stackoverflow.com/a/59618875
    return unsavedChanges.value === true ? true : null
};


function saveUserChanges(idx: number, userId?: number) {
    if (typeof userId !== "number") {
        return
    }

    const userName = (document.getElementById("user-name-" + idx) as HTMLInputElement).value
    const roleElem = document.getElementById("select-roles-" + idx) as HTMLSelectElement
    if (userName !== null && roleElem !== null) {
        const role = roleElem.options[roleElem.selectedIndex].text as keyof typeof ROLES
        
        // Map string representation of role (Owner, Admin, Guest) to number (0, 1, 2)
        const roleAsNumber = ROLES[role]

        // Changes are about to be saved. Dont warn user if he wants to reload or leave the page.
        unsavedChanges.value = false
        
        const requestOptions = {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + jwtToken
                },
                body: JSON.stringify({ name: userName, role: roleAsNumber })
            }
            fetch(`http://localhost:3000/admin/user/${userId}`, requestOptions)
                .then(async response => {
                    const responseParsed = await response.json()
                    if (response.status === 201) {
                        console.log("Success")
                    } else if (response.status === 400) {
                        console.log("Nicht so viel Success")
                    }
                })
                .catch(err => {
                    errorStore.setError(err)
                })
                .finally(() => {
                    makeReadonly(idx)
                })
    }
}

function deleteUser(userId?: number) {
    if (typeof userId !== "number") {
        return
    }

    showModalDeleteUser.value = false
    const requestOptions = {
            method: "DELETE",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": "Bearer " + jwtToken
            }
        }
    fetch(`http://localhost:3000/admin/user/${userId}`, requestOptions)
        .then(async response => {
            const responseParsed = await response.json()
            if (response.status === 200) {
                console.log("Success")
            } else if (response.status === 400) {
                console.log("Nicht so viel Success")
            }
            router.go(0)
        })
        .catch(err => {
            errorStore.setError(err)
        })
        .finally(() => {
            userToDelete.value = undefined
        })
}

/**
 * Make input field and role selector readonly and adjust visibility of buttons.
 * @param idx 0-based idx of the row in the table.
 */
function makeReadonly(idx: number) {
    const userNameElem = document.getElementById("user-name-" + idx) as HTMLInputElement
    userNameElem.readOnly = true
    userNameElem.classList.remove("edit-highlight")

    const roleElem = document.getElementById("select-roles-" + idx) as HTMLSelectElement
    roleElem.disabled = true
    roleElem.classList.remove("edit-highlight")
    editing.value = false

    ;(document.getElementById("edit-button-" + idx) as HTMLImageElement).style.display = "inline-block"
    ;(document.getElementById("close-button-" + idx) as HTMLImageElement).style.display = "none"
    ;(document.getElementById("save-button-" + idx) as HTMLImageElement).style.display = "none"

    currentlyEditedRow.value = null
}

/**
 * Make input field and role selector editable and adjust visibility of buttons.
 * @param idx 0-based idx of the row in the table.
 */
function makeEditable(idx: number) {
    const userNameElem = document.getElementById("user-name-" + idx) as HTMLInputElement
    userNameElem.readOnly = false
    userNameElem.classList.add("edit-highlight")

    const roleElem = document.getElementById("select-roles-" + idx) as HTMLSelectElement
    roleElem.disabled = false
    roleElem.classList.add("edit-highlight")
    editing.value = true

    ;(document.getElementById("edit-button-" + idx) as HTMLImageElement).style.display = "none"
    ;(document.getElementById("close-button-" + idx) as HTMLImageElement).style.display = "inline-block"
    ;(document.getElementById("save-button-" + idx) as HTMLImageElement).style.display = "inline-block"
}

/**
 * Make input field and role selector editable or readonly, depending on the "editing" ref variable.
 * @param idx 0-based idx of the row in the table.
 */
function editToggle(idx: number) {
    // "currentlyEditedRow" makes sure only one row can be edited at the same time.
    if (currentlyEditedRow.value === idx || currentlyEditedRow.value === null) {
        if (editing.value === false) {
            currentlyEditedRow.value = idx
            makeEditable(idx)
        } else {
            makeReadonly(idx)
        }
    }
}

/**
 * The roles select element should have the current user role as first element.
 * This function returns an array of roles, where the first element is the current user role
 * so that it is shown as default value.
 * @param role Current user role
 * @returns Array of user roles, where the first element is the current user's role.
 */
function reorderRoleArray(role?: number) {
    let currentRole = "Guest"
    // Map number representation (0, 1, 2) to string (Owner, Admin, Guest)
    for (const [key, val] of Object.entries(ROLES)) {
        if (role === val) {
            currentRole = key
            break
        }
    }
    const roles = Object.keys(ROLES).filter(elem => elem !== currentRole)
    roles.unshift(currentRole)
    return roles
}

function setUserToDelete(userId?: number) {
    if (typeof userId === "number") {
        showModalDeleteUser.value = true; 
        userToDelete.value = userId
    }
}

</script>

<template>
    
    <Table 
        tableTitle="Registrierte Nutzer"
        tableColumns='["ID", "E-Mails", "Name", "Rolle", "Aktion"]'
    >
        <tr v-for="(user, idx) in users">
            <td>{{ user.id }}</td>
            <td>{{ user.email }}</td>
            <td>
                <input @input="unsavedChanges = true" type="text" :id="'user-name-' + idx" v-model="user.name" readonly />
            </td>
            <td>
                <select @input="unsavedChanges = true" name="roles" :id="'select-roles-' + idx" disabled="true" style="color: black;">
                    <option v-for="role in reorderRoleArray(user.role)">
                        {{ role }}
                    </option>
                </select>
            </td>
            <td>
                <img :id="'edit-button-' + idx" @click="editToggle(idx)" src="../../../public/edit-icon-png-3602.png" width="20px" height="20px">
                <img :id="'close-button-' + idx" @click="editToggle(idx)" src="../../../public/211652_close_icon.png" width="20px" height="20px" style="display: none;">
                <img :id="'delete-button-' + idx" @click="setUserToDelete(user.id)" src="../../../public/pngwing.com.png" width="20px" height="20px">
                <img :id="'save-button-' + idx" @click="saveUserChanges(idx, user.id)" src="../../../public/save.256x256.png" width="20px" height="20px" style="display: none;">
            </td>
        </tr>
    </Table>

    <Table
        tableTitle="Von Nutzern hochgeladene Bilder"
        tableColumns='["ID", "Nutzer", "Beschreibung", "Link", "Aktion"]'
    >
    </Table>

    <ModalDialogButton
        v-if="showModalDeleteUser"
        buttonColor="red"
        message="Benutzer wirklich löschen?"
        @confirm="deleteUser(userToDelete)"
        @close="showModalDeleteUser = false"
    />
</template>

<style>

    .edit-highlight {
        border: 1px solid blue;
    }

</style>