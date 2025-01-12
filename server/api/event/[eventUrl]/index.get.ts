import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const params = event.context.params;
    const { username } = getQuery(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const eventType = await prisma.eventType.findFirst({
            where: {
                url: params?.eventUrl as string,
                user: {
                    username: username as string,
                },
                active: true,
            },
            select: {
                id: true,
                description: true,
                title: true,
                duration: true,
                videoCallSoftware: true,

                user: {
                    select: {
                        image: true,
                        name: true,
                        Availability: {
                            select: {
                                day: true,
                                isActive: true,
                            },
                        },
                    },
                },
            },
        });


        return eventType;
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
