import BuyerSidebar from "@/modules/buyer/ui/layout/buyer-sidebar";
import BuyerHeader from "@/modules/buyer/ui/layout/buyer-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <BuyerSidebar />
      <SidebarInset>
        <BuyerHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
