import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.heartbridge.app",
  appName: "HeartBridge",
  webDir: "out",
  server: {
    url: "https://ldr-w13b.onrender.com/",
    cleartext: false, // Allows HTTP traffic, necessary for local development
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
