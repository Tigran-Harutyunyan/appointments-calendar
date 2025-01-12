import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { nylas } from "@/lib/nylas";
import {
  format,
} from "date-fns";
export default defineEventHandler(async (event) => {
  const { userName, selectedDate } = getQuery(event);
  const client = await serverSupabaseClient(event);
  const { data } = await client.auth.getUser();
  const userId = data.user?.id;

  if (!userId || !selectedDate || !userName) {
    setResponseStatus(event, 401)
    return;
  }


  try {
    const currentDay = format(selectedDate, "EEEE");

    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);


    const data = await prisma.availability.findFirst({
      where: {
        day: currentDay as Prisma.EnumDayFilter,
        User: {
          username: userName,
        },
      },
      select: {
        fromTime: true,
        tillTime: true,
        id: true,
        User: {
          select: {
            grantEmail: true,
            grantId: true,
          },
        },
      },
    });

    const nylasCalendarData = await nylas.calendars.getFreeBusy({
      identifier: data?.User.grantId as string,
      requestBody: {
        startTime: Math.floor(startOfDay.getTime() / 1000),
        endTime: Math.floor(endOfDay.getTime() / 1000),
        emails: [data?.User.grantEmail as string],
      },
    });

    return { data, nylasCalendarData }

  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
    })
  }
});
