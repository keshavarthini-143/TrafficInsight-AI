
import React, { useState } from 'react';
import { analyzeTraffic } from './services/geminiService';
import { TrafficAnalysis, GroundingChunk } from './types';
import TrafficMap from './components/TrafficMap';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<TrafficAnalysis | null>(null);
  const [grounding, setGrounding] = useState<GroundingChunk[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const result = await analyzeTraffic(query);
      setAnalysis(result.analysis);
      setGrounding(result.grounding);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze traffic. Please check your API connection.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'red': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'orange': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'green': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TrafficInsight AI</h1>
              <p className="text-xs text-slate-500 font-medium">REAL-TIME CONGESTION ENGINE</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative group flex-1 max-w-xl">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter location (e.g., Porur, Manhattan, Shibuya)..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all text-slate-200 placeholder-slate-500"
            />
            <svg className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              disabled={loading}
              className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? '...' : 'Analyze'}
            </button>
          </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visualization */}
        <div className="lg:col-span-8 space-y-6">
          <TrafficMap analysis={analysis} loading={loading} />
          
          {analysis && !loading && (
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Traffic Summary
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {analysis.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Details & Legend */}
        <div className="lg:col-span-4 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          {analysis && !loading ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Status Card */}
              <div className={`border rounded-2xl p-6 transition-colors ${getStatusColor(analysis.roadColor)}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-70">Current Status</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/20">AI Confidence: {analysis.confidence}</span>
                </div>
                <h2 className="text-3xl font-black mb-1">{analysis.message}</h2>
                <p className="text-sm font-medium opacity-90">{analysis.location}</p>
              </div>

              {/* Grounding Card */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-xl">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Location Sources</h3>
                <div className="space-y-3">
                  {grounding.length > 0 ? (
                    grounding.map((chunk, idx) => chunk.maps && (
                      <a 
                        key={idx}
                        href={chunk.maps.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all group"
                      >
                        <span className="text-sm font-medium text-slate-300 truncate pr-2">{chunk.maps.title}</span>
                        <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No grounding sources available.</p>
                  )}
                </div>
              </div>

              {/* Tips Section */}
              <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-6">
                <h3 className="text-indigo-400 font-bold text-sm mb-3">Hackathon Fact</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  This system uses multi-modal Gemini analysis. It correlates historical patterns with live location grounding to provide explainable traffic intelligence.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-3xl text-center opacity-50">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A2 2 0 013 15.487V6a2 2 0 011.132-1.803l5.444-2.722a2 2 0 011.848 0l5.447 2.723A2 2 0 0118 6v9.487a2 2 0 01-1.132 1.803l-5.444 2.722a2 2 0 01-1.848 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-400">Ready for Analysis</h3>
              <p className="text-sm text-slate-500 mt-2">Enter any location in the search bar to get AI-powered traffic insights.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t border-slate-900 bg-slate-950 text-center">
        <p className="text-slate-600 text-xs font-medium">Built with Gemini AI & Google Maps Grounding • Future of Smart Cities</p>
      </footer>
    </div>
  );
};

export default App;
