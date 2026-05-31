'use client';

import React, { useEffect, useState } from 'react';
import Layout from '../sharedComponents/Layout';
import ProtectedRoute from '../sharedComponents/ProtectedRoot';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = {
  teal: '#2BBCB2',
  yellow: '#FFC342',
  red: '#E8543A',
  salmon: '#BA6D58',
  dark: '#00353D',
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
      { disease_name: 'Infectious Diseases', risk_score: 70, risk_level: 'medium' },
    ],
    regions: [
      {
        name: 'Khartoum',
        description: 'Ongoing conflict, displacement, limited healthcare access, and economic instability create a conducive environment for disease outbreaks and hinder access to treatment.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases (Cholera, Dysentery)', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Non-Communicable Diseases', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Wound Infections', risk_score: 75, risk_level: 'high' },
        ],
      },
      {
        name: 'Central Darfur',
        description: 'The ongoing armed conflict in Central Darfur disrupts healthcare access, infrastructure, and basic services, leading to increased vulnerability to infectious diseases and exacerbating existing health issues.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Non-Communicable Diseases', risk_score: 75, risk_level: 'high' },
        ],
      },
      {
        name: 'North Darfur',
        description: 'The ongoing armed conflict in North Darfur disrupts healthcare access, sanitation, and food security, creating a high-risk environment for both communicable and non-communicable diseases, particularly among internally displaced people.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Non-Communicable Diseases', risk_score: 75, risk_level: 'high' },
        ],
      },
      {
        name: 'North Kordofan',
        description: 'Ongoing armed conflict in North Kordofan disrupts healthcare access and creates conditions conducive to the spread of infectious diseases, along with exacerbating pre-existing non-communicable conditions.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Wound Infections', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Non-Communicable Diseases', risk_score: 75, risk_level: 'high' },
        ],
      },
      {
        name: 'South Kordofan',
        description: 'The ongoing armed conflict in South Kordofan leads to internal displacement, disruption of healthcare services, and increased vulnerability to both communicable and non-communicable diseases.',
        diseases: [
          { disease_name: 'Non-Communicable Diseases', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Infectious Diseases', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Mental Health Disorders', risk_score: 65, risk_level: 'medium' },
        ],
      },
    ],
  },
  {
    name: 'Ethiopia',
    conflict_type: 'Post War',
    color: COLORS.salmon,
    description: 'The conflict in Tigray region has led to displacement, damage to the healthcare system, and a lack of access to basic necessities like clean water and sanitation. Despite a ceasefire, the region continues to face severe humanitarian challenges.',
    diseases: [
      { disease_name: 'Displacement Health Issues', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malnutrition', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Waterborne Diseases', risk_score: 70, risk_level: 'medium' },
      { disease_name: 'Injuries from Conflict', risk_score: 65, risk_level: 'medium' },
    ],
    regions: [
      {
        name: 'Tigray',
        description: 'Conflict disruption, rural setting, and weakened health systems create increased vulnerability to infectious diseases and injuries.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Respiratory Infections', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Wound Infections', risk_score: 65, risk_level: 'medium' },
        ],
      },
      {
        name: 'Amhara',
        description: 'Armed conflict disrupts healthcare access, damages infrastructure, and increases vulnerability to disease outbreaks due to poor sanitation, displacement, and limited resources.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases (Cholera, Dysentery)', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Respiratory Infections (Pneumonia, TB)', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Wound Infections', risk_score: 65, risk_level: 'medium' },
          { disease_name: 'Mental Health Disorders (PTSD)', risk_score: 60, risk_level: 'medium' },
        ],
      },
      {
        name: 'Afar',
        description: 'The health risks in the Afar region are due to conflict-related disruptions to healthcare access, displacement, poor sanitation, and heightened vulnerability to infectious diseases.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Wound Infections', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Mental Health Disorders (PTSD)', risk_score: 75, risk_level: 'high' },
        ],
      },
      {
        name: 'Oromiya',
        description: 'The Oromiya region likely experiences increased disease transmission and limited healthcare access due to potential conflict, displacement, and strained healthcare infrastructure.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Pneumonia', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Newborn Health Complications', risk_score: 65, risk_level: 'medium' },
          { disease_name: 'Attack-related Injuries', risk_score: 60, risk_level: 'medium' },
        ],
      },
      {
        name: 'Somali Region',
        description: 'Active conflict, displacement, and disruption of health systems significantly increase the risk of infectious diseases and malnutrition in the Somali region of Ethiopia.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Wound Infections', risk_score: 75, risk_level: 'high' },
        ],
      },
    ],
  },
  {
    name: 'South Sudan',
    conflict_type: 'Active Conflict',
    color: COLORS.red,
    description: 'Ongoing conflict has led to mass displacement creating an environment highly conducive to the spread of waterborne diseases. Cholera outbreaks have become endemic in displacement camps.',
    diseases: [
      { disease_name: 'Cholera', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malaria', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Dysentery', risk_score: 70, risk_level: 'medium' },
    ],
    regions: [
      {
        name: 'Upper Nile',
        description: 'The Upper Nile region suffers from limited access to healthcare, displacement, and poor sanitation, creating breeding grounds for infectious diseases and exacerbating existing health issues.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Non-Communicable Diseases', risk_score: 65, risk_level: 'medium' },
        ],
      },
      {
        name: 'Jonglei',
        description: 'Jonglei region faces significant health risks due to infectious diseases, limited access to healthcare, and a challenging humanitarian context exacerbated by conflict and displacement.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Pneumonia', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Diarrhoea', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Newborn Health Issues', risk_score: 65, risk_level: 'medium' },
        ],
      },
      {
        name: 'Northern Bahr el Ghazal',
        description: 'Northern Bahr el Ghazal presents significant health risks due to disrupted healthcare access and increased vulnerability to both communicable and non-communicable diseases, alongside malnutrition.',
        diseases: [
          { disease_name: 'Non-Communicable Diseases', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Infectious Diseases', risk_score: 70, risk_level: 'medium' },
        ],
      },
    ],
  },
  {
    name: 'Somalia',
    conflict_type: 'Active Conflict',
    color: COLORS.red,
    description: "Somalia's prolonged conflict has led to a complete breakdown in healthcare infrastructure. Al-Shabaab insurgency continues to restrict humanitarian access leaving millions without basic health services.",
    diseases: [
      { disease_name: 'Tuberculosis (TB)', risk_score: 80, risk_level: 'high' },
      { disease_name: 'Malaria', risk_score: 75, risk_level: 'high' },
      { disease_name: 'Malnutrition', risk_score: 70, risk_level: 'medium' },
    ],
    regions: [
      {
        name: 'Hiiraan',
        description: 'The Hiiraan region faces significant health risks due to ongoing conflict, limited access to healthcare, and lack of reliable surveillance systems, leading to increased vulnerability to communicable diseases and malnutrition.',
        diseases: [
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
          { disease_name: 'Diarrheal Diseases', risk_score: 75, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 70, risk_level: 'medium' },
          { disease_name: 'Wound Infections', risk_score: 65, risk_level: 'medium' },
        ],
      },
      {
        name: 'Shabeellaha Dhexe',
        description: 'Shabeellaha Dhexe experiences high rates of infectious diseases and malnutrition due to limited access to healthcare, sanitation, safe water, and adequate food supplies.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Cholera', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
        ],
      },
      {
        name: 'Jubbada Hoose',
        description: 'Jubbada Hoose faces critical health risks due to conflict, lack of infrastructure, poor sanitation, and limited access to healthcare, creating conditions ripe for infectious disease outbreaks and malnutrition.',
        diseases: [
          { disease_name: 'Malaria', risk_score: 95, risk_level: 'high' },
          { disease_name: 'Cholera', risk_score: 90, risk_level: 'high' },
          { disease_name: 'Acute Respiratory Infections', risk_score: 85, risk_level: 'high' },
          { disease_name: 'Malnutrition', risk_score: 80, risk_level: 'high' },
        ],
      },
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

const StatCard = ({ title, value, subtitle, color }: { title: string; value: string | number; subtitle: string; color: string }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{title}</p>
    <p className="text-3xl font-bold mt-1" style={{ color }}>{value}</p>
    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
  </div>
);

export default function ReportPage() {
  const [activeCountry, setActiveCountry] = useState(0);
  const [activeRegion, setActiveRegion] = useState(0);

  useEffect(() => {
    setActiveRegion(0);
  }, [activeCountry]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="bg-surface-secondary overflow-y-auto h-screen">
          {/* Hero Header */}
          <div className="bg-primary text-white px-8 py-12">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-4">Health Risk Analysis Report</h1>
              <p className="text-white text-lg max-w-3xl leading-relaxed">
                A comprehensive AI-generated analysis of long-term health risks across conflict-affected regions in East Africa.
                This report synthesizes predictions from Sudan, Ethiopia, South Sudan, and Somalia based on historical conflict data,
                displacement patterns, healthcare access, and disease surveillance records from 2000–2025.
              </p>
              <div className="flex gap-4 mt-6 text-sm text-white flex-wrap">
                <span>📅 Data cutoff: 2025</span>
                <span>•</span>
                <span>🌍 4 countries analyzed</span>
                <span>•</span>
                <span>🗺️ 16 regions assessed</span>
                <span>•</span>
                <span>🦠 AI-generated disease risk assessments</span>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-8 py-10 space-y-12">

            {/* Executive Summary */}
            <section>
              <h2 className="text-2xl font-bold text-primary-dark mb-4">Executive Summary</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  This report presents Tesfa's AI-generated health risk assessments for four conflict-affected countries in East Africa:
                  Sudan, Ethiopia, South Sudan, and Somalia. All four countries are experiencing severe humanitarian crises driven by
                  armed conflict, population displacement, and the collapse of health systems — conditions that create ideal environments
                  for infectious disease outbreaks and nutritional emergencies.
                </p>
                <p className="text-gray-700 leading-relaxed text-base mb-4">
                  Across all assessed countries and regions, <strong>malaria emerges as the most consistently high-risk disease</strong>,
                  present across virtually every assessed region with risk scores frequently exceeding 80-95%. Acute respiratory infections,
                  diarrheal diseases, and malnutrition follow closely, reflecting the compounding effects of displacement, collapsed
                  sanitation infrastructure, and food insecurity that characterize conflict settings.
                </p>
                <p className="text-gray-700 leading-relaxed text-base">
                  At the regional level, Khartoum, Afar, Central Darfur, North Darfur, North Kordofan, Somali Region of Ethiopia,
                  Shabeellaha Dhexe, and Jubbada Hoose all show uniformly critical risk scores of 75-95% across multiple disease
                  categories — representing the most acute hotspots requiring immediate humanitarian intervention.
                </p>
              </div>
            </section>

            {/* Key Statistics */}
            <section>
              <h2 className="text-2xl font-bold text-primary-dark mb-4">Key Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard title="Countries Assessed" value={4} subtitle="East Africa region" color={COLORS.teal} />
                <StatCard title="Regions Assessed" value={16} subtitle="Sub-national level" color={COLORS.teal} />
                <StatCard title="Active Conflicts" value={3} subtitle="Sudan, S.Sudan, Somalia" color={COLORS.red} />
                <StatCard title="Post War" value={1} subtitle="Ethiopia" color={COLORS.salmon} />
              </div>
            </section>

            {/* Average Risk by Country */}
            <section>
              <h2 className="text-2xl font-bold text-primary-dark mb-2">Average Risk Score by Country</h2>
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
              <h2 className="text-2xl font-bold text-primary-dark mb-2">Risk Level Distribution</h2>
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
              <h2 className="text-2xl font-bold text-primary-dark mb-2">Most Prevalent Diseases Across the Region</h2>
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
                  Malaria is the most cross-cutting health threat across the region. Malnutrition and waterborne diseases
                  appear in multiple countries, reflecting the systemic collapse of food security and water infrastructure
                  under conflict conditions.
                </p>
              </div>
            </section>

            {/* Country + Region Deep Dives */}
            <section>
              <h2 className="text-2xl font-bold text-primary-dark mb-2">Country & Regional Analysis</h2>
              <p className="text-gray-500 mb-6">Detailed health risk breakdown at country and sub-national level.</p>

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

              {countryData.map((country, i) => (
                <div key={i} className={activeCountry === i ? 'block' : 'hidden'}>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    {/* Country header */}
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Country-Level Disease Risk</h4>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={country.diseases} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="disease_name" tick={{ fontSize: 9, fill: '#666' }} />
                            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#666' }} />
                            <Tooltip formatter={(val) => [`${val}%`, 'Risk Score']} />
                            <Bar dataKey="risk_score" fill={country.color} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
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
                                <div className="h-2 rounded-full" style={{ width: `${d.risk_score}%`, backgroundColor: d.risk_level === 'high' ? COLORS.red : COLORS.yellow }} />
                              </div>
                              <span className={`text-xs mt-0.5 inline-block ${d.risk_level === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                                {d.risk_level.toUpperCase()} RISK
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Regional breakdown */}
                    <div className="border-t border-gray-100 pt-8">
                      <h4 className="text-lg font-bold text-primary-dark mb-2">Regional Breakdown — {country.name}</h4>
                      <p className="text-gray-500 text-sm mb-5">Select a region to view its AI-generated health risk assessment.</p>

                      <div className="flex gap-2 mb-6 flex-wrap">
                        {country.regions.map((r, ri) => (
                          <button
                            key={ri}
                            onClick={() => setActiveRegion(ri)}
                            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeRegion === ri ? 'text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            style={activeRegion === ri ? { backgroundColor: country.color } : {}}
                          >
                            {r.name}
                          </button>
                        ))}
                      </div>

                      {country.regions.map((region, ri) => (
                        <div key={ri} className={activeRegion === ri ? 'block' : 'hidden'}>
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                              <h5 className="text-lg font-bold text-gray-800">{region.name}</h5>
                              <span className="text-sm font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: country.color }}>
                                Avg: {Math.round(region.diseases.reduce((s, d) => s + d.risk_score, 0) / region.diseases.length)}%
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6">{region.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={region.diseases} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                  <XAxis dataKey="disease_name" tick={{ fontSize: 8, fill: '#666' }} />
                                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#666' }} />
                                  <Tooltip formatter={(val) => [`${val}%`, 'Risk Score']} />
                                  <Bar dataKey="risk_score" fill={country.color} radius={[4, 4, 0, 0]} />
                                </BarChart>
                              </ResponsiveContainer>
                              <div className="space-y-3">
                                {region.diseases.map((d, di) => (
                                  <div key={di}>
                                    <div className="flex justify-between mb-1">
                                      <span className="text-xs font-medium text-gray-700">{d.disease_name}</span>
                                      <span className="text-xs font-bold" style={{ color: d.risk_level === 'high' ? COLORS.red : COLORS.yellow }}>
                                        {d.risk_score}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div className="h-1.5 rounded-full" style={{ width: `${d.risk_score}%`, backgroundColor: d.risk_level === 'high' ? COLORS.red : COLORS.yellow }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Conclusions */}
            <section>
              <h2 className="text-2xl font-bold text-primary-dark mb-4">Conclusions & Recommendations</h2>
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6">
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">1. Prioritize Malaria Control Across the Region</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Malaria consistently appears as a high-risk disease across virtually all assessed regions, with scores
                    reaching 95% in Khartoum, Afar, Central Darfur, North Darfur, North Kordofan, Somali Region, Shabeellaha
                    Dhexe, and Jubbada Hoose. Mass distribution of insecticide-treated bed nets, indoor residual spraying,
                    and uninterrupted supply of artemisinin-based combination therapies are urgent priorities.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">2. Tackle Acute Respiratory Infections Urgently</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Acute respiratory infections appear as a critical threat across Sudan, Ethiopia's Afar and Somali regions,
                    South Sudan, and Somalia, with risk scores of 85-90%. Overcrowded displacement camps, poor shelter, and
                    cold nights make respiratory disease prevention a top priority alongside vector control.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">3. WASH Interventions are Critical</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Diarrheal diseases including cholera and dysentery are present at high risk levels across multiple regions
                    in all four countries. Emergency WASH interventions — water purification, latrine construction in displacement
                    camps, and hygiene promotion — are essential to preventing mass outbreaks.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">4. Address Malnutrition as a Force Multiplier</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Malnutrition is particularly critical in Ethiopia's Somali region, Central Darfur, Northern Bahr el Ghazal,
                    and Somalia's coastal regions. It weakens immune systems, dramatically increasing susceptibility to all
                    other infectious diseases. Therapeutic feeding programs and food security interventions must be integrated
                    into health response plans.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg mb-2">5. Sub-National Targeting is Essential</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Regional analysis reveals the most critical hotspots: Khartoum, Afar, Central Darfur, North Darfur,
                    North Kordofan, Somali Region of Ethiopia, Shabeellaha Dhexe, and Jubbada Hoose all show uniformly
                    critical risk scores across multiple disease categories. Humanitarian response must move beyond
                    country-level targeting to ensure resources reach the highest-risk communities.
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