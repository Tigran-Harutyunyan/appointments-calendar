export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (!user.value && to.path !== "/") {
    return navigateTo("/");
  }

  if (to.path === "/" && user.value) {
    return navigateTo("/dashboard");
  }
});
