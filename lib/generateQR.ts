export const GenerateQR = (): string => {
  const sessionId = crypto.randomUUID();
  const baseURL = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const QRCode = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${baseURL}/upload/${sessionId}`;
  return QRCode;
};
