import SellerSidebar from "@/modules/seller/ui/layout/seller-sidebar";
import SellerHeader from "@/modules/seller/ui/layout/seller-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SellerSidebar />
      <SidebarInset>
        <SellerHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
