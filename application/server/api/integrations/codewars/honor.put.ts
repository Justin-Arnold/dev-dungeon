import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from 'dev-dungeon-database'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    if (!body.honor) {
        return createError('Missing required fields');
    };

    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);


    if (!user) {
        return createError('User not found');
    }

    const { error } = await client
        .from('codewars_integration')
        .update({
            honor: body.honor,
        })
        .eq('user_id', user.id,);

    if (error) {
        createError(error.message);
    }
});