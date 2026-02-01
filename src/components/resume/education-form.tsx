"use client";

import React from "react"

import { useState } from "react";
import { useResume } from "@/libs/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import type { Education } from "@/lib/types";

export function EducationForm() {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const resetForm = () => {
    setForm({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  const handleSave = () => {
    if (editingId) {
      updateEducation(editingId, { ...form, id: editingId });
      setEditingId(null);
    } else {
      addEducation({ ...form, id: crypto.randomUUID() });
      setIsAdding(false);
    }
    resetForm();
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    setForm({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
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
      {resumeData.education.map((edu) => (
        <Card key={edu.id} className="bg-secondary/50 border-border">
          {editingId === edu.id ? (
            <CardContent className="pt-6">
              <EducationFormFields form={form} setForm={setForm} />
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
                  <h4 className="font-semibold text-foreground">
                    {edu.degree} in {edu.field}
                  </h4>
                  <p className="text-muted-foreground">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">
                    {edu.startDate} - {edu.endDate}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(edu)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => removeEducation(edu.id)}>
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
            <EducationFormFields form={form} setForm={setForm} />
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
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      )}
    </div>
  );
}

function EducationFormFields({
  form,
  setForm,
}: {
  form: Omit<Education, "id">;
  setForm: React.Dispatch<React.SetStateAction<Omit<Education, "id">>>;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Institution</Label>
        <Input
          placeholder="University name"
          value={form.institution}
          onChange={(e) => setForm((prev) => ({ ...prev, institution: e.target.value }))}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Degree</Label>
          <Input
            placeholder="Bachelor's, Master's, etc."
            value={form.degree}
            onChange={(e) => setForm((prev) => ({ ...prev, degree: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>Field of Study</Label>
          <Input
            placeholder="Computer Science"
            value={form.field}
            onChange={(e) => setForm((prev) => ({ ...prev, field: e.target.value }))}
          />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Input
            placeholder="Sep 2016"
            value={form.startDate}
            onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Input
            placeholder="Jun 2020"
            value={form.endDate}
            onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description (optional)</Label>
        <Textarea
          placeholder="Relevant coursework, achievements, etc."
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
      </div>
    </div>
  );
}
