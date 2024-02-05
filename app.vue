<script setup lang="ts">

const email = ref('');
const password = ref('');

const supabase = useSupabaseClient()

async function signUp() {
    const { data, error } = await supabase.auth.signUp({
        email: 'example@email.com',
        password: 'example-password',
    })

    if (error) {
        console.error('Error:', error)
    } else {
        console.log('Data:', data)
    }
}


async function login() {
    const { data,  error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
    })

    if (error) {
        console.error('Error:', error)
    } else {
        console.log('Data:', data)
    }
}

</script>

<template>
    <div class="h-screen w-screen overflow-hidden bg-slate-950 grid place-items-center">
        <NuxtPage />
    </div>
</template>
