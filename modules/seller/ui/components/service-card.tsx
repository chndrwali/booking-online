"use client";

import { Service } from "@/app/generated/prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { formatRupiah } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: Service;
  onDelete: () => void;
  isDeleting: boolean;
  selectionMode: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate?: () => void;
}

export const ServiceCard = ({
  service,
  onDelete,
  isDeleting,
  selectionMode,
  isSelected,
  onToggleSelect,
  onUpdate,
}: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "group overflow-hidden border shadow-sm transition-all hover:shadow-md",
        selectionMode && "cursor-pointer",
        isSelected && "ring-2 ring-primary border-primary",
      )}
      onClick={selectionMode ? () => onToggleSelect(service.id) : undefined}
    >
      {service.image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {selectionMode && (
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggleSelect(service.id)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <CardTitle className="text-lg">{service.name}</CardTitle>
          </div>
          <Badge variant={service.isActive ? "default" : "secondary"}>
            {service.isActive ? "Aktif" : "Nonaktif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {service.shortDescription && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.shortDescription}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {service.duration} menit
          </span>
          <span className="font-semibold text-primary">
            {formatRupiah(service.price)}
          </span>
        </div>
        {!selectionMode && (
          <div className="flex items-center gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onUpdate}
            >
              <Pencil className="mr-1 h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={onDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
