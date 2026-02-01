# 👔 OpenCurriculumAI | Otimizador de Currículos com IA

**OpenCurriculumAI** é um software open source desenvolvido para transformar currículos genéricos em currículos estratégicos e personalizados para vagas específicas. Utilizando inteligência artificial llama, o projeto analisa a descrição da vaga e o perfil do candidato para gerar um resumo profissional de alto impacto.

---

## 🚀 Tecnologias Utilizadas

Este projeto utiliza uma stack moderna focada em performance e escalabilidade:

* **Frontend & Backend:** [Next.js 15+](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Motor de IA:** [Groq Cloud](https://groq.com/) (Llama 3.3 70B)
* **Integração:** REST API com processamento de JSON estruturado.

---

## ✨ Funcionalidades

- [x] **Input Estruturado:** Processamento de dados profissionais via texto/HTML.
- [x] **AI Resume Tuning:** Ajuste de tom e palavras-chave baseado na senioridade (foco em Tech Lead/Sênior).
- [x] **Gap Analysis:** Identificação automática de requisitos da vaga ausentes no perfil.
- [x] **Plano de Estudos Personalizado:** Cronograma de 4 semanas para cobrir as competências faltantes.
- [x] **Exportação Amigável:** Layout pronto para impressão via navegador (A4).

---

## 🛠️ Configuração Local

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório:**
```bash
   git clone [https://github.com/seu-usuario/tailor-cv.git](https://github.com/seu-usuario/tailor-cv.git)
   cd tailor-cv
```

Instale as dependências:
```Bash
npm install
```

Configure as variáveis de ambiente: Crie um arquivo .env.local na raiz do projeto e adicione sua chave do Groq:
```
GROQ_API_KEY=sua_chave_aqui
```
Inicie o servidor de desenvolvimento:

```Bash
    npm run dev
    Acesse http://localhost:3000 para ver o resultado.
```

🧠 Arquitetura de Prompt

O projeto utiliza uma estratégia de Prompt Híbrido:

    Instruções de Sistema: Em inglês para garantir o máximo de aderência do modelo e saída em JSON estruturado.

    Saída de Dados: Totalmente em Português (PT-BR) para o usuário final.

    Foco em Métricas: Diferente de geradores comuns, o prompt é instruído a utilizar verbos de ação e métricas de impacto, ideal para perfis de alta senioridade.

🛡️ Licença

Este projeto é de uso pessoal e para fins de estudo. Sinta-se à vontade para contribuir!

Feito com ☕
