import { createRouter, createWebHistory } from 'vue-router';
import PhotoOverview from '@/components/photo-overview/PhotoOverview.vue';
import Home from '@/components/home/Home.vue'
import Register from '@/components/user/Register.vue'
import Profile from '@/components/profile/Profile.vue'
import Activities from '@/components/activities/Activities.vue'
import GuestsGallery from '@/components/guests-gallery/GuestsGallery.vue'
import Admin from '@/components/admin/Admin.vue'
import { useAuthStore } from '@/stores/auth.store';

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkActiveClass: 'active',
    routes: [
        { path: '/', redirect: '/home' },
        { path: '/home', component: Home },
        { path: '/gallery', component: PhotoOverview },
        { path: '/register', component: Register },
        { path: '/logout', component: Register },
        { path: '/profile', component: Profile },
        { path: '/activities', component: Activities },
        { path: '/guests-gallery', component: GuestsGallery },
        { path: '/admin', component: Admin },
        // catch all redirect to home page
        { path: '/:pathMatch(.*)*', redirect: '/gallery' }
    ]
})

router.beforeEach(async (to) => {
    // Redirect to front page if not logged in and trying to access a restricted page,
    // or logged in and having insufficient permissions.
    const notPublicPages = ['/profile'];
    const authRequired = notPublicPages.includes(to.path);
    const authStore = useAuthStore();

    if (authRequired && authStore.isLoggedIn === false) {
        console.log("Hier 1")
        return '/gallery';
    }

    const restrictedPages = ['/admin']
    const permissionRequired = restrictedPages.includes(to.path)

    if (permissionRequired && (authStore.isLoggedIn === false || authStore.isAdmin === false)) {
        console.log("Hier 2")
        return '/gallery'
    }
});