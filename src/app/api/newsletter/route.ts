import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { randomBytes } from "crypto";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });

    if (existing?.isConfirmed) {
      return NextResponse.json({ error: "Vous êtes déjà inscrit à la newsletter." }, { status: 400 });
    }

    const token = randomBytes(32).toString("hex");

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { token, unsubscribedAt: null },
      create: { email, token, isConfirmed: false },
    });

    // En prod : envoyer l'email de confirmation avec le token
    // Pour le MVP, on confirme directement
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isConfirmed: true },
    });

    return NextResponse.json({ success: true, message: "Inscription confirmée !" });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
