import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { OptimizeResumeSchema } from "@/schemas/optimizeResume.schema";
import { normalizeResume } from "@/libs/normalizeResume";


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `
You are an expert technical recruiter and resume writer.

Your task is to GENERATE an optimized resume JSON using:
1) The candidate profile (already analyzed in CALL 1)
2) The job description
3) The detected job language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE RULE (CRITICAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- If the job description is written in English → OUTPUT EVERYTHING IN ENGLISH
- If the job description is written in Portuguese → OUTPUT EVERYTHING IN PORTUGUESE
- Do NOT mix languages
- Translate titles, summaries, experiences, skills and gap analysis accordingly

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRICT OUTPUT RULES (MANDATORY)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Output ONLY valid JSON
- DO NOT wrap the response in or markdown
- DO NOT add comments
- DO NOT rename, remove or add fields
- NEVER invent skills, companies, roles or experiences
- You MAY expand descriptions using ONLY facts already present in the profile
- You MUST enrich content with context, impact and narrative depth

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON SCHEMA — MUST MATCH EXACTLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{
  "curriculo_otimizado": {
    "header": {
      "name": string,
      "target_role": string,
      "contact": {
        "email": string,
        "phone": string,
        "linkedin": string,
        "github": string,
        "location": string
      }
    },
    "resumo_profissional": string,
    "experiencias_selecionadas": [
      {
        "company": string,
        "role": string,
        "period": string,
        "conquistas_focadas": string[]
      }
    ],
    "skills_categorizadas": [
      {
        "categoria": string,
        "itens": string[]
      }
    ],
    "soft_skills": string[],
    "skills_destacadas": string[],
    "certificacoes_relevantes": string[]
  },
  "analise_de_gap": {
    "nivel_de_aderencia": {
      "percentual": number,
      "classificacao": string
    },
    "pontos_fortes": string[],
    "gaps_criticos": string[],
    "recomendacoes": string[]
  }
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTENT GUIDELINES (VERY IMPORTANT)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### Resume Quality
- This resume MUST be strong enough to be sent directly to a recruiter
- Avoid short or generic sentences
- Prefer impact-driven bullet points:
  - Show scope (systems, scale, teams, users)
  - Show responsibility level (ownership, leadership, architecture)
  - Show technical depth (Android internals, architecture, CI/CD, IPC, KMP, POS)

### Experience Storytelling
- Even if the candidate worked mostly at one company, treat each role as:
  - A different career chapter
  - With increasing scope, ownership and technical complexity
- You MAY include earlier experiences (e.g. Sinapse Informática) if present in the profile
- Do NOT repeat the same bullets across roles

### Skills
- Group skills logically (Android, Architecture, Tooling, etc.)
- Skills must match what appears in the profile
- Highlight senior-level concepts (architecture, system design, scale)

### Gap Analysis
- Be realistic but recruiter-friendly
- Gaps should NEVER disqualify the candidate
- Recommendations should be pragmatic and short

### Fit Score
- Percentual must be between 70 and 90
- Classification examples:
  - "Alto"
  - "Muito Alto"
  - "High"
  - "Very High"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL CHECK BEFORE ANSWERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before outputting:
- Check that ALL required fields exist
- Check that experiences use EXACT keys: company, role, period
- Check that no field is empty
- Check that language matches the job description

Now generate the final JSON.
`
;

export async function POST(req: NextRequest) {
  try {
    const { profile, job, analysis } = await req.json();

    console.log("📥 CALL 2 — Profile received");
    console.log("📥 CALL 2 — Analysis received");

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 8000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `
PROFILE:
${JSON.stringify(profile)}

JOB:
${job}

ANALYSIS_RESULT:
${JSON.stringify(analysis)}
`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    console.log("🧠 CALL 2 RAW:", raw);




    if (!raw) {
      return NextResponse.json({ error: "Empty AI response" }, { status: 500 });
    }


    const clean = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(clean);

    // valida mas não engessa
    OptimizeResumeSchema.parse(parsed);

    const normalized = normalizeResume(parsed);

    return NextResponse.json(normalized);


  } catch (err: any) {
    console.error("❌ CALL 2 ERROR:", err);
    return NextResponse.json(
      { error: err.message ?? "CALL 2 failed" },
      { status: 500 }
    );
  }
}
