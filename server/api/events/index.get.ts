import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const params = await event.context.params;
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const data = await prisma.user.findUnique({
            where: {
                id: userId,
            },

            select: {
                EventType: {
                    select: {
                        id: true,
                        active: true,
                        title: true,
                        url: true,
                        duration: true,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                },
                username: true,
            },
        });

        return data;
    } catch (error) {
        console.error(error);
    }

});

