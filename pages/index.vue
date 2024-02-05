<script setup lang="ts">
const user = useSupabaseUser()
const supabase = useSupabaseClient()

function logout() {
    supabase.auth.signOut()
    navigateTo('/login')
}

</script>

<template>
    <div class="h-screen w-screen overflow-hidden bg-slate-950 grid place-items-center">
        <p class="text-white text-5xl">
        Welcome, {{ user?.email }}
        </p>
        <button @click="logout()" class="btn btn-primary btn-outline flex-1">Logout</button>
    </div>
</template>