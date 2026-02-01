import { z } from "zod";

export const OptimizeResumeSchema = z.object({
  curriculo_otimizado: z.object({
    header: z.object({
      name: z.string(),
      target_role: z.string(),
      contact: z.object({
        email: z.string(),
        phone: z.string(),
        linkedin: z.string(),
        github: z.string().optional(),
        location: z.string()
      })
    }),

    resumo_profissional: z.string().optional(),

    trajetoria_profissional: z.object({
      anos_de_experiencia_total: z.string(),
      inicio_de_carreira: z.string().optional(),
      data_inicio_carreira: z.string().optional(),
      quantidade_experiencias_incluidas: z.number().optional()
    }).optional(),

    experiencias_selecionadas: z.array(
      z.object({
        company: z.string(),
        role: z.string(),
        period: z.string(),

        // para compatibilidade com sua UI
        empresa: z.string().optional(),
        periodo: z.string().optional(),
        cargo_adaptado: z.string().optional(),

        highlights: z.array(z.string()).optional(),
        conquistas_focadas: z.array(z.string()).optional(),

        contexto: z.string().optional(),
        responsabilidades_chave: z.array(z.string()).optional(),
        impactos_mensuraveis: z.array(z.string()).optional(),
        stack_tecnologica: z.array(z.string()).optional()
      })
    ),

    skills_categorizadas: z.array(
      z.object({
        categoria: z.string(),
        skills: z.array(z.string()).optional(),
        itens: z.array(z.string()).optional()
      })
    ).optional(),

    soft_skills: z.array(z.string()).optional(),
    skills_destacadas: z.array(z.union([
      z.string(),
      z.object({
        skill: z.string(),
        evidencia: z.string().optional()
      })
    ])).optional(),

    certificacoes_relevantes: z.array(z.string()).optional(),
    educacao: z.array(z.any()).optional(),
    idiomas: z.array(z.string()).optional()
  }),

  analise_de_gap: z.any().optional(),
  insights_estrategicos: z.any().optional()
});
