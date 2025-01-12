import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";

export default eventHandler(async (event) => {
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
                username: true,
                grantId: true,
                image: true
            },
        });


        return data ? data : null

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
