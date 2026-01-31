
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Project, Activity } from '../types';
import { MOCK_PROJECTS, MOCK_ACTIVITIES } from '../constants';

interface DataContextType {
  projects: Project[];
  activities: Activity[];
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  deleteProject: (projectId: string) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (updatedActivity: Activity) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);

  const addProject = (project: Project) => {
    setProjects(prev => [project, ...prev]);
  };

  const updateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
  };
  
  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
  };

  const updateActivity = (updatedActivity: Activity) => {
      setActivities(prev => prev.map(a => a.id === updatedActivity.id ? updatedActivity : a));
  };

  return (
    <DataContext.Provider value={{ projects, activities, addProject, updateProject, deleteProject, addActivity, updateActivity }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
