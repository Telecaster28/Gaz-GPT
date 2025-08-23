import fetch from "node-fetch";

export default async function (context, req) {
  const query = req.query.q || "test";

  try {
    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`,
      {
        headers: { "X-Subscription-Token": process.env.BRAVE_API_KEY }
      }
    );

    const results = await response.json();
    context.res = { status: 200, body: results };
  } catch (err) {
    context.res = { status: 500, body: { error: "Error calling Brave API." } };
  }
}
