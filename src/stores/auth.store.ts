import { defineStore } from 'pinia'

export enum ROLES {
    Owner = 0,
    Admin = 1,
    Guest = 2
}

type TUserInfo = {
    name: string
    email: string
    id: number
    role: number
}

type TAuthStoreState = {
    jwtToken: string
    userInfo: TUserInfo
}

export const useAuthStore = defineStore('auth', {
    state: (): TAuthStoreState => ({
        jwtToken: localStorage.getItem('token') as string,
        userInfo: JSON.parse(localStorage.getItem('userInfo') as string) as TUserInfo
    }),
    getters: {
        token(state): string {
            return state.jwtToken
        },
        role(state): number {
            return state.userInfo.role
        },
        isAdmin(): boolean {
            return this.role === ROLES.Admin || this.role === ROLES.Owner
        },
        isOwner(): boolean {
            return this.role === ROLES.Owner
        },
        isLoggedIn(): boolean {
            return this.token !== null
        },
        userId(): number {
            return this.userInfo.id
        }
    },
    actions: {
        setUserData(token: string, userInfo: TUserInfo) {
            this.jwtToken = token
            localStorage.setItem('token', token)
            this.userInfo = userInfo
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
        }
    }
})