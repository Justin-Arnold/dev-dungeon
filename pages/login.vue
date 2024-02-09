<script setup lang="ts">

definePageMeta({
    layout: false
})

const email = ref('');
const password = ref('');

const supabase = useSupabaseClient()

async function signUp() {
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
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
        navigateTo('/home')
    }
}

</script>

<template>
    <div class="h-screen w-screen flex items-center justify-center">
        <div class="card bg-neutral w-[500px]">
            <div class="card-body">
                <div class="card-title">
                    <h1>Login</h1>
                </div>
                <form @submit.prevent="login">
                    <div class="form-control">
                        <label for="email" class="label">Email</label>
                        <input type="email" id="email" v-model="email" class="input" />
                    </div>
                    <div class="form-control">
                        <label for="password" class="label">Password</label>
                        <input type="password" id="password" v-model="password" class="input" />
                    </div>
                    <div class="form-control mt-8 flex-row gap-4">
                        <button @click="signUp()" class="btn btn-primary btn-outline flex-1">Sign Up</button>
                        <button type="submit" class="btn btn-primary flex-1">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>