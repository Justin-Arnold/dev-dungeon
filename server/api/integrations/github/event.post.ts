import { serverSupabaseServiceRole } from '#supabase/server'
import type { Database } from '~/types/database.types'
import * as crypto from "crypto";

export default defineEventHandler(async (event) => {
    const headers = event.headers
    const xHubSignature = headers.get('x-hub-signature-256')

    const body = await readBody(event)
    if (xHubSignature === null) {
        createError('No signature provided')
    }
    const isVerified = verify_signature(body, xHubSignature!)

    if (!isVerified) {
        createError('Signature verification failed')
    }

    if (body.action) {
        if (body.action === 'deleted' && body.installation.repository_selection === 'all') {
            console.log('all repositories have been deleted access - ', body.installation.account.login)
            const deletedUserId = body.installation.account.id
            const client = await serverSupabaseServiceRole<Database>(event)

            const { data, error } = await client.from('github_integration').delete().match({ github_id: deletedUserId })
            if (error) {
                createError(error.message)
            }
            return { data }
        }
    }

    if (body.commits) {
        const commits = body.commits as Array<any>
        let groupedCommits: any = {}

        for (const commit of commits) {
            const author = commit.committer.username as string
            if (!groupedCommits[author]) {
                groupedCommits[author] = []
            }
            groupedCommits[author].push(commit)
        }

        const authors = Object.keys(groupedCommits)
        authors.forEach(async (author) => {
            const client = await serverSupabaseServiceRole<Database>(event)
            const { data: existingUser, error: existingUserError } = await client.from('github_integration').select().eq('github_name', author)

            if (existingUserError) {
                createError(existingUserError.message)
            }

            const existing = existingUser === null ? null : existingUser[0]
            const existingCommitCount = existing ? existing.commit_count : 0

            const { data, error } = await client.from('github_integration').update({commit_count: groupedCommits[author].length + existingCommitCount}).match({ github_name: author })

            if (error) {
                createError(error.message)
            }
        })
    }
})





const verify_signature = (body: any, untrustedSignature: string) => {
    const WEBHOOK_SECRET: string | undefined = process.env.GITHUB_APP_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("WEBHOOK_SECRET is not set");
    }
    const signature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest("hex");
    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted =  Buffer.from(untrustedSignature, 'ascii');
    return crypto.timingSafeEqual(trusted, untrusted);
};

