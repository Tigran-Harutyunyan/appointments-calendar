import { serverSupabaseClient } from "#supabase/server";
import prisma from "@/lib/db";
import { nylas, nylasConfig } from "@/lib/nylas";
import { sendRedirect } from "h3";

export default defineEventHandler(async (event) => {
  try {
    // Get 'code' from Nylas callback
    const { code } = await getQuery(event);
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: "No code returned from Nylas",
      });
    }

    // Get authenticated Supabase user
    const supabase = await serverSupabaseClient(event);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    const userEmail = userData.user?.email;

    if (!userId || !userEmail) {
      throw createError({
        statusCode: 401,
        statusMessage: "User not authenticated",
      });
    }

    // Exchange Nylas code for token
    const codeExchangePayload = {
      clientId: nylasConfig.clientId,
      clientSecret: nylasConfig.apiKey,
      redirectUri: nylasConfig.callbackUri,
      code,
    };

    let response;
    try {
      response = await nylas.auth.exchangeCodeForToken(codeExchangePayload);
    } catch (err) {
      console.error("Nylas token exchange failed:", err);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to exchange Nylas code",
      });
    }

    const { grantId, email: grantEmail } = response;

    // Upsert user in Prisma
    await prisma.user.upsert({
      where: { id: userId },
      update: { grantId, grantEmail },
      create: {
        id: userId,
        email: userEmail, // required field
        username: "", // optional, default empty
        grantId,
        grantEmail,
        name: userData.user?.user_metadata?.full_name || "",
        image: userData.user?.user_metadata?.avatar_url || undefined,
      },
    });

    // Redirect to dashboard
    return sendRedirect(event, "/dashboard");
  } catch (error) {
    console.error("Exchange error:", error);
    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Unexpected error",
    });
  }
});
