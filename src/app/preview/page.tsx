'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PreviewPage() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem('tailoredResume');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log('📦 Dados carregados:', parsed);
        setData(parsed);
      } catch (error) {
        console.error('❌ Erro ao parsear:', error);
      }
    } else {
      console.warn('⚠️ Nenhum dado encontrado');
    }
  }, []);

  // Função para atualizar dados editáveis
  const handleEdit = (path: string[], value: any) => {
    if (!data) return;
    const newData = JSON.parse(JSON.stringify(data));
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    setData(newData);
    localStorage.setItem('tailoredResume', JSON.stringify(newData));
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">📄</div>
        <p className="text-slate-600 font-medium mb-2">Aguardando geração do currículo...</p>
        <p className="text-slate-400 text-sm">Os dados aparecerão aqui automaticamente</p>
        
        <div className="mt-6 p-4 bg-slate-800 text-white rounded-lg text-left text-xs font-mono">
          <div className="font-bold mb-2 text-yellow-400">🔍 Debug Info:</div>
          <div>localStorage exists: {localStorage.getItem('tailoredResume') ? '✓ YES' : '✗ NO'}</div>
          <button 
            onClick={() => {
              const saved = localStorage.getItem('tailoredResume');
              if (saved) {
                console.log('Raw data:', saved);
                alert('Verifique o console (F12)');
              }
            }}
            className="mt-2 bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
          >
            Ver dados no console
          </button>
        </div>
      </div>
    </div>
  );

  const { curriculo_otimizado, analise_de_gap, insights_estrategicos, alinhamento_com_vaga } = data;

  if (!curriculo_otimizado || !curriculo_otimizado.header) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-slate-800 font-bold text-xl mb-2">Estrutura de dados inválida</p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-xs font-mono overflow-auto max-h-60">
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('tailoredResume');
              router.push('/');
            }}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Limpar e voltar
          </button>
        </div>
      </div>
    );
  }

  // Adapter para compatibilidade com diferentes formatos
  const gap_analysis = analise_de_gap || alinhamento_com_vaga || {};

  return (
    <main className="min-h-screen bg-slate-200 py-10 print:p-0 print:bg-white print:min-h-0 text-slate-900">
      {/* CONTAINER A4 */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none print:max-w-full min-h-[297mm] print:min-h-0 p-[15mm] flex flex-col gap-6 print:gap-4">
        
        {/* HEADER */}
        <header className="border-b-4 border-slate-900 pb-4 print:pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(e) => handleEdit(['curriculo_otimizado', 'header', 'name'], e.currentTarget.textContent || '')}
                className="text-4xl font-black uppercase tracking-tighter leading-none focus:outline-none focus:bg-yellow-50"
              >
                {curriculo_otimizado.header.name}
              </h1>
              <h2 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(e) => handleEdit(['curriculo_otimizado', 'header', 'target_role'], e.currentTarget.textContent || '')}
                className="text-lg font-bold text-blue-600 uppercase tracking-widest mt-2 focus:outline-none focus:bg-yellow-50"
              >
                {curriculo_otimizado.header.target_role}
              </h2>
            </div>
            
            {/* INDICADOR DE SENIORIDADE */}
            {curriculo_otimizado.trajetoria_profissional && (
              <div className="text-right">
                <span className="text-[10pt] font-black bg-slate-900 text-white px-3 py-1.5 uppercase tracking-tight inline-block">
                  {curriculo_otimizado.trajetoria_profissional.anos_de_experiencia_total}
                </span>
                <p className="text-[8pt] text-slate-500 mt-1 font-mono">
                  Since: {curriculo_otimizado.trajetoria_profissional.data_inicio_carreira}
                </p>
                <p className="text-[7pt] text-slate-400 font-bold">
                  {curriculo_otimizado.trajetoria_profissional.quantidade_experiencias_incluidas} roles
                </p>
              </div>
            )}
          </div>
          
          {/* CONTATOS */}
          <div className="flex flex-wrap gap-3 mt-4 text-[9pt] text-slate-600 font-medium">
            {curriculo_otimizado.header.contact.location && (
              <>
                <span contentEditable suppressContentEditableWarning className="focus:outline-none focus:bg-yellow-50">
                  {curriculo_otimizado.header.contact.location}
                </span>
                <span>•</span>
              </>
            )}
            {curriculo_otimizado.header.contact.email && (
              <>
                <span contentEditable suppressContentEditableWarning className="focus:outline-none focus:bg-yellow-50">
                  {curriculo_otimizado.header.contact.email}
                </span>
                <span>•</span>
              </>
            )}
            {curriculo_otimizado.header.contact.phone && (
              <>
                <span contentEditable suppressContentEditableWarning className="focus:outline-none focus:bg-yellow-50">
                  {curriculo_otimizado.header.contact.phone}
                </span>
                <span>•</span>
              </>
            )}
            {curriculo_otimizado.header.contact.linkedin && (
              <>
                <span contentEditable suppressContentEditableWarning className="lowercase focus:outline-none focus:bg-yellow-50">
                  {curriculo_otimizado.header.contact.linkedin}
                </span>
              </>
            )}
            {curriculo_otimizado.header.contact.github && (
              <>
                <span>•</span>
                <span contentEditable suppressContentEditableWarning className="lowercase focus:outline-none focus:bg-yellow-50">
                  {curriculo_otimizado.header.contact.github}
                </span>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8 print:gap-6">
          {/* COLUNA PRINCIPAL - 2/3 */}
          <div className="col-span-2 space-y-6 print:space-y-4">
            
            {/* RESUMO PROFISSIONAL */}
            <section className="page-break-inside-avoid">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-2 pb-1">
                Professional Summary
              </h3>
              <p 
                contentEditable 
                suppressContentEditableWarning 
                onBlur={(e) => handleEdit(['curriculo_otimizado', 'resumo_profissional'], e.currentTarget.textContent || '')}
                className="text-[10.5pt] leading-relaxed text-justify text-slate-700 focus:outline-none focus:bg-yellow-50"
              >
                {curriculo_otimizado.resumo_profissional}
              </p>
            </section>

            {/* EXPERIÊNCIAS PROFISSIONAIS */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-4 pb-1 print:mb-3">
                Professional Experience
              </h3>
              {curriculo_otimizado.experiencias_selecionadas?.map((exp: any, i: number) => (
                <div key={i} className="mb-6 print:mb-4 experience-item page-break-inside-avoid">
                  <div className="flex justify-between items-baseline font-bold text-slate-900 text-[11pt] mb-0.5">
                    <span contentEditable suppressContentEditableWarning className="focus:outline-none focus:bg-yellow-50">
                      {exp.empresa}
                    </span>
                    <span contentEditable suppressContentEditableWarning className="text-[9pt] font-mono text-slate-500 focus:outline-none focus:bg-yellow-50">
                      {exp.periodo}
                    </span>
                  </div>
                  <div 
                    contentEditable 
                    suppressContentEditableWarning 
                    className="text-blue-600 font-bold text-[10pt] italic mb-2 uppercase tracking-tight focus:outline-none focus:bg-yellow-50"
                  >
                    {exp.cargo_adaptado}
                  </div>
                  <ul className="space-y-2">
                    {exp.conquistas_focadas?.map((bullet: string, j: number) => (
                      <li key={j} className="flex gap-2 text-[10pt] leading-snug text-slate-700">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span 
                          contentEditable 
                          suppressContentEditableWarning 
                          className="flex-1 text-justify focus:outline-none focus:bg-yellow-50"
                        >
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* CERTIFICAÇÕES */}
            {curriculo_otimizado.certificacoes_relevantes?.length > 0 && (
              <section className="page-break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-3 pb-1">
                  Certifications
                </h3>
                <ul className="space-y-1">
                  {curriculo_otimizado.certificacoes_relevantes.map((cert: string, i: number) => (
                    <li key={i} className="text-[10pt] text-slate-700 flex gap-2">
                      <span className="text-blue-500 font-bold">✓</span>
                      <span contentEditable suppressContentEditableWarning className="focus:outline-none focus:bg-yellow-50">
                        {cert}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* COLUNA LATERAL - 1/3 */}
          <div className="col-span-1 space-y-6 print:space-y-4">
            
            {/* HARD SKILLS */}
            {curriculo_otimizado.skills_categorizadas?.length > 0 && (
              <section className="page-break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-3 pb-1 print:mb-2">
                  Technical Skills
                </h3>
                {curriculo_otimizado.skills_categorizadas.map((cat: any, i: number) => (
                  <div key={i} className="mb-4 print:mb-3">
                    <h4 className="text-[8px] font-black text-slate-500 uppercase mb-1.5 tracking-tighter">
                      {cat.categoria}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {cat.itens?.map((skill: string, j: number) => (
                        <span 
                          key={j} 
                          className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-slate-800 text-[8.5px] font-bold uppercase tracking-tighter"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* SOFT SKILLS */}
            {curriculo_otimizado.soft_skills?.length > 0 && (
              <section className="page-break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-3 pb-1 print:mb-2">
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-1">
                  {curriculo_otimizado.soft_skills.map((skill: string, i: number) => (
                    <span 
                      key={i} 
                      className="px-2 py-1 border border-blue-300 bg-blue-50 text-blue-700 text-[8.5px] font-bold uppercase tracking-tight"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* CORE EXPERTISE */}
            {curriculo_otimizado.skills_destacadas?.length > 0 && (
              <section className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-sm border border-blue-200 page-break-inside-avoid">
                <h3 className="text-[9px] font-black uppercase tracking-widest text-blue-600 mb-2">
                  Core Expertise
                </h3>
                <div className="space-y-1">
                  {curriculo_otimizado.skills_destacadas.map((item: any, i: number) => {
                    const skillText = typeof item === 'string' ? item : item.skill;
                    const evidencia = typeof item === 'object' ? item.evidencia : null;
                    
                    return (
                      <div key={i} className="text-[9px] font-bold text-blue-900">
                        <div className="flex items-start gap-1">
                          <span className="text-blue-500">▸</span>
                          <span>{skillText}</span>
                        </div>
                        {evidencia && (
                          <div className="ml-3 text-[7.5px] text-blue-700 italic mt-0.5 print:hidden">
                            {evidencia}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* EDUCAÇÃO */}
            {curriculo_otimizado.educacao?.length > 0 && (
              <section className="page-break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-3 pb-1 print:mb-2">
                  Education
                </h3>
                <div className="space-y-2">
                  {curriculo_otimizado.educacao.map((edu: any, i: number) => (
                    <div key={i} className="text-[9pt]">
                      <div className="font-bold text-slate-900">{edu.grau || edu.degree}</div>
                      <div className="text-slate-700">{edu.area || edu.field}</div>
                      <div className="text-[8pt] text-slate-500">{edu.instituicao || edu.institution}</div>
                      <div className="text-[8pt] text-slate-400">{edu.periodo}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* IDIOMAS */}
            {curriculo_otimizado.idiomas?.length > 0 && (
              <section className="page-break-inside-avoid">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b mb-3 pb-1 print:mb-2">
                  Languages
                </h3>
                <div className="space-y-1">
                  {curriculo_otimizado.idiomas.map((lang: string, i: number) => (
                    <div key={i} className="text-[9pt] text-slate-700">
                      • {lang}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* DIFERENCIADORES */}
            {insights_estrategicos?.diferenciadores?.length > 0 && (
              <section className="bg-slate-50 p-3 rounded-sm border border-slate-200 page-break-inside-avoid print:hidden">
                <h3 className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">
                  Key Differentiators
                </h3>
                <div className="space-y-1.5">
                  {insights_estrategicos.diferenciadores.map((diff: string, i: number) => (
                    <p key={i} className="text-[8px] text-slate-700 leading-tight">
                      <span className="text-green-600 font-bold">✓</span> {diff}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* PAINEL DE ANÁLISE */}
      {gap_analysis && (gap_analysis.nivel_de_aderencia || gap_analysis.fit_geral) && (
        <div className="max-w-[210mm] mx-auto mt-8 print:hidden">
          <div className="bg-slate-900 rounded-xl p-6 shadow-2xl">
            <h2 className="text-white font-black text-xl mb-6 uppercase tracking-tight">
              📊 Gap Analysis & Match Score
            </h2>
            
            <div className="grid grid-cols-2 gap-6">
              {/* MATCH SCORE */}
              <div className="bg-slate-800 rounded-lg p-5">
                <div className="text-slate-400 text-xs uppercase font-bold mb-2">Match Score</div>
                <div className="text-5xl font-black text-blue-400 mb-3">
                  {gap_analysis.nivel_de_aderencia?.percentual || 
                   (gap_analysis.fit_geral === 'high' ? '85%' : gap_analysis.fit_geral === 'medium' ? '65%' : '40%')}
                </div>
                {gap_analysis.nivel_de_aderencia?.interpretacao && (
                  <p className="text-sm italic text-slate-300 mb-3">
                    {gap_analysis.nivel_de_aderencia.interpretacao}
                  </p>
                )}
                {gap_analysis.nivel_de_aderencia?.calculo_detalhado && (
                  <div className="text-xs text-slate-400 space-y-1 font-mono">
                    <div>Must-have: {gap_analysis.nivel_de_aderencia.calculo_detalhado.requisitos_obrigatorios_atendidos}</div>
                    <div>Nice-to-have: {gap_analysis.nivel_de_aderencia.calculo_detalhado.requisitos_desejaveis_atendidos}</div>
                  </div>
                )}
              </div>

              {/* PONTOS FORTES */}
              {(gap_analysis.pontos_fortes?.length > 0 || gap_analysis.principais_requisitos_atendidos?.length > 0) && (
                <div className="bg-green-900/30 rounded-lg p-5 border border-green-700">
                  <div className="text-green-400 text-xs uppercase font-bold mb-3">Strengths</div>
                  <ul className="space-y-2 text-xs text-green-100">
                    {(gap_analysis.pontos_fortes || gap_analysis.principais_requisitos_atendidos?.map((r: any) => r.requisito) || [])
                      .slice(0, 4)
                      .map((ponto: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-400">✓</span>
                          <span>{ponto}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* GAPS CRÍTICOS */}
              {(gap_analysis.gaps_criticos?.length > 0 || gap_analysis.lacunas_assumidas?.length > 0) && (
                <div className="bg-red-900/30 rounded-lg p-5 border border-red-700">
                  <div className="text-red-400 text-xs uppercase font-bold mb-3">Critical Gaps</div>
                  <ul className="space-y-2 text-xs text-red-100 max-h-60 overflow-y-auto">
                    {(gap_analysis.gaps_criticos || gap_analysis.lacunas_assumidas?.map((l: any) => l.item) || [])
                      .map((gap: string, i: number) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-red-400">✗</span>
                          <span>{gap}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* RECOMENDAÇÕES */}
              {gap_analysis.recomendacoes?.length > 0 && (
                <div className="bg-yellow-900/30 rounded-lg p-5 border border-yellow-700">
                  <div className="text-yellow-400 text-xs uppercase font-bold mb-3">Recommendations</div>
                  <ul className="space-y-2 text-xs text-yellow-100">
                    {gap_analysis.recomendacoes.map((rec: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-yellow-400">➜</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BOTÕES */}
      <div className="fixed bottom-8 right-8 flex gap-4 print:hidden">
        <button 
          onClick={() => router.push('/')}
          className="bg-slate-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold hover:bg-slate-700 transition-all"
        >
          ← Voltar
        </button>
        <button 
          onClick={() => {
            if (confirm('Salvar alterações?')) {
              localStorage.setItem('tailoredResume', JSON.stringify(data));
              alert('✓ Salvo!');
            }
          }}
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold hover:bg-green-700 transition-all"
        >
          💾 Salvar
        </button>
        <button 
          onClick={() => window.print()} 
          className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold hover:bg-blue-700 transition-all"
        >
          🖨️ Imprimir
        </button>
      </div>

      {/* ESTILOS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        
        body { 
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
        }
        
        [contentEditable]:focus {
          outline: 2px dashed #3b82f6;
          outline-offset: 2px;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          
          main > div {
            max-width: 100% !important;
            width: 210mm !important;
            min-height: auto !important;
            padding: 12mm 15mm !important;
            margin: 0 !important;
            box-shadow: none !important;
          }
          
          .print\\:hidden { 
            display: none !important; 
          }
          
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          header {
            page-break-after: avoid !important;
            break-after: avoid !important;
            padding-bottom: 0.5rem !important;
            margin-bottom: 1rem !important;
          }
          
          .grid {
            page-break-inside: auto !important;
            gap: 1.25rem !important;
          }
          
          section {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          .experience-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 0.75rem !important;
          }
          
          h1 {
            font-size: 2rem !important;
            line-height: 1.1 !important;
          }
          
          h2 {
            font-size: 0.95rem !important;
            margin-top: 0.35rem !important;
          }
          
          h3 {
            font-size: 0.65rem !important;
            margin-bottom: 0.4rem !important;
          }
          
          p, span, li {
            font-size: 9.5pt !important;
            line-height: 1.35 !important;
          }
          
          .bg-gradient-to-br {
            padding: 0.5rem !important;
          }
          
          .bg-gradient-to-br div {
            font-size: 7.5pt !important;
          }
          
          ul {
            margin-top: 0.4rem !important;
          }
          
          li {
            margin-bottom: 0.35rem !important;
          }
          
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          * {
            box-shadow: none !important;
          }
        }
      `}</style>
    </main>
  );
}