export function normalizeResume(raw: any) {
  const c = raw.curriculo_otimizado;

  return {
    curriculo_otimizado: {
      header: c.header,

      resumo_profissional:
        c.resumo_profissional ||
        c.resumos?.profissional ||
        "",

      trajetoria_profissional: {
        anos_de_experiencia_total:
          c.trajetoria_profissional?.anos_de_experiencia_total || "N/A",
        data_inicio_carreira:
          c.trajetoria_profissional?.data_inicio_carreira ||
          c.trajetoria_profissional?.inicio_de_carreira ||
          "",
        quantidade_experiencias_incluidas:
          c.experiencias_selecionadas?.length || 0
      },

      experiencias_selecionadas: c.experiencias_selecionadas.map((exp: any) => ({
        empresa: exp.company,
        periodo: exp.period,
        cargo_adaptado: exp.role,

        conquistas_focadas:
          exp.conquistas_focadas ||
          exp.highlights ||
          exp.responsabilidades_chave ||
          []
      })),

      skills_categorizadas: (c.skills?.categorizadas || c.skills_categorizadas || []).map((cat: any) => ({
        categoria: cat.categoria,
        itens: cat.skills || cat.itens || []
      })),

      soft_skills:
        c.soft_skills ||
        c.soft_skills_relevantes ||
        [],

      skills_destacadas:
        c.skills_destacadas ||
        c.skills?.priorizadas_para_vaga?.must_have ||
        [],

      certificacoes_relevantes:
        c.certificacoes_relevantes ||
        c.certificacoes_e_formacao?.map((c: any) => c.titulo) ||
        [],

      educacao:
        c.educacao ||
        c.certificacoes_e_formacao ||
        [],

      idiomas: c.idiomas || []
    },

    analise_de_gap: raw.alinhamento_com_vaga
      ? {
          nivel_de_aderencia: {
            percentual: raw.alinhamento_com_vaga.fit_geral,
            interpretacao: raw.alinhamento_com_vaga.nivel_detectado
          },
          pontos_fortes: raw.alinhamento_com_vaga.principais_requisitos_atendidos?.map(
            (r: any) => r.requisito
          ),
          gaps_criticos: raw.alinhamento_com_vaga.lacunas_assumidas?.map(
            (l: any) => l.item
          )
        }
      : null,

    insights_estrategicos: {
      diferenciadores:
        raw.alinhamento_com_vaga?.palavras_chave_priorizadas || []
    }
  };
}
