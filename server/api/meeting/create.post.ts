import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { nylas } from "@/lib/nylas";

export default defineEventHandler(async (event) => {
    const { payload } = await readBody(event);
    const { username, eventTypeId, fromTime, eventDate, meetingLength, name, email } = payload;
    const client = await serverSupabaseClient(event);
    const { data } = await client.auth.getUser();
    const userId = data.user?.id;

    if (!eventTypeId || !username || !fromTime || !eventDate || !meetingLength || !name || !email) {
        return createError({
            statusCode: 500,
            statusMessage: 'Missing data'
        })
    }

    if (!userId) {
        setResponseStatus(event, 401)
        return;
    }

    try {

        const getUserData = await prisma.user.findUnique({
            where: {
                username: username as string,
            },
            select: {
                grantEmail: true,
                grantId: true,
            },
        });

        if (!getUserData) {
            throw new Error("User not found");
        }

        const eventTypeData = await prisma.eventType.findUnique({
            where: {
                id: eventTypeId as string,
            },
            select: {
                title: true,
                description: true,
            },
        });

        const formTime = fromTime as string;
        const startDateTime = new Date(`${eventDate}T${formTime}:00`);

        // Calculate the end time by adding the meeting length (in minutes) to the start time
        const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

        const response = await nylas.events.create({
            identifier: getUserData?.grantId as string,
            requestBody: {
                title: eventTypeData?.title,
                description: eventTypeData?.description,
                when: {
                    startTime: Math.floor(startDateTime.getTime() / 1000),
                    endTime: Math.floor(endDateTime.getTime() / 1000),
                },
                conferencing: {
                    autocreate: {},
                    provider: "Google Meet",
                },
                participants: [
                    {
                        name: name as string,
                        email: email as string,
                        status: "yes",
                    },
                ],
            },
            queryParams: {
                calendarId: getUserData?.grantEmail as string,
                notifyParticipants: true,
            },
        });

        return response;

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
