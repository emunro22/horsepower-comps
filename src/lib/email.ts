import { Resend } from 'resend';

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set. Configure it in your environment variables.');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const NOTIFICATION_EMAIL = 'Decolow@icloud.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Clutch Competitions <noreply@clutchcompetitions.co.uk>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://clutch-competitions.vercel.app';
const LOGO_URL = `${APP_URL}/logo.png`;

// ── Shared email wrapper matching the site's dark theme ──

function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0A0E1A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 32px;">
      <img src="${LOGO_URL}" alt="Clutch Competitions" width="56" height="56" style="width: 56px; height: 56px; object-fit: contain; display: inline-block;" />
      <div style="margin-top: 12px;">
        <span style="font-size: 20px; font-weight: 800; color: #F1F5F9; letter-spacing: -0.5px;">Clutch </span><span style="font-size: 20px; font-weight: 800; color: #F59E0B; letter-spacing: -0.5px;">Competitions</span>
      </div>
    </div>
    <!-- Card -->
    <div style="background-color: #161D33; border: 1px solid #1E293B; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align: center; padding-top: 16px;">
      <p style="color: #94A3B8; font-size: 12px; margin: 0;">Clutch Competitions &mdash; Premium Prize Competitions</p>
      <p style="color: #94A3B8; font-size: 11px; margin: 8px 0 0 0;">You must be 18+ to enter. Please play responsibly.</p>
    </div>
  </div>
</body>
</html>`;
}

function detailRow(label: string, value: string, highlight = false) {
  return `
    <tr>
      <td style="padding: 10px 0; color: #94A3B8; font-size: 14px; border-bottom: 1px solid #1E293B;">${label}</td>
      <td style="padding: 10px 0; font-weight: 700; font-size: 14px; text-align: right; border-bottom: 1px solid #1E293B; color: ${highlight ? '#F59E0B' : '#F1F5F9'};">${value}</td>
    </tr>`;
}

// ── Order notifications ──

export async function sendOrderNotification({
  customerName,
  customerEmail,
  competitionTitle,
  quantity,
  totalPence,
  orderId,
}: {
  customerName: string;
  customerEmail: string;
  competitionTitle: string;
  quantity: number;
  totalPence: number;
  orderId: string;
}) {
  const total = `£${(totalPence / 100).toFixed(2)}`;
  const resend = getResend();

  // Admin notification
  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `New Order: ${quantity} tickets, ${competitionTitle}`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🎫</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">New Ticket Purchase</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">A customer just bought tickets</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Order ID', orderId.slice(0, 8).toUpperCase())}
        ${detailRow('Customer', customerName)}
        ${detailRow('Email', customerEmail)}
        ${detailRow('Competition', competitionTitle)}
        ${detailRow('Tickets', quantity.toString())}
        ${detailRow('Total', total, true)}
      </table>
    `),
  });

  // Customer confirmation
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Order confirmed, ${competitionTitle}`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">✅</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Order Confirmed!</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">Hi ${customerName}, your tickets are secured</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Competition', competitionTitle)}
        ${detailRow('Tickets', quantity.toString())}
        ${detailRow('Total Paid', total, true)}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <p style="color: #10B981; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Good luck! 🍀</p>
        <p style="color: #94A3B8; font-size: 13px; margin: 0;">You'll be notified if you win. You can view your tickets in your account.</p>
      </div>
    `),
  });
}

// ── Spin purchase notification ──

export async function sendSpinOrderNotification({
  customerName,
  customerEmail,
  gameTitle,
  pricePence,
}: {
  customerName: string;
  customerEmail: string;
  gameTitle: string;
  pricePence: number;
}) {
  const price = `£${(pricePence / 100).toFixed(2)}`;
  const resend = getResend();

  // Admin notification
  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `New Spin Purchase: ${gameTitle}`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🎰</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">New Spin Purchase</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">A customer just paid to spin</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Customer', customerName)}
        ${detailRow('Email', customerEmail)}
        ${detailRow('Game', gameTitle)}
        ${detailRow('Price Paid', price, true)}
      </table>
    `),
  });

  // Customer confirmation
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Spin confirmed, ${gameTitle}`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">✅</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Spin Confirmed!</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">Hi ${customerName}, your payment went through</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Game', gameTitle)}
        ${detailRow('Price Paid', price, true)}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <p style="color: #10B981; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Good luck! 🍀</p>
        <p style="color: #94A3B8; font-size: 13px; margin: 0;">Head back to the game to see your result.</p>
      </div>
    `),
  });
}

// ── Instant win notification ──

export async function sendInstantWinNotification({
  customerName,
  customerEmail,
  competitionTitle,
  prizeName,
  ticketNumber,
}: {
  customerName: string;
  customerEmail: string;
  competitionTitle: string;
  prizeName: string;
  ticketNumber: number;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `Instant Win Claimed: ${prizeName} (${competitionTitle})`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">⚡</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Instant Win Claimed</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">A customer just landed an instant win prize</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Customer', customerName)}
        ${detailRow('Email', customerEmail)}
        ${detailRow('Competition', competitionTitle)}
        ${detailRow('Ticket Number', `#${String(ticketNumber).padStart(4, '0')}`)}
        ${detailRow('Prize', prizeName, true)}
      </table>
    `),
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `⚡ You just won an Instant Prize!`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">⚡</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Instant Win, ${customerName.split(' ')[0]}!</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">One of your tickets was a pre-designated instant winner</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Competition', competitionTitle)}
        ${detailRow('Winning Ticket', `#${String(ticketNumber).padStart(4, '0')}`)}
        ${detailRow('Prize', prizeName, true)}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <p style="color: #94A3B8; font-size: 13px; margin: 0 0 16px 0;">Log in to your account to reveal and claim your prize.</p>
        <div style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #FBBF24); border-radius: 12px; padding: 14px 32px;">
          <a href="${APP_URL}/account/tickets" style="color: #0A0E1A; text-decoration: none; font-weight: 800; font-size: 15px;">View My Win</a>
        </div>
      </div>
    `),
  });
}

export async function sendWheelWinNotification({
  customerName,
  customerEmail,
  gameTitle,
  prizeName,
}: {
  customerName: string;
  customerEmail: string;
  gameTitle: string;
  prizeName: string;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `InstaWin Won: ${prizeName} (${gameTitle})`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🎰</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">InstaWin Won</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">A customer just lined up 3 logos and won</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Customer', customerName)}
        ${detailRow('Email', customerEmail)}
        ${detailRow('Game', gameTitle)}
        ${detailRow('Prize', prizeName, true)}
      </table>
    `),
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `🎰 You just won!`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🎰</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">You Won, ${customerName.split(' ')[0]}!</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">You lined up 3 logos and landed the prize</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Game', gameTitle)}
        ${detailRow('Prize', prizeName, true)}
      </table>
      <div style="margin-top: 24px; text-align: center;">
        <p style="color: #94A3B8; font-size: 13px; margin: 0 0 16px 0;">Our team will be in touch to arrange delivery of your prize.</p>
        <div style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #FBBF24); border-radius: 12px; padding: 14px 32px;">
          <a href="${APP_URL}/#instawin-games" style="color: #0A0E1A; text-decoration: none; font-weight: 800; font-size: 15px;">View InstaWin Games</a>
        </div>
      </div>
    `),
  });
}

// ── Verification code email ──

export async function sendVerificationCode({
  email,
  name,
  code,
}: {
  email: string;
  name: string;
  code: string;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${code}, Verify your email`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🔐</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Verify Your Email</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">Hi ${name.split(' ')[0]}, use the code below to verify your email address</p>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; background-color: #0A0E1A; border: 2px solid #F59E0B; border-radius: 16px; padding: 20px 40px; letter-spacing: 8px; font-size: 32px; font-weight: 900; color: #F59E0B; font-family: monospace;">${code}</div>
      </div>
      <div style="text-align: center;">
        <p style="color: #94A3B8; font-size: 13px; margin: 0;">This code expires in <strong style="color: #F1F5F9;">5 minutes</strong>.</p>
        <p style="color: #94A3B8; font-size: 13px; margin: 8px 0 0 0;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `),
  });
}

// ── Password reset code email ──

export async function sendPasswordResetCode({
  email,
  name,
  code,
}: {
  email: string;
  name: string;
  code: string;
}) {
  const resend = getResend();

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `${code}, Reset your password`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🔑</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Reset Your Password</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">Hi ${name.split(' ')[0]}, use the code below to reset your password</p>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <div style="display: inline-block; background-color: #0A0E1A; border: 2px solid #F59E0B; border-radius: 16px; padding: 20px 40px; letter-spacing: 8px; font-size: 32px; font-weight: 900; color: #F59E0B; font-family: monospace;">${code}</div>
      </div>
      <div style="text-align: center;">
        <p style="color: #94A3B8; font-size: 13px; margin: 0;">This code expires in <strong style="color: #F1F5F9;">5 minutes</strong>.</p>
        <p style="color: #94A3B8; font-size: 13px; margin: 8px 0 0 0;">If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `),
  });
}

// ── Signup notification ──

export async function sendSignupNotification({
  customerName,
  customerEmail,
  phone,
  addressLine1,
  addressLine2,
  city,
  postcode,
  dateOfBirth,
}: {
  customerName: string;
  customerEmail: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  postcode?: string;
  dateOfBirth?: string;
}) {
  const resend = getResend();

  const address = [addressLine1, addressLine2, city, postcode].filter(Boolean).join(', ');

  // Admin notification
  await resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `New Signup: ${customerName} (${customerEmail})`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">👤</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">New User Registered</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">A new customer has signed up</p>
      </div>
      <table style="width: 100%; border-collapse: collapse;">
        ${detailRow('Name', customerName)}
        ${detailRow('Email', customerEmail)}
        ${phone ? detailRow('Phone', phone) : ''}
        ${address ? detailRow('Address', address) : ''}
        ${dateOfBirth ? detailRow('Date of Birth', new Date(dateOfBirth).toLocaleDateString('en-GB')) : ''}
      </table>
    `),
  });

  // Welcome email to customer
  await resend.emails.send({
    from: FROM_EMAIL,
    to: customerEmail,
    subject: `Welcome to Clutch Competitions!`,
    html: emailWrapper(`
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 50%; width: 56px; height: 56px; line-height: 56px; font-size: 24px;">🏆</div>
        <h1 style="color: #F1F5F9; font-size: 22px; font-weight: 800; margin: 16px 0 4px 0;">Welcome, ${customerName.split(' ')[0]}!</h1>
        <p style="color: #94A3B8; font-size: 14px; margin: 0;">Your account is ready to go</p>
      </div>
      <div style="text-align: center; margin-bottom: 24px;">
        <p style="color: #F1F5F9; font-size: 15px; line-height: 1.6; margin: 0;">
          You're all set to enter our premium prize competitions. From dream cars to life-changing cash, your next win could be just one ticket away.
        </p>
      </div>
      <div style="text-align: center; margin-top: 28px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #F59E0B, #FBBF24); border-radius: 12px; padding: 14px 32px;">
          <a href="${APP_URL}/competitions" style="color: #0A0E1A; text-decoration: none; font-weight: 800; font-size: 15px;">Browse Competitions</a>
        </div>
      </div>
    `),
  });
}
