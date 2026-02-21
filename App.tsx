
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import TripSetup from './components/PlanWizard'; 
import ItineraryManager from './components/ItineraryDisplay'; 
import ShoppingList from './components/ShoppingList';
import { TravelPlan, TripBasicInfo, ShoppingItem, DayPlan } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'shopping' | 'plan'>('plan');
  const [currentPlan, setCurrentPlan] = useState<TravelPlan | null>(null);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const savedPlan = localStorage.getItem('voyager_arranged_plan');
    if (savedPlan) {
      try {
        const parsed = JSON.parse(savedPlan);
        setCurrentPlan(parsed);
        setShoppingItems(parsed.shoppingList || []);
        setActiveTab('itinerary');
        setLastSaved(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Failed to load saved plan", e);
      }
    }
  }, []);

  // Save to local storage whenever currentPlan or shoppingItems change
  useEffect(() => {
    if (currentPlan) {
      const planToSave = { ...currentPlan, shoppingList: shoppingItems };
      localStorage.setItem('voyager_arranged_plan', JSON.stringify(planToSave));
      setLastSaved(new Date().toLocaleTimeString());
    }
  }, [currentPlan, shoppingItems]);

  const handleExport = () => {
    if (!currentPlan) return;
    const dataStr = JSON.stringify({ ...currentPlan, shoppingList: shoppingItems }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `voyager_plan_${currentPlan.destination.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleSetupTrip = (info: TripBasicInfo) => {
    const start = new Date(info.startDate);
    const end = new Date(info.endDate);
    const days: DayPlan[] = [];
    
    let current = new Date(start);
    while (current <= end) {
      days.push({
        id: Math.random().toString(36).substr(2, 9),
        date: current.toISOString().split('T')[0],
        items: []
      });
      current.setDate(current.getDate() + 1);
    }

    const newPlan: TravelPlan = {
      id: Date.now().toString(),
      destination: info.destination,
      startDate: info.startDate,
      endDate: info.endDate,
      days,
      shoppingList: [],
    };

    setCurrentPlan(newPlan);
    setShoppingItems([]);
    setActiveTab('itinerary');
  };

  const updatePlan = (updatedPlan: TravelPlan) => {
    setCurrentPlan({ ...updatedPlan, shoppingList: shoppingItems });
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      lastSaved={lastSaved} 
      onExport={handleExport}
      hasPlan={!!currentPlan}
    >
      {activeTab === 'plan' && (
        <TripSetup onSetupComplete={handleSetupTrip} />
      )}

      {activeTab === 'itinerary' && (
        currentPlan ? (
          <ItineraryManager 
            plan={currentPlan} 
            onUpdatePlan={updatePlan}
          />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 animate-in fade-in duration-500 shadow-sm">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-red">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            </div>
            <h2 className="text-xl font-outfit font-bold text-slate-800 mb-2">Ready for Adventure?</h2>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Set up your trip details with Anpanman and let's start arranging your schedule.</p>
            <button 
              onClick={() => setActiveTab('plan')}
              className="bg-brand-red text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-red-700 hover:scale-105 transition-all"
            >
              Start Planning
            </button>
          </div>
        )
      )}

      {activeTab === 'shopping' && (
        <ShoppingList items={shoppingItems} setItems={setShoppingItems} />
      )}
    </Layout>
  );
};

export default App;
