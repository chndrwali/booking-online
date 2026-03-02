import { createTRPCRouter } from "@/trpc/init";
import { serviceRouter } from "@/trpc/routers/service";
import { bookingRouter } from "@/trpc/routers/booking";

export const appRouter = createTRPCRouter({
  service: serviceRouter,
  booking: bookingRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
