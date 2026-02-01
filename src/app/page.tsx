// "use client";
// import { useState } from "react";
// import { useRouter } from 'next/navigation';

// export default function Home() {
//   const router = useRouter();
//   const [vaga, setVaga] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleOtimizar = async () => {
//     // Validação
//     if (!vaga.trim()) {
//       alert("Por favor, preencha a descrição da vaga.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const response = await fetch("/api/optimize", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ vaga }),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Erro na API:", errorText);
//         alert(`Erro: ${errorText}`);
//         return;
//       }

//       const data = await response.json();
//       console.log("✅ Resultado da IA:", data);

//       // Salvar no localStorage
//       localStorage.setItem('resumeData', JSON.stringify(data));
//       console.log('💾 Dados salvos no localStorage');

//       // Navega para preview
//       router.push('/preview');
//     } catch (error) {
//       console.error("❌ Erro no handleOtimizar:", error);
//       alert(`Erro: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-8">
//       <div className="max-w-3xl mx-auto space-y-8">
//         {/* HEADER */}
//         <header className="text-center space-y-4">
//           <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
//             <h1 className="text-6xl font-black mb-2">TailorCV</h1>
//           </div>
//           <p className="text-gray-600 text-lg font-medium">
//             Otimize seu currículo para qualquer vaga em segundos
//           </p>
//         </header>

//         {/* CARD PRINCIPAL */}
//         <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
//           {/* Campo da Vaga */}
//           <div className="space-y-3">
//             <div className="flex items-center justify-between">
//               <label className="font-bold text-slate-800 text-lg flex items-center gap-2">
//                 🎯 Descrição da Vaga
//               </label>
//               <span className="text-xs text-slate-400 font-mono">
//                 {vaga.length} caracteres
//               </span>
//             </div>
            
//             <div className="relative">
//               <textarea
//                 value={vaga}
//                 className="w-full h-96 p-4 border-2 border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none text-slate-800 text-base leading-relaxed placeholder:text-slate-400 placeholder:text-sm"
//                 placeholder="Cole aqui a descrição completa da vaga incluindo título, localização, requisitos e responsabilidades..."
//                 onChange={(e) => setVaga(e.target.value)}
//               />
              
//               {/* Exemplo visual quando vazio */}
//               {!vaga && (
//                 <div className="absolute top-16 left-4 right-4 pointer-events-none">
//                   <div className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-lg p-4 text-sm text-slate-600">
//                     <p className="font-bold text-blue-700 mb-2">📋 Exemplo:</p>
//                     <div className="space-y-1 text-xs">
//                       <p><span className="font-semibold text-slate-700">Título:</span> Senior Android Engineer</p>
//                       <p><span className="font-semibold text-slate-700">Localização:</span> Remote (USA) ou São Paulo, Brasil</p>
//                       <p className="font-semibold text-slate-700 mt-2">Requisitos obrigatórios:</p>
//                       <p className="ml-3">• 5+ years Android development</p>
//                       <p className="ml-3">• Kotlin, Jetpack Compose</p>
//                       <p className="ml-3">• Experience with CI/CD</p>
//                       <p className="font-semibold text-slate-700 mt-2">Desejáveis:</p>
//                       <p className="ml-3">• Kotlin Multiplatform</p>
//                       <p className="ml-3">• Team leadership</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Botão de Otimizar */}
//           <button
//             onClick={handleOtimizar}
//             disabled={loading || !vaga.trim()}
//             className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center gap-3">
//                 <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                 </svg>
//                 <span className="text-lg">Processando com IA...</span>
//               </span>
//             ) : (
//               <span className="flex items-center justify-center gap-3">
//                 <span className="text-2xl">🚀</span>
//                 <span className="text-lg">Gerar Currículo Otimizado</span>
//               </span>
//             )}
//           </button>
//         </div>

//         {/* Dicas */}
//         <div className="grid md:grid-cols-2 gap-4">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-5">
//             <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
//               💡 Dicas para melhores resultados
//             </h3>
//             <ul className="text-sm text-blue-800 space-y-2">
//               <li className="flex gap-2">
//                 <span className="text-blue-600 font-black text-lg">✓</span>
//                 <span>Cole a descrição <strong>completa</strong> da vaga</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-blue-600 font-black text-lg">✓</span>
//                 <span>Inclua <strong>requisitos obrigatórios</strong> e desejáveis</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-blue-600 font-black text-lg">✓</span>
//                 <span>Mencione a <strong>localização</strong> claramente</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-blue-600 font-black text-lg">✓</span>
//                 <span>Para vagas EUA: use "USA", "United States" ou "Remote - US"</span>
//               </li>
//             </ul>
//           </div>

//           <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5">
//             <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
//               ⚡ Como funciona
//             </h3>
//             <ul className="text-sm text-purple-800 space-y-2">
//               <li className="flex gap-2">
//                 <span className="text-purple-600 font-black">1.</span>
//                 <span>Você cola a descrição da vaga</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-purple-600 font-black">2.</span>
//                 <span>IA analisa e extrai requisitos-chave</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-purple-600 font-black">3.</span>
//                 <span>Currículo é otimizado do seu perfil TOON</span>
//               </li>
//               <li className="flex gap-2">
//                 <span className="text-purple-600 font-black">4.</span>
//                 <span>Recebe análise de match e recomendações</span>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Info adicional */}
//         <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl">
//           <div className="flex items-start gap-4">
//             <div className="text-4xl">🎓</div>
//             <div>
//               <h3 className="font-bold text-xl mb-2">Otimização baseada em TOON</h3>
//               <p className="text-slate-300 text-sm leading-relaxed">
//                 Seu perfil TOON já está configurado no backend. A IA vai analisar a vaga e 
//                 adaptar automaticamente suas experiências, skills e conquistas para maximizar 
//                 o match com a posição desejada.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


"use client";

import { useState } from "react";
import { ResumeProvider } from "@/libs/resume-context";
import { SidebarNav } from "@/components/resume/sidebar-nav";
import { ResumeEditor } from "@/components/resume/resume-editor";
import { ResumeGenerator } from "@/components/resume/resume-generator";

export default function Home() {
  const [activeSection, setActiveSection] = useState<"editor" | "generator">("editor");

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-background">
        <SidebarNav
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="lg:ml-64 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {activeSection === "editor" ? (
              <ResumeEditor />
            ) : (
              <ResumeGenerator />
            )}
          </div>
        </main>
      </div>
    </ResumeProvider>
  );
}