
import React, { useState } from 'react';
import { TripBasicInfo } from '../types';

interface TripSetupProps {
  onSetupComplete: (info: TripBasicInfo) => void;
}

const TripSetup: React.FC<TripSetupProps> = ({ onSetupComplete }) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !startDate || !endDate) return;
    onSetupComplete({ destination, startDate, endDate });
  };

  /**
   * EDIT THESE VALUES TO CHANGE THE FIGURE IMAGE
   * Width: Horizontal size
   * Height: Vertical size (use 'auto' to maintain aspect ratio)
   */
  const figureSettings = {
    // Using a high-quality transparent PNG of Anpanman
    imageUrl: 'https://i.ibb.co/Qv245xP9/adnpanman.png',
    width: '420px', 
    height: 'auto',
    position: 'right' 
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-xl mx-auto animate-in fade-in zoom-in duration-500">
      {/* Header Section - The background remains the CMYK brand-red */}
      <div className="relative h-64 bg-brand-red flex items-end justify-start overflow-hidden">
        
        {/* Figure Image Container - Now positioned to the right */}
        <div className="absolute inset-0 flex items-center justify-end pr-0 pointer-events-none">
           <img 
             src={figureSettings.imageUrl}
             alt="Anpanman Figure"
             style={{ 
               width: figureSettings.width, 
               height: figureSettings.height,
               objectFit: 'contain',
               backgroundColor: 'transparent'
             }}
             className="drop-shadow-[0_20px_20px_rgba(0,0,0,0.3)] opacity-95 transition-transform duration-700 hover:scale-105 translate-x-12"
           />
        </div>

        {/* Text Overlay - Positioned to the bottom-left */}
        <div className="relative z-10 text-left pl-8 pb-8 max-w-[60%]">
          <h2 className="text-4xl font-outfit font-black text-white mb-1 [text-shadow:_0_4px_12px_rgba(0,0,0,0.6)] tracking-tight">
            Set Up Your Trip
          </h2>
          <p className="text-white font-bold text-lg [text-shadow:_0_2px_6px_rgba(0,0,0,0.5)] opacity-90">
            Plan your adventures with Anpanman!
          </p>
        </div>
        
        {/* Subtle Decorative Gradient to give depth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 pointer-events-none" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white relative z-20">
        <div>
          <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Destination</label>
          <div className="relative group">
            <input 
              required
              type="text" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Where are you going?" 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-slate-800 font-medium group-hover:bg-white"
            />
            <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400 group-focus-within:text-brand-red transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Start Date</label>
            <input 
              required
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">End Date</label>
            <input 
              required
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all font-medium"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-4 bg-brand-red text-white rounded-2xl font-outfit font-black text-xl shadow-xl shadow-red-200 hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Begin Arranging
        </button>
      </form>
    </div>
  );
};

export default TripSetup;
