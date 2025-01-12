import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { nylas } from "@/lib/nylas";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const { eventId } = await event.context.params;
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: userId as string,
            },
            select: {
                grantEmail: true,
                grantId: true,
            },
        });

        const data = await nylas.events.destroy({
            eventId: eventId as string,
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
