import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const params = await event.context.params;
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;
    const { isChecked } = await readBody(event);

    console.log(isChecked)

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    if (typeof isChecked !== 'boolean') {
        setResponseStatus(event, 401, 'Status not set')
        return;
    }

    if (!params?.eventTypeId || typeof params?.eventTypeId !== 'string') {
        setResponseStatus(event, 401, 'Event ID not set')
        return;
    }

    try {
        const data = await prisma.eventType.update({
            where: {
                id: params.eventTypeId,
                userId,
            },
            data: {
                active: isChecked,
            },
        });

        return data;
    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error
        })
    }


});