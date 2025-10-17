// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxt/image",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "@nuxtjs/supabase",
    "@uploadthing/nuxt",
  ],
  alias: {
    ".prisma/client/index-browser":
      "./node_modules/.prisma/client/index-browser.js",
  },
  supabase: {
    // Options
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/",
      callback: "/",
      include: undefined,
      exclude: [],
      cookieRedirect: true,
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
    },
  },
  compatibilityDate: "2024-11-10",
});
