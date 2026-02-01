"use client";

import { cn } from "@/libs/utils";
import { FileText, Sparkles, Briefcase } from "lucide-react";

interface SidebarNavProps {
  activeSection: "editor" | "generator";
  onSectionChange: (section: "editor" | "generator") => void;
}

export function SidebarNav({ activeSection, onSectionChange }: SidebarNavProps) {
  const navItems = [
    {
      id: "editor" as const,
      label: "Resume Editor",
      icon: FileText,
      description: "Build your CV",
    },
    {
      id: "generator" as const,
      label: "Generate Resume",
      icon: Sparkles,
      description: "Tailor for a job",
    },
  ];

  return (
    <aside className="w-full lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-screen bg-card border-b lg:border-b-0 lg:border-r border-border p-4 lg:p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-foreground">CV Builder</h1>
          <p className="text-xs text-muted-foreground">Tailored resumes</p>
        </div>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors",
              activeSection === item.id
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">{item.label}</p>
              <p className="text-xs opacity-70">{item.description}</p>
            </div>
          </button>
        ))}
      </nav>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-xs text-muted-foreground mb-3">How it works</p>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0">1</span>
            <span>Fill your info once</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0">2</span>
            <span>Paste job description</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-primary/20 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium shrink-0">3</span>
            <span>Get tailored resume</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
