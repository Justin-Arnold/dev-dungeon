<script setup lang="ts">

</script>

<template>
    <div class="h-screen w-screen overflow-hidden bg-base-300 flex flex-col">
        <div class="h-20 w-full bg-base-100 flex-shrink-0">
            <div class="flex justify-between gap-4 p-4 h-full items-center">
                <h1 class="text-2xl font-bold">Dev Dungeon</h1>
                <NuxtLink to="/home" class="btn btn-primary">Go To App</NuxtLink>
            </div>
        </div>
        <div class="h-full grow p-4 max-width-[1000px] flex flex-col items-center">
            <slot></slot>
        </div>
    </div>
</template>