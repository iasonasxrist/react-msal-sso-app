import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
const msalInstance = new PublicClientApplication(msalConfig);

export const initializeMsalInstance = async () => {
  try {
    await msalInstance.initialize();
    // console.log("MSAL instance initialized");
  } catch (error) {
    console.error("Failed to initialize MSAL instance:", error);
  }
};

export default msalInstance;
