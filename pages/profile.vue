<script setup lang="ts">
const user = useSupabaseUser()
import type { Database } from '~/types/database.types'


function addGithub() {
    console.log('adding github')
    navigateTo('https://github.com/apps/dev-dungeon-app/installations/new', {external: true})
}

const client = useSupabaseClient<Database>()



const { data: githubIntegration, error } = useAsyncData(async () => {
    const { data } = await client.from('github_integration').select().eq('user_id', user.value?.id ?? '')

    return data
})

const hasExistingGithubIntegration = computed(() => {
    if (!githubIntegration.value) {
        return false
    }
    return githubIntegration.value.length > 0
})

const githubData = computed(() => {
    if (!githubIntegration.value) {
        return null
    }
    return githubIntegration.value[0]
})

</script>

<template>
    <div class="flex flex-col gap-8">
        <div>
            <h1 class="text-3xl font-bold">Profile</h1>
            <p class="">
            Welcome, {{ user?.email }}
            </p>
        </div>
        <div class="flex flex-col gap-2">
            <h2 class="text-2xl">Integrations</h2>
            <div class="rounded border border-neutral">
                <div class="flex p-4 gap-4">
                    <button :disabled="hasExistingGithubIntegration" @click="addGithub()" class="btn btn-primary btn-outline text-nowrap">
                        Link Github
                    </button>
                    <div v-if="hasExistingGithubIntegration">
                        <p>Name: {{ githubData?.github_name }}</p>
                        <p>Commits registered: {{ githubData?.commit_count }}</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>