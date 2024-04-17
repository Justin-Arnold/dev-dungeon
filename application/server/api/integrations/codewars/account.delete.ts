import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'
import type { Database } from 'dev-dungeon-database'

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient<Database>(event);
    const user = await serverSupabaseUser(event);

    if (!user) {
        return createError('User not found');
    }

    //post to codewars_integration table in supabase
    const { error } = await client
        .from('codewars_integration')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        createError(error.message);
    }
});