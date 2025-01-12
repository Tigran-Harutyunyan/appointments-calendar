import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";
import { parseWithZod } from "@conform-to/zod";
import {
    onboardingSchema,
} from "@/lib/zodSchemas";

export default defineEventHandler(async (event) => {
    const { payload } = await readBody(event);
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const user = data.user;

    if (!user?.id) {
        setResponseStatus(event, 401)
        return;
    }

    const formData = new FormData();
    formData.append("username", payload?.username);
    formData.append("fullName", payload?.fullName);

    try {
        const submission = await parseWithZod(formData, {
            schema: onboardingSchema({
                async isUsernameUnique() {
                    const exisitngSubDirectory = await prisma.user.findUnique({
                        where: {
                            username: formData.get("username") as string,
                        },
                    });
                    return !exisitngSubDirectory;
                },
            }),

            async: true,
        });

        if (submission.status !== "success") {
            return submission.reply();
        }

        const existingUser = await prisma.user.findFirst({
            where: { id: user?.id },
        });

        let onboardingData;

        if (!existingUser) {
            onboardingData = await prisma.user.create({
                data: {
                    id: user?.id,
                    email: user?.email || '',
                    username: submission.value?.username,
                    name: submission.value?.fullName,
                    image: user?.user_metadata?.avatar_url,
                    Availability: {
                        createMany: {
                            data: [
                                {
                                    day: "Monday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Tuesday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Wednesday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Thursday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Friday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Saturday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Sunday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                            ],
                        },
                    },
                },
            })
        } else {
            onboardingData = await prisma.user.update({
                where: {
                    id: user?.id,
                },
                data: {
                    username: submission.value.username,
                    name: submission.value.fullName,
                    Availability: {
                        createMany: {
                            data: [
                                {
                                    day: "Monday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Tuesday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Wednesday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Thursday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Friday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Saturday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                                {
                                    day: "Sunday",
                                    fromTime: "08:00",
                                    tillTime: "18:00",
                                },
                            ],
                        },
                    },
                },
            })
        }

        if (!onboardingData) {
            setResponseStatus(event, 401)
            return
        }

        return onboardingData;

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
