"use client";

import React from "react"

import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PersonalInfoForm } from "./personal-info-form";
import { ExperienceForm } from "./experience-form";
import { EducationForm } from "./education-form";
import { ProjectsForm } from "./projects-form";
import { SkillsForm } from "./skills-form";
import { useResume } from "@/libs/resume-context";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  FolderKanban, 
  Wrench, 
  Save, 
  Download, 
  Upload, 
  Trash2,
  Check
} from "lucide-react";

export function ResumeEditor() {
  const { 
    saveResume, 
    clearResume, 
    exportResume, 
    importResume, 
    hasUnsavedChanges, 
    lastSaved 
  } = useResume();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importResume(file);
      } catch (err) {
        alert("Failed to import resume. Please check the file format.");
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      clearResume();
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl text-foreground">Resume Builder</CardTitle>
            <CardDescription className="mt-1">
              Fill in your information to build your professional resume
              {lastSaved && (
                <span className="block text-xs mt-1">
                  Last saved: {lastSaved.toLocaleString()}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              onClick={saveResume} 
              className="gap-2"
              variant={hasUnsavedChanges ? "default" : "secondary"}
            >
              {hasUnsavedChanges ? (
                <Save className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              {hasUnsavedChanges ? "Save" : "Saved"}
            </Button>
            <Button onClick={exportResume} variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              variant="outline" 
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button onClick={handleClear} variant="outline" className="gap-2 text-destructive hover:text-destructive bg-transparent">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-secondary">
            <TabsTrigger value="personal" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span className="hidden sm:inline">Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Education</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="mt-6">
            <PersonalInfoForm />
          </TabsContent>
          <TabsContent value="experience" className="mt-6">
            <ExperienceForm />
          </TabsContent>
          <TabsContent value="education" className="mt-6">
            <EducationForm />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectsForm />
          </TabsContent>
          <TabsContent value="skills" className="mt-6">
            <SkillsForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
