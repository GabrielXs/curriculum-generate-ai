"use client";

import React from "react"

import { useState } from "react";
import { useResume } from "@/libs/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, X, Check, ExternalLink } from "lucide-react";
import type { Project } from "@/lib/types";

export function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    url: "",
    technologies: [],
  });

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      url: "",
      technologies: [],
    });
    setTechInput("");
  };

  const handleAddTech = () => {
    if (techInput.trim() && !form.technologies.includes(techInput.trim())) {
      setForm((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()],
      }));
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setForm((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((t) => t !== tech),
    }));
  };

  const handleSave = () => {
    if (editingId) {
      updateProject(editingId, { ...form, id: editingId });
      setEditingId(null);
    } else {
      addProject({ ...form, id: crypto.randomUUID() });
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (proj: Project) => {
    setEditingId(proj.id);
    setForm({
      name: proj.name,
      description: proj.description,
      url: proj.url,
      technologies: proj.technologies,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="space-y-4">
      {resumeData.projects.map((proj) => (
        <Card key={proj.id} className="bg-secondary/50 border-border">
          {editingId === proj.id ? (
            <CardContent className="pt-6">
              <ProjectFormFields
                form={form}
                setForm={setForm}
                techInput={techInput}
                setTechInput={setTechInput}
                handleAddTech={handleAddTech}
                handleRemoveTech={handleRemoveTech}
              />
              <div className="flex gap-2 mt-4">
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-1" /> Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>
            </CardContent>
          ) : (
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-foreground">{proj.name}</h4>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{proj.description}</p>
                  {proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {proj.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(proj)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeProject(proj.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      ))}

      {isAdding && (
        <Card className="bg-secondary/50 border-border">
          <CardContent className="pt-6">
            <ProjectFormFields
              form={form}
              setForm={setForm}
              techInput={techInput}
              setTechInput={setTechInput}
              handleAddTech={handleAddTech}
              handleRemoveTech={handleRemoveTech}
            />
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleSave}>
                <Check className="h-4 w-4 mr-1" /> Add
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAdding && !editingId && (
        <Button
          variant="outline"
          className="w-full border-dashed bg-transparent"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      )}
    </div>
  );
}

function ProjectFormFields({
  form,
  setForm,
  techInput,
  setTechInput,
  handleAddTech,
  handleRemoveTech,
}: {
  form: Omit<Project, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Project, "id">>>;
  techInput: string;
  setTechInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTech: () => void;
  handleRemoveTech: (tech: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input
            placeholder="My Awesome Project"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>URL (optional)</Label>
          <Input
            placeholder="https://github.com/username/project"
            value={form.url}
            onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Brief description of the project..."
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Add technology"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
          />
          <Button type="button" variant="secondary" onClick={handleAddTech}>
            Add
          </Button>
        </div>
        {form.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {form.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary flex items-center gap-1"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveTech(tech)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
