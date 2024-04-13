<script setup lang="ts">
import DungeonGame from '~/utils/dungeonGame';
import { onMounted, ref } from 'vue';

const gameCanvas = ref<HTMLCanvasElement | null>(null)
const game = ref<DungeonGame | null>(null)

onMounted(() => {
    if (!gameCanvas.value) {
        throw new Error('gameCanvas is null');
    }
    game.value = new DungeonGame(gameCanvas.value.id)
});

</script>

<template>
    <div class="flex flex-col gap-2">
        <h1 class="text-3xl font-bold">
            Dungeon Delve
        </h1>
        <p class="text-white/50">
            Welcome to the dungeon. You can explore the dungeon and find treasure, but be careful, there are monsters lurking around every corner.
        </p>
        <button class="btn btn-outline btn-sm w-fit">
            Begin your adventure
        </button>
    </div>

    <div class="h-full w-full overflow-hidden p-8">
        <div class="flex justify-between text-4xl">
            <p class="text-white/50">
                Floor: {{ game?.level }}
            </p>
            <p class="text-white/50">
                Health: {{ game?.playerHP}}
            </p>
        </div>
        <canvas ref="gameCanvas" id="gameCanvas" class="aspect-square h-full mx-auto"></canvas>
    </div>
</template>