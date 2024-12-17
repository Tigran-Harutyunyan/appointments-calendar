import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";

export default defineEventHandler(async (event) => {
    const { payload } = await readBody(event);
    const client = await serverSupabaseClient(event);

    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: userId as string,
            },
            data: {
                name: payload?.fullName,
                image: payload?.profileImage,
            },
        });

        return user ?? null

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error?.message
        })
    }
});
