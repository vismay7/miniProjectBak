import prisma from "../config/dbConfig";

const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export async function generateOTP(email: string): Promise<number> {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_TIME).toISOString();

  const otpStore = await prisma.otp.create({ data: { otp: otp, expires_at: expiresAt, email: email } });

  if (otpStore) {
    return otp;
  }

  throw new Error("Failed to generate OTP");
}

export async function verification(otp: number, email: string): Promise<boolean> {
  const otpFromData = await prisma.otp.findFirst({ where: { otp: otp, expires_at: { gte: new Date() }, email: email } });
  if (otpFromData) {
    await prisma.user.update({ data: { is_verfied: true }, where: { email: email } });
    return true;
  } else {
    await removeExpiredOTP();
    return false;
  }
}

export async function removeExpiredOTP(): Promise<void> {
  await prisma.otp.deleteMany({ where: { expires_at: { lte: new Date() } } });
}
