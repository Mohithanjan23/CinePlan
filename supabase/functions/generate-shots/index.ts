// Follows Deno runtime syntax used by Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS (Browser security)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Parse the request from the React App
    const { prompt } = await req.json()

    // 3. Call Google Gemini API
    // We use the "generateContent" endpoint
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          // We ask Gemini to return strict JSON for easy parsing
          generationConfig: {
            response_mime_type: "application/json"
          }
        }),
      }
    )

    const data = await response.json()
    
    // 4. Extract the text response
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    const parsedShots = JSON.parse(generatedText)

    // 5. Return clean JSON to the Client
    return new Response(JSON.stringify(parsedShots), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})