<script setup lang="ts">
const user = useSupabaseUser()
import type { Database } from '~/types/database.types'

const runtimeConfig = useRuntimeConfig()
const appUrl = runtimeConfig.public.githubAppUrl

function addGithub() {
    navigateTo(appUrl, {external: true})
}

const client = useSupabaseClient<Database>()



const { data: githubIntegration, error } = useAsyncData(async () => {
    const { data } = await client.from('github_integration').select().eq('user_id', user.value?.id ?? '')

    return data
})

const { data: profile, error: profileError } = useAsyncData(async () => {
    const { data } = await client.from('profile').select().eq('user_id', user.value?.id ?? '')

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

const userLevel = computed(() => {
    if (!profile.value) {
        return 'Level 1'
    }
    console.log('profile', profile.value[0].total_experience)
    return `${levelFromExperience.value}`
})

function experienceForLevelEquation(L: number, baseXP: number = 100, growthRate: number = 0.05, cycleFactor: number = 10.0) {
    const cycleMultiplier = .5 + ((Math.floor((L - 1) / 10)) / cycleFactor)
    return Math.floor(baseXP * ((1 + growthRate) ** L) * cycleMultiplier)
}

const totalExperienceToReachCurrentLevel = ref(0)

const levelFromExperience = computed(() => {
    let totalXp = profile.value?.[0]?.total_experience ?? 0
    let accumulatedXp = 0
    let level = 1
    while (accumulatedXp <= totalXp) {
        const xpForNextLevel = experienceForLevelEquation(level)
        if (accumulatedXp + xpForNextLevel > totalXp) {
            // Update leftOverExperience here before breaking
            totalExperienceToReachCurrentLevel.value = accumulatedXp
            level !== 1 ? level-- : ''
            break
        }
        accumulatedXp += xpForNextLevel
        level++
    }
    return level
})

const currentLevelXpProgress = computed(() => {
    if (profile.value?.[0]?.total_experience === undefined) {
        return 0
    }
    const xp = profile.value?.[0]?.total_experience - totalExperienceToReachCurrentLevel.value
    return xp
})

const totalExperienceNeededToLevelUp = computed(() => {
    return experienceForLevelEquation(levelFromExperience.value+1)
})


</script>

<template>
    <div class="flex flex-col gap-8">
        <div class="flex justify-between">
            <div class="flex h-full gap-4">
                <div class="grid place-items-center h-44 rounded bg-base-200 !aspect-square shadow-md">
                    <div>
                        <p class="font-light">Level</p>
                        <p class="text-[100px] leading-none -mt-2">{{ userLevel }}</p>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-xl text-semibold">{{ profile?.[0]?.display_name ?? '' }}</p>
                    <div class="relative">
                        <progress class="progress progress-error w-56 h-6 shadow-md" value="100" max="100"></progress>
                        <p class="absolute top-0 left-1/2 z-2 text-black/60 dark:text-white/60 -translate-x-1/2">100 / 100 HP</p>
                    </div>
                    <div class="relative">
                        <progress class="progress progress-primary w-56 h-6 shadow-md" :value="currentLevelXpProgress" :max="totalExperienceNeededToLevelUp"></progress>
                        <p class="absolute top-0 left-1/2 z-2 text-black/60 dark:text-white/60 -translate-x-1/2">
                            {{ currentLevelXpProgress }} / {{ totalExperienceNeededToLevelUp }} XP
                        </p>
                    </div>
                </div>
            </div>
            <div class="p-2 rounded bg-neutral/80">
                <img src="~/assets/profile.webp" class="object-cover w-64 rounded"/>
            </div>
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