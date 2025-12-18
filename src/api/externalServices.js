import { supabase } from './supabaseClient';

// --- WEATHER (Open-Meteo) ---

export const getShootWeather = async (lat, lng, date) => {
  // Open-Meteo requires YYYY-MM-DD format
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=sunrise,sunset,precipitation_sum&hourly=temperature_2m,cloudcover,visibility&timezone=auto&start_date=${date}&end_date=${date}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Calculate Golden Hour (approx 1 hour after sunrise, 1 hour before sunset)
    // Note: Real golden hour calculation is complex, this is a "good enough" estimation for MVP
    const sunrise = new Date(data.daily.sunrise[0]);
    const sunset = new Date(data.daily.sunset[0]);
    
    // Format time string (e.g., "06:30 AM")
    const fmt = (d) => d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return {
      tempHigh: Math.max(...data.hourly.temperature_2m),
      condition: data.daily.precipitation_sum[0] > 0 ? 'Rainy' : 'Clear',
      sunrise: fmt(sunrise),
      sunset: fmt(sunset),
      goldenHourMorning: `${fmt(sunrise)} - ${fmt(new Date(sunrise.getTime() + 3600000))}`,
      goldenHourEvening: `${fmt(new Date(sunset.getTime() - 3600000))} - ${fmt(sunset)}`
    };
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return null;
  }
};

// --- AI (Gemini Pro via Supabase Edge Functions) ---

/* NOTE: We call a Supabase Edge Function here to keep the API Key secure.
   Do NOT call Gemini directly from the client in production.
*/

export const generateShotListAI = async (projectTitle, projectType, notes) => {
  const { data, error } = await supabase.functions.invoke('generate-shots', {
    body: { 
      prompt: `
        Act as a Director of Photography. 
        Project Title: ${projectTitle}
        Type: ${projectType}
        Context: ${notes}
        
        Generate 5 essential shots for this project.
        Return ONLY a valid JSON array.
        Schema: [{ "scene": "1", "label": "Shot description", "type": "WS/CU/etc", "lens": "mm", "priority": "High/Med" }]
      ` 
    },
  });

  if (error) throw error;
  return data; // Returns the JSON array of shots
};