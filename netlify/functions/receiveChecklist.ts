import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const handler: Handler = async (event) => {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { tasks, user_id } = JSON.parse(event.body || '{}');

    if (!Array.isArray(tasks) || !user_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid request format. Expected tasks array and user_id.' })
      };
    }

    // Insert tasks into Supabase
    const { data, error } = await supabase
      .from('daily_tasks')
      .insert(
        tasks.map(task => ({
          task: task.title,
          due_time: task.due_time,
          category: task.category,
          user_id,
          is_completed: false
        }))
      )
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to save tasks' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        message: 'Tasks saved successfully',
        tasks: data
      })
    };

  } catch (err) {
    console.error('Server error:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};