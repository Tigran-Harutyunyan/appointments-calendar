import prisma from "@/lib/db";
import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const params = await event.context.params;
  const { payload } = await readBody(event);
  const client = await serverSupabaseClient(event);
  const { data } = await client.auth.getUser();
  const userId = data.user?.id;

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

    const data = await prisma.eventType.update({
      where: {
        id: params?.eventTypeId,
        userId,
      },
      data: {
        title: payload?.title,
        duration: Number(payload?.duration),
        url: payload?.url,
        description: payload?.description,
        userId,
        videoCallSoftware: payload?.videoCallSoftware,
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
