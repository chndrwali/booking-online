import { CreateServiceSection } from "@/modules/seller/ui/section/create-service-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Service",
};

export default function CreateServicePage() {
  return <CreateServiceSection />;
}
