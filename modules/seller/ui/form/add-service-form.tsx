"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, type ServiceFormValues } from "@/lib/form-schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TiptapEditor } from "@/components/custom/tiptap-editor";
import { Switch } from "@/components/ui/switch";
import { SingleImageUpload } from "@/components/custom/image-upload";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useEffect } from "react";

interface AddServiceFormProps {
  defaultValues?: ServiceFormValues;
  onSubmit: (data: ServiceFormValues) => void;
  isLoading?: boolean;
}

const getDefaultValues = (
  overrides?: Partial<ServiceFormValues>,
): ServiceFormValues => ({
  name: overrides?.name || "",
  shortDescription: overrides?.shortDescription || "",
  description: overrides?.description || "",
  duration: overrides?.duration || 60,
  price: overrides?.price || 50000,
  image: overrides?.image || "",
  isActive: overrides?.isActive ?? true,
});

export const AddServiceForm = ({
  defaultValues,
  onSubmit,
  isLoading,
}: AddServiceFormProps) => {
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: getDefaultValues(defaultValues),
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset(getDefaultValues(defaultValues));
    }
  }, [defaultValues, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Layanan</FormLabel>
              <FormControl>
                <Input
                  placeholder="contoh: Potong Rambut Premium"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ringkasan singkat layanan Anda..."
                  className="min-h-[80px]"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Opsional — tampil di kartu layanan
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi</FormLabel>
              <FormControl>
                <TiptapEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Jelaskan layanan Anda..."
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Opsional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durasi (menit)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={15}
                    step={15}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga (Rp)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1000}
                    step={1000}
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar</FormLabel>
              <FormControl>
                <SingleImageUpload
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange("")}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>Opsional — URL gambar layanan</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Status Layanan</FormLabel>
                <FormDescription>
                  Aktifkan jika layanan ini tersedia untuk dipesan.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="min-w-[120px]">
            {isLoading && <Spinner />}
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
};
