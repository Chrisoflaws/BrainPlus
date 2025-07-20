import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  try {
    const body = await req.json();

    console.log("Received user data from signup:", body);

    const makeWebhookUrl = "https://hook.eu2.make.com/u27fgk5xn2c7gsuvmznahb9bexwph2w1";

    const makeResponse = await fetch(makeWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const makeResult = await makeResponse.text();
    console.log("Make webhook responded with:", makeResult);

    return new Response(JSON.stringify({ status: "ok" }), { status: 200 });
  } catch (e) {
    console.error("Edge Function error:", e);
    return new Response("Error forwarding to Make", { status: 500 });
  }
});
