"use client";

import React from "react"

import { useState } from "react";
import { useResume } from "@/libs/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import type { Experience } from "@/lib/types";

export function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");
  const [form, setForm] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    technologies: [],
  });

  const resetForm = () => {
    setForm({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
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
      updateExperience(editingId, { ...form, id: editingId });
      setEditingId(null);
    } else {
      addExperience({ ...form, id: crypto.randomUUID() });
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
      technologies: exp.technologies,
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
      {resumeData.experiences.map((exp) => (
        <Card key={exp.id} className="bg-secondary/50 border-border">
          {editingId === exp.id ? (
            <CardContent className="pt-6">
              <ExperienceFormFields
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
                  <h4 className="font-semibold text-foreground">{exp.position}</h4>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </p>
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {exp.technologies.map((tech) => (
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
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(exp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeExperience(exp.id)}>
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
            <ExperienceFormFields
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
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      )}
    </div>
  );
}

function ExperienceFormFields({
  form,
  setForm,
  techInput,
  setTechInput,
  handleAddTech,
  handleRemoveTech,
}: {
  form: Omit<Experience, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Experience, "id">>>;
  techInput: string;
  setTechInput: React.Dispatch<React.SetStateAction<string>>;
  handleAddTech: () => void;
  handleRemoveTech: (tech: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Company</Label>
          <Input
            placeholder="Company name"
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Position</Label>
          <Input
            placeholder="Job title"
            value={form.position}
            onChange={(e) => setForm((prev) => ({ ...prev, position: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            placeholder="Jan 2020"
            value={form.startDate}
            onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            placeholder="Dec 2023"
            value={form.endDate}
            disabled={form.current}
            onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="current"
          checked={form.current}
          onCheckedChange={(checked) =>
            setForm((prev) => ({ ...prev, current: checked === true }))
          }
        />
        <Label htmlFor="current" className="text-sm font-normal">
          Currently working here
        </Label>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          placeholder="Describe your responsibilities and achievements..."
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
