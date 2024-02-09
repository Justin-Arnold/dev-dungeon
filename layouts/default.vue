<script setup lang="ts">
const supabase = useSupabaseClient()

function logout() {
    supabase.auth.signOut()
    navigateTo('/login')
}
</script>

<template>
    <div class="h-screen w-screen overflow-hidden bg-base-300 flex">
        <div class="h-full w-40 bg-base-100 flex-shrink-0">
            <div class="flex flex-col gap-4 p-4 h-full">
                <NuxtLink to="/" class="btn btn-primary">Home</NuxtLink>
                <NuxtLink to="/profile" class="btn btn-primary">Profile</NuxtLink>
                <div class="grow"></div>
                <button @click="logout()" class="btn btn-primary btn-outline">Logout</button>
            </div>
        </div>
        <div class="h-full grow p-4">
            <slot></slot>
        </div>
    </div>
</template>