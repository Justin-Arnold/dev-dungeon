export default defineEventHandler(async (event) => {
    const { token } = await getQuery(event);

    if (!token){
        createError('Token missing');
    }

    const clientId = process.env.GITHUB_APP_CLIENT_ID;
    const clientSecret = process.env.GITHUB_APP_CLIENT_SECRET;

    if (!clientId || !clientSecret){
        createError('GitHub App credentials missing');
    }

    const queryParams = `?client_id=${clientId}&client_secret=${clientSecret}&code=${token}`
    try {
        const tokenResponse = await $fetch<{
            access_token: string
        }>(`https://github.com/login/oauth/access_token${queryParams}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                clientId,
                clientSecret,
                token,
            })
        });
        console.log('tokenResponse: ', tokenResponse);
        // Handle the response from GitHub
        if (tokenResponse.access_token) {
            return tokenResponse.access_token;
        } else {
            createError('GitHub token not found');
        }
    } catch (error) {
        createError(String(error));
    }
});
