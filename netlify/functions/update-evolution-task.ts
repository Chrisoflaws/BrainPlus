import { createClient } from '@supabase/supabase-js';

console.log("🔍 TOP-LEVEL ENV CHECK:", {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...' // safety truncate
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const hardcodedUserId = '9028f0b6-e8fa-477a-b7fa-686667ba8ac1';

export const handler = async (event) => {
  console.log("✅ FUNCTION STARTED — update-evolution-task");
  console.log("🔍 HANDLER ENV CHECK:", {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SERVICE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) + '...'
  });

  // Validate ENV
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Missing Supabase ENV variables.");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Supabase ENV variables." }),
    };
  }

  // Parse Incoming Payload
  console.log("📥 RAW EVENT BODY:", event.body);
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON payload." }),
    };
  }
  console.log("📦 PARSED PAYLOAD:", payload);

  const { task_id, status } = payload;
  if (!task_id || !status) {
    console.error("❌ Missing task_id or status in payload");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing task_id or status in payload." }),
    };
  }

  // Supabase Upsert
  try {
    const { data, error } = await supabase
      .from('evolution_tasks')
      .upsert({
        user_id: hardcodedUserId,
        task_id,
        status,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("❌ SUPABASE ERROR:");
      console.error("  ↳ Message:", error.message);
      console.error("  ↳ Details:", error.details);
      console.error("  ↳ Hint:", error.hint);
      console.error("  ↳ Code:", error.code);
      console.error("  ↳ Full:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Minimal upsert failed",
          supabase_error: error,
        }),
      };
    }

    console.log("✅ SUPABASE UPSERT SUCCESS:", data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task marked as complete!", data }),
    };
  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message }),
    };
  }
};
