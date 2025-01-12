import Nylas from "nylas";

export const nylasConfig = {
  clientId: process.env.NYLAS_CLIENT_ID,
  callbackUri: process.env.NUXT_PUBLIC_APP_URL + "/api/oauth/exchange",
  apiKey: process.env.NYLAS_API_SECRET_KEY,
  apiUri: process.env.NYLAS_API_URI,
};

const AuthConfig = {
  clientId: process.env.NYLAS_CLIENT_ID as string,
  redirectUri: "http://localhost:3000/oauth/exchange",
};
export const nylas = new Nylas({
  apiKey: process.env.NYLAS_API_SECRET_KEY!,
  apiUri: process.env.NYLAS_API_URL,
});
