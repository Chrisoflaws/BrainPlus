import { config } from 'dotenv';
config();

import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Voiceflow-Secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: 'OK' };
  }

  const incomingSecret = event.headers['x-voiceflow-secret'];
  const expectedSecret = process.env.VOICEFLOW_WEBHOOK_SECRET;

  if (!incomingSecret || incomingSecret !== expectedSecret) {
    return {
      statusCode: 401,
      headers: corsHeaders,
      body: 'Unauthorized',
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers: corsHeaders, body: 'Invalid JSON' };
  }

  const user_id = body.user_id || body.userId;
  const tasks = body.tasks;

  if (!user_id || !Array.isArray(tasks)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: 'Missing or invalid payload.',
    };
  }

  const today = new Date().toISOString().slice(0, 10);

  const tasksToUpsert = tasks.map((task: any) => ({
    user_id,
    task_id: task.task_id,
    status: task.status || 'pending',
    metadata: task.metadata || {},
    date: task.date || today,
  }));

  const { error } = await supabase
    .from('user_evolution_tasks')
    .upsert(tasksToUpsert, { onConflict: 'user_id,task_id' });

  try {
    await supabase.from('webhook_logs').insert({
      endpoint: 'update-daily-evolution-tasks',
      payload: tasksToUpsert,
      response_code: error ? 500 : 200,
      error: error?.message || null
    });
  } catch (logError) {
    console.warn('Failed to log webhook event:', logError.message);
  }

  if (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: `Supabase error: ${error.message}`,
    };
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: 'Daily tasks upserted.',
  };
};

export { handler };
