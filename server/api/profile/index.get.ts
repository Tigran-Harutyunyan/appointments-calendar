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
        const data = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                name: true,
                email: true,
                image: true,
            },
        });


        return data ? data : null

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
