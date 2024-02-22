<script setup lang="ts">
import type { Database } from '~/types/database.types'

const CODEWARS_USER_API = 'https://www.codewars.com/api/v1/users/'

const client = useSupabaseClient<Database>()
const user = useSupabaseUser()

const isFetching = ref(false)
const username = ref('')
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

        //add 1 xp per honor to the user's total experience
        const { data: profile, error: profileError } = await client.from('profile').select().eq('user_id', user.value?.id ?? '')

        if (profileError) {
            createError(profileError.message)
        } else {
            const newExperience = profile[0].total_experience + response.honor
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
        }
    }
})

</script>

<template>
    <div class="rounded border border-neutral p-4 space-y-4 w-fit">
        <h3 class="text-lg">Codewars</h3>
        <div class="flex gap-4">
            <input v-model="username" :disabled="hasExistingIntegration" type="text" class="input input-bordered w-80" placeholder="Enter your Codewars username" />
            <button :disabled="!readyToFetchCodewarsData" @click="getCodewarsUser()" class="btn btn-primary btn-outline text-nowrap">
                Link Codewars
                <span v-show="isFetching" class="loading loading-spinner"></span>
            </button>
            <!-- <div v-if="hasExistingGithubIntegration">
                <p>Name: {{ githubData?.github_name }}</p>
                <p>Commits registered: {{ githubData?.commit_count }}</p>
            </div> -->
        </div>
    </div>
</template>