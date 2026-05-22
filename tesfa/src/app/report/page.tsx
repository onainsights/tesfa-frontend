'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../sharedComponents/Layout';
import ProtectedRoute from '../sharedComponents/ProtectedRoot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';

const COLORS = {
  teal: '#2BBCB2',
  yellow: '#F5A623',
  red: '#E8543A',
  salmon: '#BA6D58',
  dark: '#00353D',
  light: '#F0FAFA',
};

const countryData = [
  {
    name: 'Sudan',
    conflict_type: 'Active Conflict',
    color: COLORS.red,
    description: 'Conflict-related injuries and lack of access to healthcare services have led to a rise in infectious diseases, including typhoid fever and malaria. The ongoing civil war since April 2023 has devastated healthcare infrastructure, displacing millions and cutting off access to basic medical services across the country.',
    diseases: [
      { disease_name: 'Typhoid Fever', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malaria', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Infectious Diseases (Conflict)', risk_score: 70, risk_level: 'medium' },
    ],
  },
  {
    name: 'Ethiopia',
    conflict_type: 'Post War',
    color: COLORS.salmon,
    description: 'The conflict in Tigray region has led to displacement, damage to the healthcare system, and a lack of access to basic necessities like clean water and sanitation. Despite a ceasefire, the region continues to face severe humanitarian challenges with millions displaced and healthcare facilities still recovering from widespread destruction.',
    diseases: [
      { disease_name: 'Displacement Health Issues', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malnutrition', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Waterborne Diseases', risk_score: 70, risk_level: 'medium' },
      { disease_name: 'Injuries from Conflict', risk_score: 65, risk_level: 'medium' },
    ],
  },
  {
    name: 'South Sudan',
    conflict_type: 'Active Conflict',
    color: COLORS.red,
    description: 'Ongoing conflict has led to mass displacement, creating an environment highly conducive to the spread of waterborne diseases. Cholera outbreaks have become endemic in displacement camps, while malaria transmission remains persistently high due to collapsed vector control programs and inadequate shelter.',
    diseases: [
      { disease_name: 'Cholera', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malaria', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Dysentery', risk_score: 70, risk_level: 'medium' },
    ],
  },
  {
    name: 'Somalia',
    conflict_type: 'Active Conflict',
    color: COLORS.red,
    description: "Somalia's prolonged conflict has led to a complete breakdown in healthcare infrastructure, with limited access to clean water, sanitation, and medical care. Al-Shabaab insurgency continues to restrict humanitarian access to large parts of the country, leaving millions without basic health services.",
    diseases: [
      { disease_name: 'Tuberculosis (TB)', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malaria', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Malnutrition', risk_score: 70, risk_level: 'medium' },
    ],
  },
];

const allDiseases = countryData.flatMap(c => c.diseases.map(d => ({ ...d, country: c.name })));

const diseaseFrequency = allDiseases.reduce((acc: Record<string, number>, d) => {
  const key = d.disease_name;
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

const topDiseases = Object.entries(diseaseFrequency)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(([name, count]) => ({ name, count }));

const riskDistribution = [
  { name: 'High Risk', value: allDiseases.filter(d => d.risk_level === 'high').length, color: COLORS.red },
  { name: 'Medium Risk', value: allDiseases.filter(d => d.risk_level === 'medium').length, color: COLORS.yellow },
  { name: 'Low Risk', value: allDiseases.filter(d => d.risk_level === 'low').length, color: COLORS.teal },
];

const avgRiskByCountry = countryData.map(c => ({
  name: c.name,
  avgRisk: Math.round(c.diseases.reduce((sum, d) => sum + d.risk_score, 0) / c.diseases.length),
}));

const radarData = [
  { subject: 'Malaria', Sudan: 75, Ethiopia: 0, 'South Sudan': 75, Somalia: 75 },
  { subject: 'Malnutrition', Sudan: 0, Ethiopia: 75, 'South Sudan': 0, Somalia: 70 },
  { subject: 'Cholera', Sudan: 0, Ethiopia: 0, 'South Sudan': 80, Somalia: 0 },
  { subject: 'TB', Sudan: 0, Ethiopia: 0, 'South Sudan': 0, Somalia: 80 },
  { subject: 'Typhoid', Sudan: 80, Ethiopia: 0, 'South Sudan': 0, Somalia: 0 },
  { subject: 'Waterborne', Sudan: 70, Ethiopia: 70, 'South Sudan': 70, Somalia: 0 },
];

const StatCard = ({ title, value, subtitle, color }: { title: string; value: string | number; subtitle: string; color: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{title}</p>
    <p className="text-4xl font-bold mt-1" style={{ color }}>{value}</p>
    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
  </div>
);

export default function ReportPage() {
  const [activeCountry, setActiveCountry] = useState(0);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50 overflow-y-auto h-screen">
          {/* Hero Header */}
          <div className="bg-[#2BBCB2] text-white px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 text-[#2BBCB2] text-sm font-medium mb-3">
                <span></span>
              </div>
              <h1 className="text-4xl font-bold mb-4">Health Risk Analysis Report</h1>
              <p className="text-white text-lg max-w-3xl leading-relaxed">
                A comprehensive AI-generated analysis of long-term health risks across conflict-affected regions in East Africa.
                This report synthesizes predictions from Sudan, Ethiopia, South Sudan, and Somalia based on historical conflict data,
                displacement patterns, healthcare access, and disease surveillance records from 2000–2025.
              </p>
              <div className="flex gap-4 mt-6 text-s text-white">
                <span>📅 Data cutoff: 2025</span>
                <span>•</span>
                <span>🌍 4 countries analyzed</span>
                <span>•</span>
                <span>🦠 13 disease risk assessments</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 py-10 space-y-12">

            {/* Executive Summary */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-4">Executive Summary</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This report presents Tesfa's AI-generated health risk assessments for four conflict-affected countries in East Africa:
                  Sudan, Ethiopia, South Sudan, and Somalia. All four countries are experiencing severe humanitarian crises driven by
                  armed conflict, population displacement, and the collapse of health systems — conditions that create ideal environments
                  for infectious disease outbreaks and nutritional emergencies.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Across all assessed countries, <strong>malaria emerges as the most consistently high-risk disease</strong>, present
                  in three of four countries with risk scores of 75% or higher. Malnutrition and waterborne diseases follow closely,
                  reflecting the compounding effects of food insecurity and collapsed water and sanitation infrastructure that
                  characterize conflict settings.
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  Sudan and South Sudan face the most acute crisis conditions as active conflict zones, while Ethiopia's Tigray region,
                  despite a ceasefire, continues to experience severe post-conflict health consequences. Somalia's prolonged instability
                  has resulted in uniquely high tuberculosis risk alongside persistent malaria and malnutrition burdens.
                </p>
              </div>
            </section>

            {/* Key Statistics */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-4">Key Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Countries Assessed" value={4} subtitle="East Africa region" color={COLORS.teal} />
                <StatCard title="High Risk Diseases" value={8} subtitle="Risk score above 70%" color={COLORS.red} />
                <StatCard title="Avg Risk Score" value="74%" subtitle="Across all assessments" color={COLORS.yellow} />
                <StatCard title="Active Conflicts" value={3} subtitle="Sudan, S.Sudan, Somalia" color={COLORS.salmon} />
              </div>
            </section>

            {/* Average Risk by Country */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-2">Average Risk Score by Country</h2>
              <p className="text-gray-500 mb-6">Composite health risk score averaged across all assessed diseases per country.</p>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={avgRiskByCountry} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 13 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#666', fontSize: 13 }} />
                    <Tooltip formatter={(val) => [`${val}%`, 'Avg Risk Score']} />
                    <Bar dataKey="avgRisk" radius={[8, 8, 0, 0]}>
                      {avgRiskByCountry.map((entry, index) => (
                        <Cell key={index} fill={countryData[index].color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Risk Level Distribution */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-2">Risk Level Distribution</h2>
              <p className="text-gray-500 mb-6">Distribution of high, medium, and low risk assessments across all countries and diseases.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {riskDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center gap-4">
                  {riskDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          <span className="text-sm text-gray-500">{item.value} diseases</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${(item.value / allDiseases.length) * 100}%`, backgroundColor: item.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <p className="text-sm text-gray-500 mt-2">
                    {Math.round((riskDistribution[0].value / allDiseases.length) * 100)}% of all assessed diseases fall in the high risk category,
                    highlighting the severity of the humanitarian health crisis across the region.
                  </p>
                </div>
              </div>
            </section>

            {/* Most Common Diseases */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-2">Most Prevalent Diseases Across the Region</h2>
              <p className="text-gray-500 mb-6">Diseases appearing most frequently across all four country assessments.</p>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={topDiseases} layout="vertical" margin={{ top: 0, right: 30, left: 140, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#666', fontSize: 13 }} domain={[0, 4]} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#444', fontSize: 12 }} width={140} />
                    <Tooltip formatter={(val) => [`${val} countries`, 'Prevalence']} />
                    <Bar dataKey="count" fill={COLORS.teal} radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-500 mt-4">
                  Malaria is the only disease present as high risk across three of four countries, making it the single most
                  critical health threat in the region. Malnutrition and waterborne diseases appear in multiple countries,
                  reflecting the systemic collapse of food security and water infrastructure under conflict conditions.
                </p>
              </div>
            </section>

            {/* Country Deep Dives */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-2">Country-Level Analysis</h2>
              <p className="text-gray-500 mb-6">Detailed health risk breakdown for each assessed country.</p>

              {/* Tab Navigation */}
              <div className="flex gap-2 mb-6 flex-wrap">
                {countryData.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCountry(i)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCountry === i ? 'text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'}`}
                    style={activeCountry === i ? { backgroundColor: c.color } : {}}
                  >
                    {c.name}
                    <span className="ml-2 text-xs opacity-75">{c.conflict_type}</span>
                  </button>
                ))}
              </div>

              {/* Active Country Detail */}
              {countryData.map((country, i) => (
                <div key={i} className={activeCountry === i ? 'block' : 'hidden'}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{country.name}</h3>
                        <span className="inline-block mt-1 px-3 py-1 rounded-full text-white text-xs font-medium" style={{ backgroundColor: country.color }}>
                          {country.conflict_type}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Average Risk Score</p>
                        <p className="text-3xl font-bold" style={{ color: country.color }}>
                          {Math.round(country.diseases.reduce((s, d) => s + d.risk_score, 0) / country.diseases.length)}%
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-8">{country.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Disease Bar Chart */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Disease Risk Scores</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={country.diseases} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="disease_name" tick={{ fontSize: 10, fill: '#666' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#666' }} />
                            <Tooltip formatter={(val) => [`${val}%`, 'Risk Score']} />
                            <Bar dataKey="risk_score" fill={country.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Disease Risk List */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Risk Breakdown</h4>
                        <div className="space-y-3">
                          {country.diseases.map((d, j) => (
                            <div key={j}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{d.disease_name}</span>
                                <span className="text-sm font-bold" style={{ color: d.risk_level === 'high' ? COLORS.red : COLORS.yellow }}>
                                  {d.risk_score}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${d.risk_score}%`, backgroundColor: d.risk_level === 'high' ? COLORS.red : COLORS.yellow }}
                                />
                              </div>
                              <span className={`text-xs mt-0.5 inline-block ${d.risk_level === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {d.risk_level.toUpperCase()} RISK
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Disease Comparison Radar */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-2">Cross-Country Disease Comparison</h2>
              <p className="text-gray-500 mb-6">Radar chart showing disease risk overlap across all four countries.</p>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <ResponsiveContainer width="100%" height={380}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 12 }} />
                    <Radar name="Sudan" dataKey="Sudan" stroke={COLORS.red} fill={COLORS.red} fillOpacity={0.15} />
                    <Radar name="Ethiopia" dataKey="Ethiopia" stroke={COLORS.salmon} fill={COLORS.salmon} fillOpacity={0.15} />
                    <Radar name="South Sudan" dataKey="South Sudan" stroke={COLORS.yellow} fill={COLORS.yellow} fillOpacity={0.15} />
                    <Radar name="Somalia" dataKey="Somalia" stroke={COLORS.teal} fill={COLORS.teal} fillOpacity={0.15} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Conclusions */}
            <section>
              <h2 className="text-2xl font-bold text-[#00353D] mb-4">Conclusions & Recommendations</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-bold text-[#2BBCB2] text-lg mb-2">1. Prioritize Malaria Control Across the Region</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Malaria is the single most cross-cutting health threat in East Africa's conflict zones, affecting Sudan,
                    South Sudan, and Somalia with risk scores of 75% or higher. NGOs and health agencies should prioritize
                    mass distribution of insecticide-treated bed nets, indoor residual spraying programs, and ensuring
                    uninterrupted supply of artemisinin-based combination therapies (ACTs) across all three countries.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2BBCB2] text-lg mb-2">2. Address Malnutrition as a Cross-Cutting Driver</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Malnutrition in Ethiopia and Somalia acts as a critical force multiplier — weakening immune systems and
                    dramatically increasing susceptibility to infectious diseases. Therapeutic feeding programs, supplementary
                    nutrition for children under five, and food security interventions must be integrated into health response plans.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2BBCB2] text-lg mb-2">3. WASH Interventions are Critical in Active Conflict Zones</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Waterborne diseases including cholera, dysentery, and typhoid fever are prominent across Sudan and South Sudan,
                    reflecting the catastrophic collapse of water and sanitation infrastructure under active conflict. Emergency
                    WASH interventions — water purification, latrine construction in displacement camps, and hygiene promotion —
                    are essential to preventing mass outbreaks.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-[#2BBCB2] text-lg mb-2">4. Mental Health Cannot Be Overlooked</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Across all four countries, the psychological burden of conflict — PTSD, depression, grief, and trauma —
                    represents a largely invisible health crisis. Community-based psychosocial support, training of community
                    health workers in mental health first aid, and integration of mental health services into primary care
                    are urgently needed.
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="text-center text-sm text-gray-400 py-8 border-t border-gray-200">
              <p>Generated by Tesfa AI Health Intelligence Platform • Training data cutoff: 2025</p>
              <p className="mt-1">A Demo by Ona Insights</p>
            </div>

          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}