import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/database.types'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if(!body.username || !body.honor) {
        createError('Missing required fields');
    };

    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        createError('User not found');
    }

    console.log('honor', body.honor, 'username', body.username, 'user', user!.id);

    //post to codewars_integration table in supabase
    const { data, error } = await client.from('codewars_integration').upsert({
        username: body.username,
        honor: body.honor,
        user_id: user!.id,
    }, { onConflict: 'user_id' });

    console.log('d', data);

    if (error) {
        createError(error.message);
    }
    return { data };
});