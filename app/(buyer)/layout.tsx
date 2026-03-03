import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";
import { getOnboarding } from "@/hooks/get-onboarding";
import BuyerLayout from "@/modules/buyer/ui/layout/buyer-layout";

type BuyerLayoutProps = {
  children: React.ReactNode;
};

export default async function BuyerLayoutWrapper({
  children,
}: BuyerLayoutProps) {
  const session = await getSession();

  if (!session) redirect("/login");

  const user = await getOnboarding(session.user.id);
  const isBuyer = user?.role === "buyer";

  if (!isBuyer) redirect("/");

  return <BuyerLayout>{children}</BuyerLayout>;
}
