'use client';

import React, { useState } from 'react';
import Layout from '../sharedComponents/Layout';
import ProtectedRoute from '../sharedComponents/ProtectedRoot';
import { Database, GitBranch, AlertTriangle, Globe, ChevronDown, ChevronUp } from 'lucide-react';

const Section = ({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) => (
  <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-primary-dark">{title}</h2>
    </div>
    {children}
  </div>
);

const PipelineStep = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
      {number}
    </div>
    <div className="pb-6 border-b border-border last:border-0 last:pb-0 flex-1">
      <p className="font-semibold text-primary-dark text-base mb-1">{title}</p>
      <p className="text-base text-primary-dark leading-relaxed">{description}</p>
    </div>
  </div>
);

const DataSource = ({ title, description }: { title: string; description: string }) => (
  <div className="flex gap-3 py-3 border-b border-border last:border-0">
    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
    <div>
      <p className="text-base font-semibold text-primary-dark">{title}</p>
      <p className="text-base text-primary-dark mt-0.5 leading-relaxed">{description}</p>
    </div>
  </div>
);

const CountryRow = ({ country, status, regions, color }: { country: string; status: string; regions: string; color: string }) => (
  <tr className="border-b border-border last:border-0">
    <td className="py-3 pr-4 text-base font-medium text-primary-dark">{country}</td>
    <td className="py-3 pr-4">
      <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: color }}>
        {status}
      </span>
    </td>
    <td className="py-3 text-base text-primary-dark">{regions}</td>
  </tr>
);

function DataJourneyDiagram() {
  return (
    <div className="w-full overflow-x-auto">
      <svg width="100%" viewBox="0 0 680 620" style={{ minWidth: 480 }}>
        <defs>
          <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M2 1L8 5L2 9" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </marker>
        </defs>

        {/* Step labels */}
        <text x="340" y="18" textAnchor="middle" fontSize={13} fill="#9CA3AF" fontWeight={800}>1. Data sources</text>

        {/* Row 1: Sources */}
        <rect x="40" y="30" width="170" height="44" rx="8" fill="#378ADD" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="125" y="52" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">WHO / UNHCR</text>

        <rect x="255" y="30" width="170" height="44" rx="8" fill="#378ADD" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="340" y="52" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Conflict records</text>

        <rect x="470" y="30" width="170" height="44" rx="8" fill="#378ADD" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="555" y="52" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Academic research</text>

        {/* L-shaped arrows from sources to vector DB */}
        <path d="M125 74 L125 130 L290 130 L290 150" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>
        <path d="M340 74 L340 150" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>
        <path d="M555 74 L555 130 L390 130 L390 150" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>

        {/* Row 2: Vector DB */}
        <text x="340" y="127" textAnchor="middle" fontSize={13} fill="#9CA3AF" fontWeight={800}>2. Knowledge base</text>
        <rect x="190" y="154" width="300" height="44" rx="8" fill="#1D9E75" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="340" y="176" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Supabase vector DB (pgvector)</text>

        {/* Arrow down */}
        <path d="M340 198 L340 228" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>

        {/* Row 3: Query */}
        <text x="350" y="224" textAnchor="start" fontSize={13} fill="#9CA3AF" fontWeight={800}>3. Query</text>
        <rect x="215" y="232" width="250" height="44" rx="8" fill="#6B7280" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="340" y="254" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Query formation</text>

        {/* Arrow down */}
        <path d="M340 276 L340 306" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>

        {/* Row 4: BioGPT */}
        <text x="350" y="302" textAnchor="start" fontSize={13} fill="#9CA3AF" fontWeight={800}>4. Retrieval</text>
        <rect x="215" y="310" width="250" height="44" rx="8" fill="#7C3AED" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="340" y="332" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">BioGPT retrieval</text>

        {/* Arrow down */}
        <path d="M340 354 L340 384" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>

        {/* Row 5: Ollama */}
        <text x="350" y="380" textAnchor="start" fontSize={13} fill="#9CA3AF" fontWeight={800}>5. Generation</text>
        <rect x="190" y="388" width="300" height="44" rx="8" fill="#E8543A" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="340" y="410" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Ollama / gemma3:27b</text>

        {/* L-shaped arrows to outputs */}
        <path d="M280 432 L280 490 L160 490 L160 510" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>
        <path d="M340 432 L340 510" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>
        <path d="M400 432 L400 490 L520 490 L520 510" fill="none" stroke="#9CA3AF" strokeWidth={0.8} markerEnd="url(#arr)"/>

        {/* Row 6: Outputs */}
        <text x="350" y="506" textAnchor="start" fontSize={13} fill="#9CA3AF" fontWeight={800}>6. Outputs</text>
        <rect x="40" y="514" width="240" height="44" rx="8" fill="#1D9E75" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="160" y="536" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Map dashboard</text>

        <rect x="310" y="514" width="120" height="44" rx="8" fill="#1D9E75" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="370" y="536" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Report</text>

        <rect x="460" y="514" width="180" height="44" rx="8" fill="#1D9E75" stroke="rgba(0,0,0,0.1)" strokeWidth={0.5}/>
        <text x="550" y="536" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} fill="#fff">Chat interface</text>
      </svg>
    </div>
  );
}

export default function MethodologyPage() {
  const [limitationsOpen, setLimitationsOpen] = useState(false);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-surface-secondary overflow-y-auto h-screen">

          <div className="max-w-4xl mx-auto px-8 pt-10 pb-2">
            <h1 className="text-3xl font-bold mb-3 text-primary-dark">Methodology & Technical Documentation</h1>
            <p className="text-primary-dark text-base leading-relaxed max-w-2xl">
              How Tesfa generates AI-powered health risk predictions for conflict-affected regions in East Africa.
            </p>
          </div>

          <div className="max-w-4xl mx-auto px-8 py-8 space-y-6">

            {/* AI Disclaimer */}
            <div className="bg-accent/10 border border-accent/30 rounded-2xl p-6 flex gap-4">
              <AlertTriangle className="text-accent-muted flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-base font-semibold text-primary-dark mb-1">AI-Generated Content Disclaimer</p>
                <p className="text-base text-primary-dark leading-relaxed">
                  All predictions, health risk assessments, and recommendations on this platform are produced by artificial intelligence.
                  Outputs are indicative and probabilistic — they should not replace expert medical, humanitarian, or policy judgment.
                  Always validate findings with local data and subject matter experts.
                </p>
              </div>
            </div>

            {/* Overview */}
            <Section icon={<Globe size={20} />} title="Overview">
              <p className="text-base text-primary-dark leading-relaxed mb-4">
                Tesfa is an AI-powered proof-of-concept platform developed by Ona Insights to support NGOs, health agencies,
                and policymakers working in conflict-affected regions of East Africa. The platform draws on a global conflict health knowledge base spanning over 105,000 document embeddings
                from conflict-affected regions worldwide, including East Africa, the Middle East, and Central Africa,
                to generate contextually grounded health risk predictions.
              </p>
              <p className="text-base text-primary-dark leading-relaxed">
                This document explains the data sources, prediction pipeline, and technical architecture underpinning
                Tesfa's outputs, providing transparency to help users interpret results appropriately.
              </p>
            </Section>

            {/* Data Sources */}
            <Section icon={<Database size={20} />} title="Data Sources">
              <p className="text-base text-primary-dark mb-5 leading-relaxed">
                Tesfa's predictions are grounded in a curated knowledge base of conflict health data spanning 2000–2025:
              </p>
              <DataSource
                title="WHO Health Bulletins & Emergency Situation Reports"
                description="Disease surveillance, outbreak alerts, and health system assessments from conflict-affected regions."
              />
              <DataSource
                title="UNHCR Displacement & Refugee Health Data"
                description="Population movement patterns, displacement camp health indicators, and nutrition assessments."
              />
              <DataSource
                title="Conflict Health Surveillance Records"
                description="Epidemiological data collected during and after armed conflict, including disease incidence and mortality rates."
              />
              <DataSource
                title="Academic Research Literature"
                description="Peer-reviewed studies on the health consequences of armed conflict, displacement, and healthcare system collapse (2000–2025)."
              />
              <DataSource
                title="Humanitarian Cluster Reports"
                description="Health cluster situation reports from OCHA and partner agencies covering Sudan, Ethiopia, South Sudan, and Somalia."
              />

              {/* Coverage Table */}
              <div className="mt-6">
                <p className="text-base font-semibold text-primary-dark mb-3">Geographic Coverage</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-border">
                        <th className="text-left text-xs font-semibold text-primary-dark/60 uppercase tracking-wide pb-2 pr-4">Country</th>
                        <th className="text-left text-xs font-semibold text-primary-dark/60 uppercase tracking-wide pb-2 pr-4">Status</th>
                        <th className="text-left text-xs font-semibold text-primary-dark/60 uppercase tracking-wide pb-2">Regions Assessed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <CountryRow country="Sudan" status="Active Conflict" regions="Khartoum, Central Darfur, North Darfur, North Kordofan, South Kordofan" color="#E8543A" />
                      <CountryRow country="Ethiopia" status="Post War" regions="Tigray, Amhara, Afar, Oromiya, Somali Region" color="#BA6D58" />
                      <CountryRow country="South Sudan" status="Active Conflict" regions="Upper Nile, Jonglei, Northern Bahr el Ghazal" color="#E8543A" />
                      <CountryRow country="Somalia" status="Active Conflict" regions="Hiiraan, Shabeellaha Dhexe, Jubbada Hoose" color="#E8543A" />
                      <CountryRow country="Kenya" status="No Conflict" regions="Not yet assessed" color="#386c80" />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Limitations */}
              <button
                onClick={() => setLimitationsOpen(!limitationsOpen)}
                className="mt-5 flex items-center gap-2 text-base text-primary font-medium hover:text-primary-hover transition-colors cursor-pointer"
              >
                {limitationsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {limitationsOpen ? 'Hide' : 'Show'} data limitations
              </button>
              {limitationsOpen && (
                <div className="mt-3 bg-surface-secondary rounded-xl p-4 space-y-2">
                  {[
                    'Data cutoff is 2025 — events after this date are not reflected in predictions.',
                    'Coverage is limited to five countries — predictions are not available for other conflict-affected regions.',
                    'Data quality varies by source and region — areas with restricted humanitarian access may have limited data.',
                    'Historical data may not fully capture rapidly evolving conflict dynamics.',
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 text-base text-primary-dark">
                      <span className="text-accent-muted mt-0.5">⚠</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* Prediction Pipeline */}
            <Section icon={<GitBranch size={20} />} title="Prediction Pipeline">
              <p className="text-base text-primary-dark mb-6 leading-relaxed">
                Health risk predictions are generated through a six-step pipeline combining context retrieval,
                natural language processing, and structured output generation:
              </p>
              <div className="space-y-0">
                <PipelineStep
                  number={1}
                  title="Query Formation"
                  description='A health risk assessment query is formulated for a specific country or region — e.g. "What are the health risks in Khartoum, Sudan?"'
                />
                <PipelineStep
                  number={2}
                  title="Context Retrieval (BioGPT)"
                  description="The query is passed to BioGPT, a biomedical language model, which searches the Supabase vector database for relevant conflict health documents, academic studies, and humanitarian reports."
                />
                <PipelineStep
                  number={3}
                  title="Augmented Generation (Ollama / gemma3:27b)"
                  description="Retrieved context is combined with the original query and passed to gemma3:27b (hosted via Ollama), which generates a structured JSON prediction including disease names, risk scores, risk levels, and recommended interventions."
                />
                <PipelineStep
                  number={4}
                  title="Output Validation & Storage"
                  description="The structured JSON output is validated, normalised, and stored in the Supabase PostgreSQL database linked to the relevant country or region."
                />
                <PipelineStep
                  number={5}
                  title="Visualisation"
                  description="Predictions are retrieved via the Django REST API and displayed on the Tesfa map dashboard and chat interface."
                />
                <PipelineStep
                  number={6}
                  title="Report Generation"
                  description="The AI synthesises predictions across all assessed countries and regions into a comprehensive Health Risk Analysis Report, including disease breakdowns, risk scores, regional hotspot analysis, and actionable recommendations for humanitarian intervention."
                />
              </div>
            </Section>

            {/* Data Journey Diagram — after pipeline */}
            <Section icon={<GitBranch size={20} />} title="Data Journey">
              <p className="text-base text-primary-dark mb-6 leading-relaxed">
                The diagram below shows how data flows from source documents through the AI pipeline to produce predictions displayed on the platform.
              </p>
              <DataJourneyDiagram />
            </Section>

            {/* RAG Architecture */}
            <Section icon={<GitBranch size={20} />} title="RAG Architecture">
              <p className="text-base text-primary-dark mb-5 leading-relaxed">
                Tesfa uses a <strong className="text-primary-dark">Retrieval-Augmented Generation (RAG)</strong> architecture
                to ensure predictions are grounded in real-world conflict health data rather than relying solely on the AI
                model's general training knowledge.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-surface-secondary rounded-xl p-5 border border-border">
                  <p className="text-base font-semibold text-primary-dark mb-2">🔍 Retrieval</p>
                  <p className="text-base text-primary-dark leading-relaxed">
                    Before generating a response, the system searches the vector database for the most contextually
                    relevant conflict health documents and retrieves them as context.
                  </p>
                </div>
                <div className="bg-surface-secondary rounded-xl p-5 border border-border">
                  <p className="text-base font-semibold text-primary-dark mb-2">✨ Generation</p>
                  <p className="text-base text-primary-dark leading-relaxed">
                    The retrieved documents are provided to the language model as context, enabling it to produce
                    more accurate, grounded, and evidence-informed predictions.
                  </p>
                </div>
              </div>

              <p className="text-base text-primary-dark mb-6 leading-relaxed">
                This approach reduces AI hallucinations and ensures predictions reflect actual documented health
                patterns in conflict-affected regions. Documents are stored as vector embeddings in Supabase using
                the pgvector extension, enabling semantic similarity search.
              </p>

              <div>
                <p className="text-base font-semibold text-primary-dark mb-3">Technology Stack</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { label: 'Frontend', value: 'Next.js 15, Tailwind CSS, Leaflet, Recharts' },
                    { label: 'Backend', value: 'Django, Django REST Framework, PostgreSQL' },
                    { label: 'AI Pipeline', value: 'BioGPT, Ollama / gemma3:27b, LiteLLM' },
                    { label: 'Vector Storage', value: 'Supabase pgvector' },
                    { label: 'Deployment', value: 'AWS EC2, pm2, Nginx' },
                    { label: 'Data Period', value: '2000–2025' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-2 bg-surface-secondary rounded-lg px-4 py-3 border border-border">
                      <span className="text-sm font-semibold text-primary-dark/60 w-28 flex-shrink-0">{item.label}</span>
                      <span className="text-sm text-primary-dark">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Section>

            {/* Footer */}
            <div className="text-center text-sm text-primary-dark/50 py-6 border-t border-border">
              <p>Tesfa AI Health Intelligence Platform — A Demo by Ona Insights</p>
              <p className="mt-1">
                Questions? Contact us at{' '}
                <a href="mailto:info@onainsights.io" className="text-primary hover:underline">info@onainsights.io</a>
              </p>
            </div>

          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}