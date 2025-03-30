import { useAuthStore } from '@/stores/auth.store';
import { type RouteLocationNormalizedLoaded } from 'vue-router';

export function debounce(func: Function, wait: number, immediate: boolean) {
    var timeout: number | undefined;
    return function(this: any) {
        var context = this
        var args = arguments;
        var later = function() {
            timeout = undefined;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export function isAdminOrAuthor(authorId?: number) {
    if (authorId === undefined) {
        return false
    }
    const authStore = useAuthStore()
    return authStore.isLoggedIn && (authStore.isAdmin || authStore.isOwner || authStore.userId == authorId)
}

export function formatTimestamp(timestamp?: number) {
    if (timestamp === undefined) {
        return ""
    }

    const date = new Date(timestamp * 1000);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function getParentPath(route: RouteLocationNormalizedLoaded) {
    return route.path
        .split('/')
        .slice(0, -1)
        .join('/')
}