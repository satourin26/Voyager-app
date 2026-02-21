
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'itinerary' | 'shopping' | 'plan';
  setActiveTab: (tab: 'itinerary' | 'shopping' | 'plan') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5a1.5 1.5 0 001.5 1.5h1.343M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-outfit font-bold text-slate-800 tracking-tight">Voyager Arrange</h1>
        </div>

        <nav className="flex bg-slate-100 p-1 rounded-xl shadow-inner">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'plan' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Trip Details
          </button>
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'itinerary' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'shopping' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Shopping
          </button>
        </nav>

        <div className="hidden md:flex items-center gap-4 text-slate-400">
           <svg className="w-6 h-6 hover:text-slate-600 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
           <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300"></div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
        <div className="max-w-5xl mx-auto h-full">
          {children}
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-400">
        Voyager Arrange • Anpanman Edition • CMYK Theme
      </footer>
    </div>
  );
};

export default Layout;
