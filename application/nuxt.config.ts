// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },
    modules: [
        '@nuxtjs/supabase',
        '@nuxtjs/tailwindcss'
    ],
    runtimeConfig: {
        public: {
            githubAppUrl: 'https://github.com/apps/dev-dungeon-app-development/installations/new'
        }
    },
    supabase: {
        redirectOptions: {
            login: '/login',
            callback: '/success',
            exclude: ['/'],
        }
    },
})