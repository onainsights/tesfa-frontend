'use client';

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Layout from '../sharedComponents/Layout';
import ChatWidget from './components/ChatBot';
import ProtectedRoute from '../sharedComponents/ProtectedRoot';
import MapLegend from './components/legend';
const MapClient = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div className="p-4">Loading map...</div>,
});
const DashboardPage = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {

      if (
        event.data &&
        (event.data.type === 'wallet_request' || event.data.type === 'mm_init')
      ) {
        if (
          event.source &&
          typeof (event.source as Window).postMessage === 'function'
        ) {
          (event.source as Window).postMessage(
            {
              type: 'wallet_response',
              status: 'ignored',
              id: event.data.id,
            },
            event.origin
          );
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);
  return (
    <ProtectedRoute>
      <Layout>
        <div className="flex flex-row h-screen bg-gray-100">
          <main className="flex-1 relative">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1150] bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-md text-lg text-gray-700 font-medium border border-gray-200">
              🔍 What are the long-term health risks in conflict-affected regions?
            </div>
            <MapClient />
            <ChatWidget />
            <MapLegend/>
          </main>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default DashboardPage;