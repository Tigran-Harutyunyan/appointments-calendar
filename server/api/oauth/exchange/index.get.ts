import { nylas, nylasConfig } from "@/lib/nylas";
import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";
import { sendRedirect } from 'h3';

export default defineEventHandler(async (event) => {
    try {
        const { code } = await getQuery(event);
        const client = await serverSupabaseClient(event);
        const { data: sessionData } = await client.auth.getSession();
        const userId = sessionData?.session?.user.id;

        if (!code) {
            return createError({
                statusCode: 400,
                statusMessage: "No authorization code returned from Nylas"
            });
        }

        const codeExchangePayload = {
            clientSecret: nylasConfig.apiKey,
            clientId: nylasConfig.clientId as string,
            redirectUri: nylasConfig.callbackUri,
            code: code as string,
        };

        try {
            const response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
            const { grantId, email } = response;

            await prisma.user.update({
                where: {
                    id: userId as string,
                },
                data: {
                    grantId: grantId,
                    grantEmail: email,
                },
            });


            return sendRedirect(event, '/dashboard')
        } catch (error) {
            console.error(error);
        }

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
