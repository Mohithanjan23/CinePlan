import { supabase } from './supabaseClient';

// --- PROJECTS ---

export const fetchProjects = async (userId) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', userId)
    .order('shoot_date', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  // projectData: { owner_id, title, client_name, shoot_date, ... }
  const { data, error } = await supabase
    .from('projects')
    .insert([projectData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// --- SHOTS ---

export const getProjectShots = async (projectId) => {
  const { data, error } = await supabase
    .from('shots')
    .select('*')
    .eq('project_id', projectId)
    .order('scene', { ascending: true }); // Sort by scene number

  if (error) throw error;
  return data;
};

export const updateShotStatus = async (shotId, status) => {
  const { error } = await supabase
    .from('shots')
    .update({ status })
    .eq('id', shotId);

  if (error) throw error;
};

// --- GEAR ---

export const getUserGear = async (userId) => {
  const { data, error } = await supabase
    .from('gear_items')
    .select('*')
    .eq('owner_id', userId);

  if (error) throw error;
  return data;
};

// Links a global gear item to a specific project checklist
export const addToProjectChecklist = async (projectId, gearItemId) => {
  const { data, error } = await supabase
    .from('gear_checklists')
    .insert([{ 
      project_id: projectId, 
      gear_item_id: gearItemId,
      status: 'not_packed' 
    }]);

  if (error) throw error;
  return data;
};