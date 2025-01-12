import { nylas, nylasConfig } from "@/lib/nylas";

export default eventHandler(async (event) => {
    try {
        const authUrl = nylas.auth.urlForOAuth2({
            clientId: nylasConfig.clientId as string,
            redirectUri: nylasConfig.callbackUri,
        });
        return authUrl;

    } catch (error) {
        return createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : "An unexpected error occurred."
        })
    }
});
