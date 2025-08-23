import { ClientSecretCredential } from "@azure/identity";
import { SubscriptionClient } from "@azure/arm-subscriptions";

const tenantId = process.env.AZURE_TENANT_ID;
const clientId = process.env.AZURE_CLIENT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;

async function main() {
  try {
    console.log("🔑 Authenticating with Azure using Service Principal...");
    const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

    const client = new SubscriptionClient(credential);

    console.log("📡 Fetching subscriptions...");
    for await (const sub of client.subscriptions.list()) {
      console.log(`✅ Subscription: ${sub.displayName} (${sub.subscriptionId})`);
    }

    console.log("🎉 Authentication successful!");
  } catch (err) {
    console.error("❌ Authentication failed:", err.message);
    console.error(err);
  }
}

main();
