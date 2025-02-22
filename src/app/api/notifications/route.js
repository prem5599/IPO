// src/app/api/notifications/route.js
import { NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure web-push
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request) {
  try {
    const data = await request.json();
    const { subscription, ipoSymbol } = data;

    // Here you would:
    // 1. Validate the subscription
    // 2. Store it in your database
    // 3. Associate it with the IPO

    // Example notification
    const payload = JSON.stringify({
      title: 'IPO Notification',
      body: `You've successfully subscribed to ${ipoSymbol} notifications`,
      url: `/ipo/${ipoSymbol.toLowerCase()}`
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}