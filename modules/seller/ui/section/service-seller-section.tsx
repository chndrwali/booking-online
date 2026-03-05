"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import PageContainer from "@/components/custom/page-container";
import { ServiceGrid } from "../components/service-grid";

export const ServiceSellerSection = () => {
  return (
    <PageContainer
      pageTitle="Layanan Saya"
      pageDescription="Kelola layanan yang Anda Tawarkan"
      pageHeaderAction={
        <Button asChild>
          <Link href="/seller/services/create">
            <Plus className="mr-2 h-4 w-4" />
            Buat Layanan
          </Link>
        </Button>
      }
      scrollable={false}
    >
      <ServiceGrid />
    </PageContainer>
  );
};
