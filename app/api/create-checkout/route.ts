import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const PLANS = {
  pro: {
    name: "Lokky Pro",
    priceId: "price_1TlGMePsepNfoqv3hHoS2FlN",
  },
  agence: {
    name: "Lokky Agence",
    priceId: "price_1TlGNuPsepNfoqv3L1RoJhpS",
  },
};

export async function POST(request: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const body = await request.json();
    const { plan, userId, email } = body;

    if (!plan || !PLANS[plan as keyof typeof PLANS]) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as keyof typeof PLANS];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      metadata: { userId, plan },
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur Stripe";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}