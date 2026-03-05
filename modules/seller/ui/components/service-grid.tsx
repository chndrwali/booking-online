"use client";

import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Plus,
  Search,
  X,
  CheckSquare,
  Trash2,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { ServiceCard } from "@/modules/seller/ui/components/service-card";
import { appToast } from "@/components/custom/app-toast";
import { Suspense, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LIMIT_CARD } from "@/lib/utils";
import { ResponsiveModal } from "@/components/custom/responsive-modal";
import { AddServiceForm } from "../form/add-service-form";
import { DeleteConfirmationDialog } from "@/components/custom/alert-dialog-custom";
import type { Service } from "@/app/generated/prisma/client";
import type { ServiceFormValues } from "@/lib/form-schema";

// ============================================
// Main Export Component
// ============================================
export const ServiceGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 border-border bg-card pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <ErrorBoundary FallbackComponent={ServiceGridError}>
        <Suspense fallback={<ServiceGridSkeleton />} key={debouncedSearch}>
          <ServiceGridContent search={debouncedSearch} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

// ============================================
// Grid Content with Data
// ============================================
const ServiceGridContent = ({ search }: { search: string }) => {
  const [page, setPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const isActiveFilter =
    activeFilter === "all" ? undefined : activeFilter === "active";

  const { data } = useSuspenseQuery(
    trpc.service.list.queryOptions({
      page,
      limit: LIMIT_CARD,
      search: search || undefined,
      isActive: isActiveFilter,
    }),
  );

  const services = data.items;
  const totalPages = data.totalPages;
  const total = data.total;

  // ─── Mutations ─────────────────────────────────────────
  const { mutate: deleteService, isPending: isDeleting } = useMutation(
    trpc.service.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.service.list.queryKey(),
        });
        setDeletingService(null);
        appToast.success("Layanan berhasil dihapus");
      },
      onError: (err) => {
        appToast.error(err.message);
      },
    }),
  );

  const { mutate: bulkDelete, isPending: isBulkDeleting } = useMutation(
    trpc.service.bulkDelete.mutationOptions({
      onSuccess: (result) => {
        queryClient.invalidateQueries({
          queryKey: trpc.service.list.queryKey(),
        });
        setSelectedIds(new Set());
        setSelectionMode(false);
        setShowBulkDeleteDialog(false);
        appToast.success(`${result.deletedCount} layanan berhasil dihapus`);
      },
      onError: (err) => {
        appToast.error(err.message);
      },
    }),
  );

  const { mutate: updateService, isPending: isUpdating } = useMutation(
    trpc.service.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.service.list.queryKey(),
        });
        setEditingService(null);
        appToast.success("Layanan berhasil diperbarui");
      },
      onError: (err) => {
        appToast.error(err.message);
      },
    }),
  );

  const handleUpdateSubmit = (values: ServiceFormValues) => {
    if (!editingService) return;
    updateService({ id: editingService.id, ...values });
  };

  // ─── Selection Handlers ────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectionMode = () => {
    if (selectionMode) setSelectedIds(new Set());
    setSelectionMode(!selectionMode);
  };

  const selectAll = () => {
    setSelectedIds(new Set(services.map((s) => s.id)));
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    bulkDelete({ ids: Array.from(selectedIds) });
  };

  const handleSingleDelete = () => {
    if (deletingService) deleteService({ id: deletingService.id });
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    setPage(1);
  };

  // ─── Pagination Helpers ────────────────────────────────
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("ellipsis");
      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }
      if (page < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {/* Filter & Selection Controls */}
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <Select value={activeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[140px] h-10">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua</SelectItem>
            <SelectItem value="active">Aktif</SelectItem>
            <SelectItem value="inactive">Nonaktif</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button
            variant={selectionMode ? "default" : "outline"}
            size="sm"
            onClick={toggleSelectionMode}
          >
            <CheckSquare className="mr-2 h-4 w-4" />
            {selectionMode ? "Batal Pilih" : "Tandai"}
          </Button>

          {selectionMode && (
            <>
              <Button variant="outline" size="sm" onClick={selectAll}>
                Pilih Semua
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowBulkDeleteDialog(true)}
                disabled={selectedIds.size === 0}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus ({selectedIds.size})
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Grid */}
      {services.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onDelete={() => setDeletingService(service)}
                isDeleting={isDeleting}
                selectionMode={selectionMode}
                isSelected={selectedIds.has(service.id)}
                onToggleSelect={toggleSelect}
                onUpdate={() => setEditingService(service)}
              />
            ))}
          </div>

          {/* Edit Modal */}
          <ResponsiveModal
            title="Edit Layanan"
            open={!!editingService}
            onOpenChange={(open) => !open && setEditingService(null)}
            width="sm:max-w-[90%] lg:max-w-[70%]"
          >
            {editingService && (
              <AddServiceForm
                defaultValues={{
                  name: editingService.name,
                  shortDescription: editingService.shortDescription ?? "",
                  description: editingService.description ?? "",
                  duration: editingService.duration,
                  price: editingService.price,
                  image: editingService.image ?? "",
                  isActive: editingService.isActive,
                }}
                onSubmit={handleUpdateSubmit}
                isLoading={isUpdating}
              />
            )}
          </ResponsiveModal>

          {/* Single Delete Dialog */}
          <DeleteConfirmationDialog
            open={!!deletingService}
            onOpenChange={(open) => !open && setDeletingService(null)}
            title={`Hapus "${deletingService?.name}"?`}
            description="Tindakan ini tidak dapat dibatalkan. Layanan ini akan dihapus secara permanen beserta semua data terkait."
            onConfirm={handleSingleDelete}
            isDeleting={isDeleting}
            confirmationKeyword="DELETE"
            confirmationText="Ya, Hapus"
          />

          {/* Bulk Delete Dialog */}
          <DeleteConfirmationDialog
            open={showBulkDeleteDialog}
            onOpenChange={setShowBulkDeleteDialog}
            title={`Hapus ${selectedIds.size} layanan?`}
            description="Tindakan ini tidak dapat dibatalkan. Semua layanan yang dipilih akan dihapus secara permanen."
            onConfirm={handleBulkDelete}
            isDeleting={isBulkDeleting}
            confirmationKeyword="DELETE"
            confirmationText="Ya, Hapus Semua"
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {(page - 1) * LIMIT_CARD + 1}–
                {Math.min(page * LIMIT_CARD, total)} dari {total} layanan
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={
                        page <= 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers().map((p, i) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${i}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => setPage(p)}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        page >= totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">
            {search || activeFilter !== "all"
              ? "Tidak ada layanan ditemukan"
              : "Belum ada layanan"}
          </h3>
          <p className="text-muted-foreground text-center mt-1 mb-4">
            {search || activeFilter !== "all"
              ? "Coba ubah filter atau kata kunci pencarian"
              : "Buat layanan pertama Anda untuk mulai menerima booking"}
          </p>
          {!search && activeFilter === "all" && (
            <Button asChild>
              <Link href="/seller/services/create">
                <Plus className="mr-2 h-4 w-4" />
                Buat Layanan
              </Link>
            </Button>
          )}
        </Card>
      )}
    </>
  );
};

// ============================================
// Loading Skeleton
// ============================================
const ServiceGridSkeleton = () => (
  <div className="space-y-6">
    {/* Filter & selection skeleton */}
    <div className="flex items-center justify-between">
      <Skeleton className="h-10 w-[140px]" />
      <Skeleton className="h-8 w-24" />
    </div>
    {/* Card grid skeleton */}
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-video w-full" />
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// ============================================
// Error Fallback
// ============================================
const ServiceGridError = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <AlertCircle className="mb-4 size-12 text-destructive" />
    <h3 className="mb-2 text-lg font-semibold">Gagal Memuat Layanan</h3>
    <p className="mb-4 max-w-md text-muted-foreground">
      {error instanceof Error
        ? error.message
        : "Terjadi kesalahan saat memuat data."}
    </p>
    <Button onClick={resetErrorBoundary} variant="outline">
      <RefreshCw className="mr-2 size-4" />
      Coba Lagi
    </Button>
  </div>
);
