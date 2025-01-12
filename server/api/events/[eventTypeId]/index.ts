import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const params = await event.context.params;
  const client = await serverSupabaseClient(event);
  const { data } = await client.auth.getUser();
  const userId = data.user?.id;

  if (!userId) {
    setResponseStatus(event, 401)
    return;
  }


  try {
    const data = await prisma.eventType.findUnique({
      where: {
        id: params?.eventTypeId as string,
      },
      select: {
        title: true,
        description: true,
        duration: true,
        url: true,
        id: true,
        videoCallSoftware: true,
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }

});
