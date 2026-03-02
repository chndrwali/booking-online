import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import config from "@/lib/config-env";

/**
 * Mayar Webhook Handler
 * Endpoint: POST /api/webhook/mayar
 *
 * Mayar akan mengirim webhook dengan event `payment.received`
 * ketika pembayaran berhasil.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-callback-signature") || "";

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", config.env.mayarWebhookSecret)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("[Webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(body);
    const event = payload.event || payload.type;

    // Hanya proses event payment.received
    if (event !== "payment.received") {
      return NextResponse.json({ message: "Event ignored" }, { status: 200 });
    }

    const paymentId = payload.data?.id;
    if (!paymentId) {
      console.error("[Webhook] No payment ID in payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Cari booking berdasarkan paymentId
    const booking = await prisma.booking.findFirst({
      where: { paymentId: paymentId },
    });

    if (!booking) {
      console.error(`[Webhook] Booking not found for paymentId: ${paymentId}`);
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Idempotent: skip jika sudah PAID
    if (booking.status === "PAID") {
      return NextResponse.json(
        { message: "Already processed" },
        { status: 200 },
      );
    }

    // Update status ke PAID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "PAID" },
    });

    console.log(`[Webhook] Booking ${booking.id} marked as PAID`);
    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("[Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
