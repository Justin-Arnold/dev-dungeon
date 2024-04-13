import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if(!body.github_name|| body.github_id) {
        createError('Missing required fields');
    };

    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        createError('User not found');
    }

    //post to github_integration table in supabase
    const { data, error } = await client.from('github_integration').insert({
        github_name: body.github_name,
        github_id: body.github_id,
        user_id: user!.id,
    });

    if (error) {
        createError(error.message);
    }
    return { data };
});
