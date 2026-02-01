"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type ResumeData,
  type Experience,
  type Education,
  type Project,
  defaultResumeData,
} from "./types";

const STORAGE_KEY = "cv-builder-resume-data";

interface ResumeContextType {
  resumeData: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  addExperience: (experience: Experience) => void;
  updateExperience: (id: string, experience: Experience) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Education) => void;
  updateEducation: (id: string, education: Education) => void;
  removeEducation: (id: string) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Project) => void;
  removeProject: (id: string) => void;
  setSkills: (skills: string[]) => void;
  setLanguages: (languages: string[]) => void;
  saveResume: () => void;
  clearResume: () => void;
  exportResume: () => void;
  importResume: (file: File) => Promise<void>;
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData(parsed.data);
        setLastSaved(new Date(parsed.savedAt));
      } catch (e) {
        console.error("Failed to load saved resume:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Track changes after initialization
  useEffect(() => {
    if (isInitialized) {
      setHasUnsavedChanges(true);
    }
  }, [resumeData, isInitialized]);

  const updatePersonalInfo = (field: string, value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  const addExperience = (experience: Experience) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, experience],
    }));
  };

  const updateExperience = (id: string, experience: Experience) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) =>
        exp.id === id ? experience : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id),
    }));
  };

  const addEducation = (education: Education) => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, education],
    }));
  };

  const updateEducation = (id: string, education: Education) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? education : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addProject = (project: Project) => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }));
  };

  const updateProject = (id: string, project: Project) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? project : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const setSkills = (skills: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const setLanguages = (languages: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      languages,
    }));
  };

  const saveResume = () => {
    const saveData = {
      data: resumeData,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
    setLastSaved(new Date());
    setHasUnsavedChanges(false);
  };

  const clearResume = () => {
    localStorage.removeItem(STORAGE_KEY);
    setResumeData(defaultResumeData);
    setLastSaved(null);
    setHasUnsavedChanges(false);
  };

  const exportResume = () => {
    const dataStr = JSON.stringify(resumeData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importResume = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          setResumeData(data);
          setHasUnsavedChanges(true);
          resolve();
        } catch (err) {
          reject(new Error("Invalid file format"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        updatePersonalInfo,
        addExperience,
        updateExperience,
        removeExperience,
        addEducation,
        updateEducation,
        removeEducation,
        addProject,
        updateProject,
        removeProject,
        setSkills,
        setLanguages,
        saveResume,
        clearResume,
        exportResume,
        importResume,
        hasUnsavedChanges,
        lastSaved,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
