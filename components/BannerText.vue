<script setup lang="ts">

defineProps<{
    header: string
    subheader: string
}>()

</script>

<template>
    <div class="text-center space-y-2">
        <h2 class="text-3xl font-bold">
            {{ header }}
        </h2>
        <p class="text-xl">
            {{ subheader }}
        </p>
    </div>
</template>