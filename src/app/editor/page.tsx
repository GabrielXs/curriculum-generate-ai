return (
    <div className="min-h-screen bg-gradient-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">TailorCV</h1>
              <p className="text-xs text-muted-foreground">Editor de Perfil</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Resetar
            </Button>
            <Button asChild size="sm">
              <Link to="/">
                Voltar ao Início
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-8 space-y-8">
        <ProfileHeader data={data} onUpdate={updateField} />

        <SummarySection summary={data.summary} onUpdate={updateSummary} />

        <Tabs defaultValue="experience" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="experience" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Experiência</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Formação</span>
            </TabsTrigger>
            <TabsTrigger value="certifications" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Certificações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="experience" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Experiência Profissional</h2>
              <Button onClick={addExperience}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-4">
              {data.experiences.map((exp, index) => (
                <ExperienceCard
                  key={exp.id}
                  experience={exp}
                  onChange={(updated) => updateExperience(index, updated)}
                  onDelete={() => deleteExperience(index)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <h2 className="text-xl font-semibold mb-4">Habilidades Técnicas</h2>
            <SkillsSection
              skills={data.skills}
              onChange={(skills) => updateField("skills", skills)}
            />
          </TabsContent>

          <TabsContent value="education">
            <h2 className="text-xl font-semibold mb-4">Formação Acadêmica</h2>
            <EducationSection
              education={data.education}
              onChange={(education) => updateField("education", education)}
            />
          </TabsContent>

          <TabsContent value="certifications">
            <h2 className="text-xl font-semibold mb-4">Certificações</h2>
            <CertificationsSection
              certifications={data.certifications}
              onChange={(certs) => updateField("certifications", certs)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );