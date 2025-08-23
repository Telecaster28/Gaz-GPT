import { DefaultAzureCredential, ClientSecretCredential } from "@azure/identity";
import { AIProjectClient } from "@azure/ai-projects";

export default async function (context, req) {
  try {
    // Load credentials from env
    const credential = new ClientSecretCredential(
      process.env.AZURE_TENANT_ID,
      process.env.AZURE_CLIENT_ID,
      process.env.AZURE_CLIENT_SECRET
    );

    // Connect to your project
    const project = new AIProjectClient(
      "https://gaz-gpt-resource.services.ai.azure.com/api/projects/gaz_gpt",
      credential
    );

    // Retrieve agent
    const agent = await project.agents.getAgent("asst_0RKh2avD1eTtuKxkxid4FyOp");

    // Create a thread
    const thread = await project.agents.threads.create();

    // Send user input
    const message = await project.agents.messages.create(
      thread.id,
      "user",
      req.body.query || "Hello from Gaz GPT!"
    );

    // Run the agent
    let run = await project.agents.runs.create(thread.id, agent.id);
    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise((r) => setTimeout(r, 1000));
      run = await project.agents.runs.get(thread.id, run.id);
    }

    // Collect messages
    const messages = [];
    for await (const m of project.agents.messages.list(thread.id, { order: "asc" })) {
      const content = m.content.find((c) => c.type === "text" && "text" in c);
      if (content) messages.push({ role: m.role, text: content.text.value });
    }

    context.res = { status: 200, body: { messages } };
  } catch (err) {
    context.res = {
      status: 500,
      body: { error: err.message }
    };
  }
}
