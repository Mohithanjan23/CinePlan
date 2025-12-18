import { useState, useEffect } from 'react';
import { fetchProjects, getProjectShots, createProject } from '../api/dataServices';
import { getShootWeather, generateShotListAI } from '../api/externalServices';

// --- HOOK: Manage Projects ---
export const useProjects = (user) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const data = await fetchProjects(user.id);
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const addProject = async (projectData) => {
    const newProject = await createProject(projectData);
    if (newProject) setProjects([...projects, newProject]);
    return newProject;
  };

  return { projects, loading, error, addProject };
};

// --- HOOK: Manage Weather ---
export const useWeather = (activeProject) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeProject?.location_lat || !activeProject?.shoot_date) return;

    const load = async () => {
      setLoading(true);
      const data = await getShootWeather(
        activeProject.location_lat, 
        activeProject.location_lng, 
        activeProject.shoot_date
      );
      setWeather(data);
      setLoading(false);
    };
    load();
  }, [activeProject]);

  return { weather, loading };
};

// --- HOOK: AI Assistant ---
export const useAIAssistant = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const suggestShots = async (project) => {
    setIsGenerating(true);
    try {
      // Call the service which calls the Edge Function
      const suggestions = await generateShotListAI(
        project.title, 
        project.type, 
        project.notes || "Cinematic style"
      );
      return suggestions;
    } catch (error) {
      console.error("AI Error:", error);
      alert("Failed to generate shots. Check your API limits.");
      return [];
    } finally {
      setIsGenerating(false);
    }
  };

  return { suggestShots, isGenerating };
};
