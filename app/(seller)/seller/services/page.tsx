import { LIMIT_CARD } from "@/lib/utils";
import { ServiceSellerSection } from "@/modules/seller/ui/section/service-seller-section";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Layanan",
};

export default async function SellerServicesPage() {
  await prefetch(
    trpc.service.list.queryOptions({ page: 1, limit: LIMIT_CARD }),
  );

  return (
    <HydrateClient>
      <ServiceSellerSection />
    </HydrateClient>
  );
}
