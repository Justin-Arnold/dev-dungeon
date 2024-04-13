<script setup lang="ts">

const { query } = useRoute()

if (query.code && query.setup_action === 'install') {
    const {data, error} = await useFetch<string>('/api/integrations/github/authenticate?token=' + query.code)

    if (error.value) {
        console.error('Error:', error.value)
    } else {
        if (data.value){
            const { data: user, error } = await useFetch<{
                login: string,
                id: number
            }>('/api/integrations/github/user?token=' + data.value)

            if (error.value) {
                console.error('Error2:', error.value)
            } else {
                console.log('Data222:', {
                        github_name: user.value?.login,
                        github_id: user.value?.id,
                    })
                const { data: app, error: appError } = await useFetch('/api/integrations/github/register', {
                    method: 'POST',
                    body: JSON.stringify({
                        github_name: user.value?.login,
                        github_id: user.value?.id,
                    })
                })

                if (error.value) {
                    console.error('Error3:', appError.value)
                } else {
                    console.log('Data3:', app.value)
                }
            }
        }
    }
}

</script>

<template>
    <p class="text-white text-5xl">
        It Worked
    </p>
</template>