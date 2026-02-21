
import React, { useState, useRef, useEffect } from 'react';
import { TravelPlan, ScheduleItem, DayPlan } from '../types';
import { lookupLocationDetails, lookupTransitDetails } from '../services/geminiService';

interface ItineraryManagerProps {
  plan: TravelPlan;
  onUpdatePlan: (updatedPlan: TravelPlan) => void;
}

const ItineraryManager: React.FC<ItineraryManagerProps> = ({ plan, onUpdatePlan }) => {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingTransitId, setLoadingTransitId] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempDestination, setTempDestination] = useState(plan.destination);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSave = () => {
    if (tempDestination.trim()) {
      onUpdatePlan({ ...plan, destination: tempDestination.trim() });
    } else {
      setTempDestination(plan.destination);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleTitleSave();
    if (e.key === 'Escape') {
      setTempDestination(plan.destination);
      setIsEditingTitle(false);
    }
  };

  const addItem = (dayId: string) => {
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      startTime: '12:00',
      endTime: '13:00',
      isRange: true,
      activity: 'New Activity',
      content: '',
    };

    const updatedDays = plan.days.map(day => 
      day.id === dayId ? { ...day, items: [...day.items, newItem].sort((a, b) => a.startTime.localeCompare(b.startTime)) } : day
    );
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const updateItem = (dayId: string, itemId: string, updates: Partial<ScheduleItem>) => {
    const updatedDays = plan.days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          items: day.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
            .sort((a, b) => a.startTime.localeCompare(b.startTime))
        };
      }
      return day;
    });
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const deleteItem = (dayId: string, itemId: string) => {
    const updatedDays = plan.days.map(day => 
      day.id === dayId ? { ...day, items: day.items.filter(i => i.id !== itemId) } : day
    );
    onUpdatePlan({ ...plan, days: updatedDays });
  };

  const handleLookup = async (dayId: string, item: ScheduleItem) => {
    setLoadingId(item.id);
    const details = await lookupLocationDetails(item.activity, plan.destination);
    if (details) {
      updateItem(dayId, item.id, { location: details.title, locationUrl: details.uri });
    }
    setLoadingId(null);
  };

  const handleTransitLookup = async (dayId: string, item: ScheduleItem) => {
    setLoadingTransitId(item.id);
    const details = await lookupTransitDetails(item.activity, plan.destination);
    if (details) {
      updateItem(dayId, item.id, { transitDetail: details.title, transitUrl: details.uri });
    }
    setLoadingTransitId(null);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <input
                ref={titleInputRef}
                type="text"
                value={tempDestination}
                onChange={(e) => setTempDestination(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={handleKeyDown}
                className="text-3xl font-outfit font-bold text-slate-900 bg-white border-b-2 border-brand-red focus:outline-none w-full max-w-lg"
              />
            </div>
          ) : (
            <div 
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              <h2 className="text-3xl font-outfit font-bold text-slate-900">{plan.destination}</h2>
              <button className="text-slate-300 group-hover:text-brand-red transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          )}
          <p className="text-slate-500 font-medium mt-1">From {new Date(plan.startDate).toLocaleDateString()} to {new Date(plan.endDate).toLocaleDateString()}</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm self-start"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print
        </button>
      </div>

      <div className="space-y-8">
        {plan.days.map((day, idx) => (
          <div key={day.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
              <h3 className="text-xl font-outfit font-bold text-slate-800">
                Day {idx + 1} <span className="ml-2 text-slate-400 font-normal">• {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              </h3>
              <button 
                onClick={() => addItem(day.id)}
                className="text-brand-red hover:text-red-700 font-bold text-sm flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-red-100 shadow-sm transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                Add Event
              </button>
            </div>

            <div className="p-4 md:p-8 space-y-4">
              {day.items.length === 0 ? (
                <p className="text-slate-400 italic text-center py-4">No events scheduled for this day.</p>
              ) : (
                day.items.map((item) => (
                  <div key={item.id} className="group relative flex flex-col md:flex-row gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all">
                    <div className="flex-shrink-0 flex items-center gap-2 min-w-[140px] h-fit">
                      <div className="flex items-center gap-1">
                        <input 
                          type="time" 
                          value={item.startTime}
                          onChange={(e) => updateItem(day.id, item.id, { startTime: e.target.value })}
                          className="bg-transparent text-sm font-bold text-brand-red focus:outline-none focus:ring-1 focus:ring-red-300 rounded"
                        />
                        {item.isRange && (
                          <>
                            <span className="text-slate-400 text-xs font-bold">~</span>
                            <input 
                              type="time" 
                              value={item.endTime}
                              onChange={(e) => updateItem(day.id, item.id, { endTime: e.target.value })}
                              className="bg-transparent text-sm font-bold text-brand-red focus:outline-none focus:ring-1 focus:ring-red-300 rounded"
                            />
                          </>
                        )}
                      </div>
                      <button 
                        onClick={() => updateItem(day.id, item.id, { isRange: !item.isRange })}
                        className={`p-1 rounded transition-colors ${item.isRange ? 'text-brand-red bg-red-50' : 'text-slate-300 hover:text-slate-500 hover:bg-slate-100'}`}
                        title={item.isRange ? "Switch to single time" : "Switch to time range"}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {item.isRange ? (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 12H4" />
                          ) : (
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          )}
                        </svg>
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col gap-1">
                        <input 
                          type="text" 
                          value={item.activity}
                          onChange={(e) => updateItem(day.id, item.id, { activity: e.target.value })}
                          placeholder="Activity name..."
                          className="w-full bg-transparent text-lg font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-300 rounded px-1"
                        />
                        <textarea
                          rows={1}
                          value={item.content || ''}
                          onChange={(e) => updateItem(day.id, item.id, { content: e.target.value })}
                          placeholder="Add details or notes..."
                          className="w-full bg-transparent text-sm font-bold text-slate-600 focus:outline-none focus:ring-1 focus:ring-red-200 rounded px-1 resize-none overflow-hidden"
                          onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = `${target.scrollHeight}px`;
                          }}
                        />
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        {item.locationUrl ? (
                          <a 
                            href={item.locationUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-brand-red bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                            {item.location || 'View on Maps'}
                          </a>
                        ) : (
                          <button 
                            disabled={loadingId === item.id}
                            onClick={() => handleLookup(day.id, item)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            {loadingId === item.id ? (
                              <svg className="animate-spin h-3.5 w-3.5 text-brand-red" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            )}
                            Find on Maps
                          </button>
                        )}

                        {item.transitUrl ? (
                          <a 
                            href={item.transitUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full hover:bg-amber-100 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            {item.transitDetail || 'Real-time Transit'}
                          </a>
                        ) : (
                          <button 
                            disabled={loadingTransitId === item.id}
                            onClick={() => handleTransitLookup(day.id, item)}
                            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            {loadingTransitId === item.id ? (
                              <svg className="animate-spin h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                            )}
                            Lookup Transit
                          </button>
                        )}
                        
                        <button 
                          onClick={() => deleteItem(day.id, item.id)}
                          className="p-1 text-slate-300 hover:text-rose-500 md:opacity-0 group-hover:opacity-100 transition-all ml-auto"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryManager;
