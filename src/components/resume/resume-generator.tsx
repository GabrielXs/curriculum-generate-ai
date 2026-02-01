"use client";

import { useState, useMemo } from "react";
import { useResume } from "@/libs/resume-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  FileText,
  Sparkles,
  Download,
  RefreshCw,
} from "lucide-react";
import { da } from "date-fns/locale";

export function ResumeGenerator() {
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [generatedResume, setGeneratedResume] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const { personalInfo, experiences, education, skills, projects } = resumeData;
  const router = useRouter();

  const isResumeComplete = useMemo(() => {
    return personalInfo.fullName && personalInfo.title && personalInfo.summary;
  }, [personalInfo]);

  const extractKeywords = (text: string): string[] => {
    const commonWords = new Set([
      "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
      "of", "with", "by", "from", "as", "is", "was", "are", "were", "been",
      "be", "have", "has", "had", "do", "does", "did", "will", "would",
      "could", "should", "may", "might", "must", "shall", "can", "need",
      "we", "you", "they", "he", "she", "it", "i", "this", "that", "these",
      "those", "what", "which", "who", "whom", "whose", "where", "when",
      "why", "how", "all", "each", "every", "both", "few", "more", "most",
      "other", "some", "such", "no", "nor", "not", "only", "own", "same",
      "so", "than", "too", "very", "just", "also", "now", "here", "there",
      "about", "into", "through", "during", "before", "after", "above",
      "below", "between", "under", "again", "further", "then", "once",
      "any", "our", "your", "their", "its", "my", "his", "her", "if",
      "work", "working", "experience", "years", "year", "including", "etc",
      "ability", "able", "looking", "seeking", "required", "requirements",
      "responsibilities", "job", "position", "role", "company", "team",
    ]);

    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !commonWords.has(word));

    const wordCount: Record<string, number> = {};
    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word]) => word);
  };

  const generateTailoredResume = async () => {
  if (!jobDescription.trim() || !isResumeComplete) return;
  setIsGenerating(true);

  try {
    console.log("🚀 Enviando para API...");

    // CALL 1 — ANALYSIS
    const response_analytics = await fetch("/api/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: resumeData,
        job: jobDescription
      }),
    });

    if (!response_analytics.ok) {
      throw new Error(await response_analytics.text());
    }

    const analytics_data = await response_analytics.json();
    console.log("📊 Analysis:", analytics_data);

    // CALL 2 — GENERATION
    const response_summary = await fetch("/api/optimize-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profile: resumeData,
        job: jobDescription,
        analysis: analytics_data
      }),
    });

    if (!response_summary.ok) {
      throw new Error(await response_summary.text());
    }

    const optimized_resume = await response_summary.json();
    console.log("✅ Optimized Resume:", optimized_resume);
    

    localStorage.setItem(
      "tailoredResume",
      JSON.stringify(optimized_resume)
    );

    router.push("/preview");

  } catch (error: any) {
    console.error("❌ Erro:", error);
    alert(`Erro ao processar: ${error.message}`);
  } finally {
    setIsGenerating(false);
  }
};


  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedResume], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-tailored-${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          Resume Generator
        </CardTitle>
        <CardDescription>
          Paste a job description to generate a tailored resume that highlights
          your most relevant experience and skills
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isResumeComplete ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Complete Your Resume First
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Fill in at least your name, title, and summary in the Resume
              Editor before generating a tailored resume.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="job-description" className="text-foreground">
                Job Description
              </Label>
              <Textarea
                id="job-description"
                placeholder="Paste the job description here... Include requirements, responsibilities, and desired skills for best results."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                The more detailed the job description, the better we can tailor
                your resume.
              </p>
            </div>

            <Button
              onClick={generateTailoredResume}
              disabled={!jobDescription.trim() || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Tailored Resume
                </>
              )}
            </Button>

            {generatedResume && (
              <div className="space-y-4 mt-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Your Tailored Resume
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="flex items-center gap-2 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-foreground border border-border overflow-x-auto max-h-[600px] overflow-y-auto">
                  {generatedResume}
                </div>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h4 className="font-medium text-primary mb-2">
                    Tips for your tailored resume:
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>
                      • Your most relevant experiences are listed first
                    </li>
                    <li>• Skills matching the job are highlighted</li>
                    <li>
                      • Copy this text and format it in your preferred document
                      editor
                    </li>
                    <li>
                      • Customize further based on specific job requirements
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
