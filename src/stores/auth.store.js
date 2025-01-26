import { defineStore } from 'pinia'

export const ROLES = {
    Owner: 0,
    Admin: 1,
    Guest: 2
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        jwtToken: localStorage.getItem('token'),
        userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }),
    getters: {
        token: (state) => state.jwtToken,
        role() {
            return this.userInfo.role
        },
        isAdmin() {
            return this.role === ROLES.Admin || this.role === ROLES.Owner
        },
        isOwner() {
            return this.role === ROLES.Owner
        },
        isLoggedIn() {
            return this.token !== null
        },
        userId() {
            return this.userInfo.id
        }
    },
    actions: {
        setUserData(token, userInfo) {
            this.jwtToken = token
            localStorage.setItem('token', token)
            this.userInfo = userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
    }
})