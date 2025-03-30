// https://stackoverflow.com/questions/78114219/property-env-does-not-exist-on-type-importmeta-ts2339
// At src/router/index.ts, I got the error 
//      Property 'env' does not exist on type 'ImportMeta'.ts(2339)
// at history: createWebHistory(import.meta.env.BASE_URL).
interface ImportMetaEnv {
    readonly BASE_URL: string  
}
interface ImportMeta {
    readonly env: ImportMetaEnv
}