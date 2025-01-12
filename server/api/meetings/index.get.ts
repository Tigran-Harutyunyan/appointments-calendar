import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { nylas } from "@/lib/nylas";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);

    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                grantId: true,
                grantEmail: true,
            },
        });

        if (!userData) {
            throw new Error("User not found");
        }
        const data = await nylas.events.list({
            identifier: userData?.grantId as string,
            queryParams: {
                calendarId: userData?.grantEmail as string,
            },
        });

        return data;

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
