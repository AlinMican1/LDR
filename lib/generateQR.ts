export const GenerateQR = (): string => {
  const sessionId = crypto.randomUUID();
  const QRCode = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=http://localhost:3000/upload/${sessionId}`;
  return QRCode;
};
