
import React, { useState } from 'react';
import { ShoppingItem } from '../types';

interface ShoppingListProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items, setItems }) => {
  const [newItemName, setNewItemName] = useState('');
  const [priceTWD, setPriceTWD] = useState('');
  const [priceLocal, setPriceLocal] = useState('');
  const [localCurrency, setLocalCurrency] = useState('JPY');
  const [couponName, setCouponName] = useState('');
  const [couponUrl, setCouponUrl] = useState('');
  const [category, setCategory] = useState<ShoppingItem['category']>('Other');
  
  const [filter, setFilter] = useState<'All' | 'Completed' | 'Pending'>('All');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newItemName.trim();
    if (!trimmedName) return;
    
    const newItem: ShoppingItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      name: trimmedName,
      category,
      completed: false,
      priceTWD: priceTWD || undefined,
      priceLocal: priceLocal || undefined,
      localCurrency: localCurrency,
      couponName: couponName || undefined,
      couponUrl: couponUrl || undefined,
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
    setPriceTWD('');
    setPriceLocal('');
    setCouponName('');
    setCouponUrl('');
  };

  const toggleComplete = (id: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filteredItems = items.filter(item => {
    if (filter === 'Completed') return item.completed;
    if (filter === 'Pending') return !item.completed;
    return true;
  });

  const currencies = ['JPY', 'USD', 'EUR', 'KRW', 'THB', 'HKD', 'GBP'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-outfit font-bold text-slate-900">Packing & Shopping List</h2>
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`text-sm font-bold px-4 py-2 rounded-xl transition-all ${showAdvanced ? 'bg-brand-red text-white shadow-md' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            {showAdvanced ? 'Simple View' : 'Add Price/Coupon'}
          </button>
        </div>
        
        <form onSubmit={addItem} className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="What do you need to pack or buy?" 
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-slate-700 font-bold"
            >
              <option value="Food and Drinks">Food and Drinks</option>
              <option value="Luxury">Luxury</option>
              <option value="Clothing">Clothing</option>
              <option value="Electronics">Electronics</option>
              <option value="Cosmetics">Cosmetics</option>
              <option value="Other">Other</option>
            </select>
            {!showAdvanced && (
              <button 
                type="submit"
                className="bg-brand-red text-white px-8 py-3 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
              >
                Add Item
              </button>
            )}
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price (TWD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">$</span>
                  <input 
                    type="number" 
                    value={priceTWD}
                    onChange={(e) => setPriceTWD(e.target.value)}
                    placeholder="0" 
                    className="w-full pl-7 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Price ({localCurrency})</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    value={priceLocal}
                    onChange={(e) => setPriceLocal(e.target.value)}
                    placeholder="0" 
                    className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm text-slate-900"
                  />
                  <select 
                    value={localCurrency}
                    onChange={(e) => setLocalCurrency(e.target.value)}
                    className="px-2 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red text-xs font-bold text-slate-700"
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Coupon Info</label>
                <div className="flex flex-col gap-2">
                  <input 
                    type="text" 
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                    placeholder="Coupon name (e.g. 15% OFF)" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm text-slate-900"
                  />
                  <input 
                    type="url" 
                    value={couponUrl}
                    onChange={(e) => setCouponUrl(e.target.value)}
                    placeholder="Coupon URL (http://...)" 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="md:col-span-2 lg:col-span-3 pt-2">
                <button 
                  type="submit"
                  className="w-full bg-brand-red text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md active:scale-[0.98]"
                >
                  Add Detailed Item
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-100">
          {['All', 'Pending', 'Completed'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f as any)}
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-brand-red text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <p className="font-medium">No items found. Time to go shopping!</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div 
                key={item.id} 
                className={`group flex flex-col p-4 rounded-2xl border transition-all ${item.completed ? 'bg-slate-50 border-slate-100' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'}`}
              >
                <div className="flex items-start gap-4">
                  <button 
                    type="button"
                    onClick={() => toggleComplete(item.id)}
                    className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-emerald-500 border-emerald-500 scale-110' : 'border-slate-300 hover:border-brand-red hover:scale-110'}`}
                  >
                    {item.completed && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-lg font-bold break-words ${item.completed ? 'text-slate-400 line-through decoration-2' : 'text-slate-900'}`}>
                        {item.name}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 uppercase tracking-widest border border-slate-200">
                        {item.category}
                      </span>
                    </div>

                    {(item.priceTWD || item.priceLocal || item.couponName) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.priceTWD && (
                          <div className="flex items-center gap-1 bg-red-50 text-brand-red px-2 py-1 rounded-lg text-xs font-bold border border-red-100">
                            <span className="opacity-60">$</span>
                            {item.priceTWD} TWD
                          </div>
                        )}
                        {item.priceLocal && (
                          <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-bold border border-amber-100">
                            {item.priceLocal} {item.localCurrency}
                          </div>
                        )}
                        {item.couponName && (
                          <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-2 py-1 rounded-lg text-xs font-bold border border-rose-100">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                            {item.couponName}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {item.couponUrl && (
                      <a 
                        href={item.couponUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors"
                        title="View Coupon"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                      </a>
                    )}
                    <button 
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all hover:bg-slate-50 rounded-xl"
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
    </div>
  );
};

export default ShoppingList;
