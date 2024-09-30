import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.heartbridge.app",
  appName: "HeartBridge",
  webDir: "out",
  server: {
    url: "http://10.0.2.2:3000",
    cleartext: true, // Allows HTTP traffic, necessary for local development
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
