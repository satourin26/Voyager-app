
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'itinerary' | 'shopping' | 'plan';
  setActiveTab: (tab: 'itinerary' | 'shopping' | 'plan') => void;
  lastSaved?: string | null;
  onExport?: () => void;
  onImport?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasPlan?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, lastSaved, onExport, onImport, hasPlan }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const triggerImport = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a3 3 0 013 3V16.5a1.5 1.5 0 001.5 1.5h1.343M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg md:text-xl font-outfit font-bold text-slate-800 tracking-tight">Voyager Arrange</h1>
          </div>
          
          <div className="flex sm:hidden items-center gap-3">
            {lastSaved && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Saved {lastSaved}
              </div>
            )}
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300"></div>
          </div>
        </div>

        <nav className="flex bg-slate-100 p-1 rounded-xl shadow-inner w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab('plan')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'plan' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Trip Details
          </button>
          <button 
            onClick={() => setActiveTab('itinerary')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'itinerary' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Schedule
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${activeTab === 'shopping' ? 'bg-white text-brand-red shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Shopping
          </button>
        </nav>

        <div className="hidden sm:flex items-center gap-4">
           {lastSaved && (
             <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               Auto-saved at {lastSaved}
             </div>
           )}
           
           <div className="flex items-center gap-2">
             {onImport && (
               <>
                 <input 
                   type="file" 
                   ref={fileInputRef}
                   onChange={onImport}
                   accept=".json"
                   className="hidden"
                 />
                 <button 
                   onClick={triggerImport}
                   className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                   Import Data
                 </button>
               </>
             )}

             {hasPlan && onExport && (
               <button 
                 onClick={onExport}
                 className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                 Export Data
               </button>
             )}
           </div>

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
