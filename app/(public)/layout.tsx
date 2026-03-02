import { PublicFooter } from "@/modules/public/ui/layout/public-footer";
import { PublicNavbar } from "@/modules/public/ui/layout/public-navbar";

type PublicLayoutProps = {
  children: React.ReactNode;
};

const PublicLayoutWrapper = async ({ children }: PublicLayoutProps) => {
  return (
    <main className="relative w-full flex flex-col flex-1 px-5 xs:px-10 overflow-hidden">
      <div className="mx-auto w-full max-w-7xl">
        <PublicNavbar />
        <div className="py-[10vh]">{children}</div>
        <PublicFooter />
      </div>
    </main>
  );
};

export default PublicLayoutWrapper;
