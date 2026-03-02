import { createTRPCRouter } from "@/trpc/init";
import { serviceRouter } from "@/trpc/routers/service";
import { bookingRouter } from "@/trpc/routers/booking";
import { onboardingRouter } from "@/modules/auth/server/onboarding";

export const appRouter = createTRPCRouter({
  service: serviceRouter,
  booking: bookingRouter,
  onboarding: onboardingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
