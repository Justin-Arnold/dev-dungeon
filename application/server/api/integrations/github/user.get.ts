export default defineEventHandler(async (event) => {
    const { token } = await getQuery(event);
    console.log('token: ', token);
    if (!token){
        createError('Token missing');
    }

    try {
        const userResponse = await $fetch<{
            login: string,
            id: number
        }>('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token}`,
            },
        });
        console.log('userResponse: ', userResponse);

        return userResponse;

    } catch (error) {
        // Handle any exceptions that might occur
        return { data: undefined, error: error };
    }
});

