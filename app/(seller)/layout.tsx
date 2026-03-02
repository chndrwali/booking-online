import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";
import { getOnboarding } from "@/hooks/get-onboarding";
import SellerLayout from "@/modules/seller/ui/layout/seller-layout";

type SellerLayoutProps = {
  children: React.ReactNode;
};

export default async function SellerLayoutWrapper({
  children,
}: SellerLayoutProps) {
  const session = await getSession();

  if (!session) redirect("/login");

  const user = await getOnboarding(session.user.id);
  const isSeller = user?.role === "seller";

  if (!isSeller) redirect("/");

  return <SellerLayout>{children}</SellerLayout>;
}
