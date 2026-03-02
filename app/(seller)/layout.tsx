import { getSession } from "@/hooks/get-session";
import { redirect } from "next/navigation";
import SellerLayout from "@/modules/seller/ui/layout/seller-layout";

type SellerLayoutProps = {
  children: React.ReactNode;
};

export default async function SellerLayoutWrapper({
  children,
}: SellerLayoutProps) {
  const session = await getSession();
  const isSeller = session?.user.role === "seller";

  if (!isSeller) redirect("/login");

  return <SellerLayout>{children}</SellerLayout>;
}
