"use client";

import { useState } from "react";
import { useResume } from "@/libs/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function SkillsForm() {
  const { resumeData, setSkills, setLanguages } = useResume();
  const [skillInput, setSkillInput] = useState("");
  const [languageInput, setLanguageInput] = useState("");

  const handleAddSkill = () => {
    if (skillInput.trim() && !resumeData.skills.includes(skillInput.trim())) {
      setSkills([...resumeData.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(resumeData.skills.filter((s) => s !== skill));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !resumeData.languages.includes(languageInput.trim())) {
      setLanguages([...resumeData.languages, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const handleRemoveLanguage = (language: string) => {
    setLanguages(resumeData.languages.filter((l) => l !== language));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Technical Skills</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., JavaScript, Python, React..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
          />
          <Button type="button" variant="secondary" onClick={handleAddSkill}>
            Add
          </Button>
        </div>
        {resumeData.skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-sm rounded-full bg-primary/20 text-primary flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label>Languages</Label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., English (Native), Spanish (Fluent)..."
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLanguage())}
          />
          <Button type="button" variant="secondary" onClick={handleAddLanguage}>
            Add
          </Button>
        </div>
        {resumeData.languages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {resumeData.languages.map((language) => (
              <span
                key={language}
                className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground flex items-center gap-2"
              >
                {language}
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(language)}
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
