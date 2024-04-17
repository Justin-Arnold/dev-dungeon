<script setup lang="ts">
import type { Database } from 'dev-dungeon-database'
import type { User, GetUserResponse } from '~/types/codewars';

const CODEWARS_USER_API = 'https://www.codewars.com/api/v1/users/'

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const isFetching = ref(false)
const username = ref('')
const honor = ref(0)
const hasExistingIntegration = ref(false)

const readyToFetchCodewarsData = computed(() => {
    const hasUsername = username.value.length > 0
    return !hasExistingIntegration.value && hasUsername && !isFetching.value
})

async function getCodewarsUser(): Promise<GetUserResponse> {
    isFetching.value = true
    try {
        const codewarsUser = await $fetch<User>(CODEWARS_USER_API + username.value)
        isFetching.value = false
        return {user: codewarsUser, error: null}
    } catch (error) {
        return {
            user: null,
            error:  createError('There was an error fetching your Codewars data')
        }
    }
}

async function refreshUserData() {
    isFetching.value = true;
    try {
        const {user, error} = await getCodewarsUser();
        if (!error && user.honor > honor.value) {
            await updateHonor(user.honor)
            console.log('success')
        }
    } catch (error) {
        console.log(error)
        createError('Error refreshing user data')
    }
}

async function updateHonor(newHonor: number) {
    const { data: profile, error: profileError } = await client.from('profile').select().eq('user_id', user.value?.id ?? '')
    const { error: honorError } = await await useFetch('/api/integrations/codewars/honor', {
        method: 'PUT',
        body: JSON.stringify({
            honor: newHonor,
        })
    })

    if (profileError) {
        createError(profileError.message)
    } else if (honorError) {
        createError(honorError)
    } else {
        const startingHonor = honor.value
        const honorDifference = newHonor - startingHonor
        const newExperience = profile[0].total_experience + honorDifference
        await client.from('profile').update({ total_experience: newExperience }).eq('user_id', user.value?.id ?? '')
    }
}

async function removeIntegration() {
    isFetching.value = true
    await useFetch('/api/integrations/codewars/account', {
        method: 'DELETE',
    })
    isFetching.value = false
}

async function registerCodewarsUser() {
    const { user, error } = await getCodewarsUser()

    if (error) {
        return createError(error)
    }

    await useFetch('/api/integrations/codewars/register', {
        method: 'POST',
        body: JSON.stringify({
            username: user.username,
            honor: user.honor,
        })
    })
    hasExistingIntegration.value = true
}



onMounted(async () => {
    const {
        data: existingIntegration,
        error: existingIntegrationError
    } = await client.from('codewars_integration').select().eq('user_id', user.value?.id ?? '')

    if (existingIntegrationError) {
        createError(existingIntegrationError.message)
    } else if (existingIntegration) {
        if (existingIntegration.length > 0) {
            hasExistingIntegration.value = true
            username.value = existingIntegration[0].username
            honor.value = existingIntegration[0].honor
        }
    }
})

</script>

<template>
    <div class="card bg-base-100 shadow-lg h-80">
        <div class="card-body">
            <div class="card-title justify-between">
                <h3 class="text-lg">Codewars</h3>
                <span 
                    v-if="hasExistingIntegration"
                    title="remove integration"
                    class="cursor-pointer hover:scale-110 active:scale-90 transition-all duration-100 text-sm text-error"
                    @click="removeIntegration()"
                >
                    Delete
                </span>
            </div>
            <div v-if="!hasExistingIntegration" class="h-full grid place-items-center">
                <div class="flex flex-col items-left gap-2">
                    <div class="flex gap-2">
                        <input v-model="username" :disabled="hasExistingIntegration" type="text" class="input input-bordered w-80" placeholder="Enter your Codewars username" />
                        <button :disabled="!readyToFetchCodewarsData" @click="registerCodewarsUser()" class="btn btn-primary btn-outline text-nowrap w-fit">
                            Link Codewars
                            <span v-show="isFetching" class="loading loading-spinner"></span>
                        </button>
                    </div>
                    <p class="text-center">There is no linked Codewars account, link one to start earning experience.</p>
                </div>
            </div>
            <div v-else class="h-full grid place-items-center">
                <div class="flex flex-col items-center gap-2">
                    <p class="text-lg">Linked Username: {{ username }}</p>
                    <p class="mb-2">Total Honor Earned: {{ honor }}</p>
                    <button @click="refreshUserData()" class="btn btn-primary btn-outline text-nowrap w-fit">
                        Refresh Data
                        <span v-show="isFetching" class="loading loading-spinner"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>