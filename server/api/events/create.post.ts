import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { parseWithZod } from "@conform-to/zod";
import {
    EventTypeServerSchema,
} from "@/lib/zodSchemas";

export default defineEventHandler(async (event) => {

    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;
    const { payload } = await readBody(event);

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {
        const formData = new FormData();
        formData.append("url", payload?.url);
        formData.append("videoCallSoftware", payload?.videoCallSoftware);
        formData.append("duration", payload?.duration);
        formData.append("title", payload?.title);
        formData.append("description", payload?.description);

        const submission = await parseWithZod(formData, {
            schema: EventTypeServerSchema({
                async isUrlUnique() {
                    const data = await prisma.eventType.findFirst({
                        where: {
                            userId,
                            url: formData.get("url") as string,
                        },
                    });
                    return !data;
                },
            }),

            async: true,
        });

        console.log(submission)

        if (submission.status !== "success") {
            return submission.reply();
        }

        const data = await prisma.eventType.create({
            data: {
                title: submission.value.title,
                duration: Number(submission.value.duration),
                url: submission.value.url,
                description: submission.value.description,
                userId,
                videoCallSoftware: submission.value.videoCallSoftware,
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
