import { createTRPCRouter } from "@/trpc/init";
import { serviceRouter } from "@/modules/seller/server/service";
import { bookingRouter } from "@/modules/seller/server/booking";
import { onboardingRouter } from "@/modules/auth/server/onboarding";
import { buyerRouter } from "@/trpc/routers/buyer";

export const appRouter = createTRPCRouter({
  service: serviceRouter,
  booking: bookingRouter,
  onboarding: onboardingRouter,
  buyer: buyerRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
