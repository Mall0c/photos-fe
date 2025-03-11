import { useAuthStore } from '@/stores/auth.store';

export function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export function isAdminOrAuthor(authorId) {
    const authStore = useAuthStore()
    return authStore.isLoggedIn && (authStore.isAdmin || authStore.isOwner || authStore.userId == authorId)
}

export function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp) * 1000);
    console.log(timestamp, date)
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
}

export function getParentPath(route) {
    console.log(route)
    return route.path
        .split('/')
        .slice(0, -1)
        .join('/')
}