<script setup lang="ts">
import type { Database } from '~/types/database.types'

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

async function getCodewarsUser() {
    isFetching.value = true
    try {
        const response = await $fetch<{
            username: string
            honor: number
        }>(CODEWARS_USER_API + username.value)

        await useFetch('/api/integrations/codewars/register', {
            method: 'POST',
            body: JSON.stringify({
                username: response.username,
                honor: response.honor,
            })
        })

        const { data: profile, error: profileError } = await client.from('profile').select().eq('user_id', user.value?.id ?? '')

        if (profileError) {
            createError(profileError.message)
        } else {
            const startingHonor = honor.value
            const newHonor = response.honor - startingHonor
            const newExperience = profile[0].total_experience + newHonor
            await client.from('profile').update({ total_experience: newExperience }).eq('user_id', user.value?.id ?? '')
        }

        hasExistingIntegration.value = true

    } catch (error) {
        createError('There was an error fetching your Codewars data')
    }


    isFetching.value = false
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
            <div class="card-title">
                <h3 class="text-lg">Codewars</h3>
            </div>
            <div v-if="!hasExistingIntegration" class="h-full grid place-items-center">
                <div class="flex flex-col items-left gap-2">
                    <div class="flex gap-2">
                        <input v-model="username" :disabled="hasExistingIntegration" type="text" class="input input-bordered w-80" placeholder="Enter your Codewars username" />
                        <button :disabled="!readyToFetchCodewarsData" @click="getCodewarsUser()" class="btn btn-primary btn-outline text-nowrap w-fit">
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
                    <button @click="getCodewarsUser()" class="btn btn-primary btn-outline text-nowrap w-fit">
                        Refresh Data
                        <span v-show="isFetching" class="loading loading-spinner"></span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>