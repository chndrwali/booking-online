"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays, startOfDay, addMinutes, isBefore } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Loader2,
  Lock,
  CalendarCheck,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";

const bookingFormSchema = z.object({
  buyerName: z.string().min(2, "Nama minimal 2 karakter"),
  buyerEmail: z.string().email("Email tidak valid"),
  buyerPhone: z.string().min(10, "Nomor telepon minimal 10 digit"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function generateTimeSlots(duration: number): string[] {
  const slots: string[] = [];
  const startHour = 8; // 08:00
  const endHour = 20; // 20:00
  const startMin = startHour * 60;
  const endMin = endHour * 60;

  for (let min = startMin; min + duration <= endMin; min += duration) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    slots.push(
      `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
    );
  }
  return slots;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const trpc = useTRPC();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    addDays(new Date(), 1),
  );
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"slot" | "form">("slot");

  const { data: service, isLoading: serviceLoading } = useQuery(
    trpc.service.getById.queryOptions({ id: serviceId }),
  );

  const dateString = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const { data: bookedSlots } = useQuery(
    trpc.booking.getByDate.queryOptions(
      { serviceId, date: dateString },
      { enabled: !!selectedDate },
    ),
  );

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      buyerName: "",
      buyerEmail: "",
      buyerPhone: "",
    },
  });

  const bookingMutation = useMutation(
    trpc.booking.create.mutationOptions({
      onSuccess: (data) => {
        if (data.paymentLink) {
          toast.success("Booking dibuat! Mengarahkan ke pembayaran...");
          window.location.href = data.paymentLink;
        } else {
          router.push(`/booking/${data.booking.id}`);
        }
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const timeSlots = service ? generateTimeSlots(service.duration) : [];

  const isSlotBooked = (time: string) => {
    if (!bookedSlots || !selectedDate) return false;
    const [h, m] = time.split(":").map(Number);
    const slotDate = startOfDay(selectedDate);
    slotDate.setHours(h, m, 0, 0);
    return bookedSlots.some(
      (b) => new Date(b.startTime).getTime() === slotDate.getTime(),
    );
  };

  const isSlotPast = (time: string) => {
    if (!selectedDate) return false;
    const [h, m] = time.split(":").map(Number);
    const slotDate = startOfDay(new Date(selectedDate));
    slotDate.setHours(h, m, 0, 0);
    return isBefore(slotDate, new Date());
  };

  function onSubmitBooking(values: BookingFormValues) {
    if (!selectedDate || !selectedSlot) return;

    const [h, m] = selectedSlot.split(":").map(Number);
    const startTime = startOfDay(new Date(selectedDate));
    startTime.setHours(h, m, 0, 0);

    bookingMutation.mutate({
      serviceId,
      buyerName: values.buyerName,
      buyerEmail: values.buyerEmail,
      buyerPhone: values.buyerPhone,
      startTime: startTime.toISOString(),
    });
  }

  if (serviceLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-96 animate-pulse rounded bg-muted" />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="h-80 animate-pulse rounded bg-muted" />
            <div className="h-80 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Layanan tidak ditemukan</h1>
        <Button className="mt-4" asChild>
          <Link href="/">Kembali</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Service Info */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">{service.name}</h1>
            {service.seller.name && (
              <p className="text-muted-foreground mt-1">
                oleh {service.seller.name}
              </p>
            )}
            {service.description && (
              <p className="text-muted-foreground mt-3">
                {service.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="secondary" className="gap-1 text-sm">
                <Clock className="h-3.5 w-3.5" />
                {service.duration} menit
              </Badge>
              <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                {formatRupiah(service.price)}
              </span>
            </div>
          </div>

          {step === "slot" ? (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Calendar */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5 text-violet-500" />
                    Pilih Tanggal
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    className="rounded-md"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-violet-500" />
                    Pilih Waktu
                  </CardTitle>
                  {selectedDate && (
                    <CardDescription>
                      {format(selectedDate, "EEEE, dd MMMM yyyy", {
                        locale: localeId,
                      })}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => {
                        const booked = isSlotBooked(time);
                        const past = isSlotPast(time);
                        const disabled = booked || past;
                        const selected = selectedSlot === time;

                        return (
                          <Button
                            key={time}
                            variant={selected ? "default" : "outline"}
                            size="sm"
                            disabled={disabled}
                            onClick={() => setSelectedSlot(time)}
                            className={`h-10 ${
                              selected
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                                : ""
                            } ${
                              disabled
                                ? "opacity-40 cursor-not-allowed line-through"
                                : ""
                            }`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Pilih tanggal terlebih dahulu
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Continue Button */}
              {selectedSlot && (
                <div className="md:col-span-2">
                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                    onClick={() => setStep("form")}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Lanjut ke Data Diri — {selectedSlot}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Booking Form
            <Card className="max-w-lg mx-auto border-0 shadow-md">
              <CardHeader>
                <CardTitle>Data Diri</CardTitle>
                <CardDescription>
                  {selectedDate &&
                    `${format(selectedDate, "EEEE, dd MMMM yyyy", {
                      locale: localeId,
                    })} — ${selectedSlot}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmitBooking)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="buyerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Nama Lengkap
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="buyerPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Nomor Telepon
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="0812xxxxxxxx" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep("slot")}
                      >
                        Kembali
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
                        disabled={bookingMutation.isPending}
                      >
                        {bookingMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <Lock className="mr-2 h-4 w-4" />
                            Bayar DP — {formatRupiah(service.price)}
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
