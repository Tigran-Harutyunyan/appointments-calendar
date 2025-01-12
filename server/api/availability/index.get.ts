import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const data = await prisma.availability.findMany({
            where: {
                userId: userId,
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
