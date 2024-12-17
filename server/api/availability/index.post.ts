import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;
    const payload = await readBody(event);

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const data = await prisma.$transaction(
            payload.availabilityData.map((item) =>
                prisma.availability.update({
                    where: { id: item.id },
                    data: {
                        isActive: item.isActive,
                        fromTime: item.fromTime,
                        tillTime: item.tillTime,
                    },
                })
            )
        );

        return { status: "success", message: "Availability updated successfully", data };

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: 'Failed to update availability'
        })
    }
});
