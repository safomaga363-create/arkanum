import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Cryptomus webhook handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // In production: verify Cryptomus signature
    // const isValid = verifyCryptomusSignature(body, req.headers.get('sign'));
    // if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });

    const { uuid, status, order_id } = body;

    if (status === "paid" || status === "success") {
      // Find payment by external ID
      const payment = await prisma.payment.findFirst({
        where: { externalId: order_id },
      });

      if (payment) {
        // Mark as completed
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "COMPLETED" },
        });

        // If contest entry, activate entry
        if (payment.type === "CONTEST_ENTRY" && payment.contestId) {
          const entry = await prisma.contestEntry.findFirst({
            where: {
              userId: payment.userId,
              contestId: payment.contestId,
              status: "PENDING",
            },
          });

          if (entry) {
            await prisma.contestEntry.update({
              where: { id: entry.id },
              data: { status: "ACTIVE" },
            });
          }
        }

        // If premium, activate subscription
        if (payment.type === "PREMIUM_SUBSCRIPTION") {
          const expiry = new Date();
          expiry.setMonth(expiry.getMonth() + 1);

          await prisma.user.update({
            where: { id: payment.userId },
            data: {
              isPremium: true,
              premiumExpiry: expiry,
            },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
