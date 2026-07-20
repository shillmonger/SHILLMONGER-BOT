import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

interface TelegramUpdate {
  message?: {
    chat: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    text?: string;
    from?: {
      id: number;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const body: TelegramUpdate = await request.json();
    const message = body.message;

    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const text = message.text;
    const chatId = message.chat.id;
    const username = message.chat.username || message.from?.username;
    const firstName = message.chat.first_name || message.from?.first_name;
    const lastName = message.chat.last_name || message.from?.last_name;

    // Handle /start command with token
    if (text.startsWith('/start ')) {
      const token = text.split(' ')[1];

      if (!token) {
        return NextResponse.json({ ok: true });
      }

      // Find user by token
      const user = await User.findOne({
        telegram_token: token,
        telegram_token_expires: { $gt: new Date() }
      });

      if (!user) {
        // Token not found or expired
        await sendTelegramMessage(
          chatId,
          '❌ Invalid or expired connection token. Please try connecting again from the website.'
        );
        return NextResponse.json({ ok: true });
      }

      // Update user with Telegram details
      user.telegram_chat_id = chatId.toString();
      user.telegram_username = username || `@${chatId}`;
      user.telegram_connected = true;
      user.telegram_connected_date = new Date();
      
      // Clear the token after use
      user.telegram_token = undefined;
      user.telegram_token_expires = undefined;
      
      await user.save();

      // Send success message to Telegram
      await sendTelegramMessage(
        chatId,
        `✅ *Telegram Connected Successfully!*\n\n` +
        `Welcome, ${firstName || 'User'}!\n\n` +
        `Your Telegram account has been linked to your trading dashboard.\n` +
        `You will now receive important notifications about:\n` +
        `• Trading activity\n` +
        `• Subscription updates\n` +
        `• Account security alerts\n` +
        `• Withdrawal confirmations\n\n` +
        `You can return to the dashboard to manage your connection.`
      );

      return NextResponse.json({ ok: true });
    }

    // Handle /start without token
    if (text === '/start') {
      await sendTelegramMessage(
        chatId,
        `👋 *Welcome to ShillmongerBot!*\n\n` +
        `To connect your Telegram account to your trading dashboard:\n\n` +
        `1. Log in to your dashboard\n` +
        `2. Go to Telegram Setup\n` +
        `3. Click "Connect Telegram"\n` +
        `4. Follow the instructions\n\n` +
        `This will link your account and enable notifications.`
      );
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Always return ok to Telegram to avoid retries
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  
  if (!botToken) {
    console.error('TELEGRAM_BOT_TOKEN not configured');
    return;
  }

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'Markdown',
      }),
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error);
  }
}
