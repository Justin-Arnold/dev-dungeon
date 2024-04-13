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
    <div class="max-w-[1000px] space-y-8">
        <BannerText
            header="Level Up Your Coding Skills with Dev Dungeon"
            subheader="Track your progress, conquer challenges, and climb the developer ranks in this gamified coding adventure."
        />
        <div class="grid grid-cols-4 gap-4">
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h3 class="card-title">
                        Centralized progress tracking
                    </h3>
                    <p>
                        See your growth across LeetCode, Codewars, GitHub, and more in one place.
                    </p>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h3 class="card-title">
                        Gamified Learning
                    </h3>
                    <p>
                        Earn XP, level up, and unlock rewards as you code.
                    </p>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h3 class="card-title">
                        Fun & Motivation
                    </h3>
                    <p>
                        Turn coding practice into an addictive adventure.
                    </p>
                </div>
            </div>
            <div class="card bg-base-100 shadow-xl">
                <div class="card-body">
                    <h3 class="card-title">
                        Showcase Your Skills
                    </h3>
                    <p>
                        Build a killer developer portfolio with your activity.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>