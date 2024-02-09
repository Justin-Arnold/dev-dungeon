<script setup lang="ts">

definePageMeta({
    layout: 'site-layout'
})

</script>

<template>
    <div class="w-[800px] card card-side bg-base-100 shadow-xl shadow-black mt-20">
        <figure class="w-[200px] h-80 shrink-0">
            <img src="~/assets/hero.webp" class="object-cover h-full"/>
        </figure>
        <div class="card-body">
            <h2 class="card-title text-4xl">Join the Dev Dungeon Quest!</h2>
            <p class="font-light">Embark on a journey with Dev Dungeon as we craft our next-level app. Sign up now to get exclusive updates and early access insights straight to your inbox. Be the first to explore the corners of our digital labyrinth. Join the quest, and let's unlock the future together!</p>
            <div class="card-actions justify-end form-control flex-row">
                <input type="email" class="input input-bordered grow" placeholder="Enter your email" />
                <button class="btn btn-primary">Sign up for news</button>
            </div>
        </div>
    </div>
</template>